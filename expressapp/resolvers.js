var nano = require('nano')('http://admin:4455@db:5984');
var satellite_db = nano.use('satellite_db');



const resolvers = {

 
  Query: {

    getAllItems: async () => {
      let queryOptions = {
        reduce: false,
        include_docs: true
      }
      let doc = await satellite_db.view('satellite_n', 'all_data_type', queryOptions)

      //console.log(doc, 'doclist')
      return doc.rows.map(n=>n.doc);
    },

      searchItemByName: async(_, args) => {
        console.log(args, 'str')
          const q = {
             "selector": {
                "_id": { "$gt": null },
                "name": { "$regex": '^' + args.str  }
               }
            }
          let doc = await satellite_db.find(q);

          console.log(doc, 'doc')
          return doc.docs 
        },

      getCountry: async(_, args) => {
        console.log(args.id, 'id')
        const doc = await satellite_db.get(args.id, {include_docs: true});
        console.log(doc, 'doc')
        if(doc.type == 'country'){
          name = doc.name;
          const q = {
            selector: {
              "country_id": doc._id
            },
          };
          const doclist = await satellite_db.find(q);
          doc.satellites = doclist.docs;
          console.log(doc, 'doc')
          return doc;
        }
      },

      getSatellite: async(_, args) => {
        const doc = await satellite_db.get(args.id, {include_docs: true});
          if(doc.type == 'satellite'){
              const q = {
                selector: {
                  _id : doc.country_id 
                },
              };

             const country = await satellite_db.get(doc.country_id, {include_docs: true});
            doc.countries = [ country ]
            console.log(doc, 'doc')
             //return { 'country_name': [country.name], 'satellites': [doc] };
            return doc
          }
      },

      getCountriesByPages: async(_, args) => {
        return getItemsByPage('satellite_n', 'by_country', args.page_num, args.limit_num)
      },

      getSatellitesByPages: async(_, args) => {
        return getItemsByPage('satellite_n', 'by_satellite', args.page_num, args.limit_num)
      } 

  }, 
   SearchResult: {
    __resolveType(obj) {
      //console.log(obj, 'obj')
      if (obj.type == 'country') {
        return 'Country';
      }
      if (obj.type == 'satellite') {
        return 'Satellite';
      }
      return null;
    },
  },

  Mutation: {

   createCountry: async(_, args) => {
     console.log(args, 'args')
    let data = { type: 'country', name: args.input.name, satellites_id: [] };
    const doc = await satellite_db.insert(data, args.input._id);
     console.log(doc, 'NEWCOUNTRY')
    return doc;
 },

   createSatellite: async(_, args) => {
     console.log(args, 'args')
     const q = {
         "selector": {
           "_id":{
              "$or": args.input.country_id
           }
           }
        }
      let doclist1 = await satellite_db.find(q);

     console.log(doclist1, 'validatedarr')
     if(doclist1.docs.length > 0){

      let data = { type: 'satellite', name: args.input.name, country_id: doclist1.docs.map(n=>n._id) };
       console.log(data, 'data')

      satellite_db.insert(data, args.input._id).then(n => {
        doclist1.docs.map(info => {
          let arr = Array.from(info.satellites_id);
          console.log(arr, 'arr')
          //let countryData = { _id: info._id, _rev: info._rev, satellites_id: arr.push(n._id) };
          let countryData = Object.assign({}, info);
          console.log(n.id, 'n')
          console.log(typeof countryData.satellites_id, 'type')
          countryData.satellites_id = arr.concat([n.id])
          console.log(countryData, 'cdata')
          satellite_db.insert(countryData).then(doc => console.log(doc, 'doc'))
            .catch(err => console.log(err, 'err'))
        })
        console.log(n, 'NEWSatellite')
        return n

      }).catch(err => console.log(err, 'err'))
     }
/*
     let validated_arr = args.input.country_id.map((n) => {
     //  let temp = satellite_db.get(n).then(d => d)
      // console.log(temp, 'temp')
       //       })
   if(await validated_arr.length > 0){
      let data = { type: 'satellite', name: args.input.name, country_id: validated_arr.map(n=>n._id) };
      satellite_db.insert(data, args.input._id).then(n => {
        validated_arr.map(info => {
          let countryData = { _id: info._id, _rev: info._rev, satellite_id: info.satellite_id.push(n._id) };
           satellite_db.insert(countryData).then(doc => console.log(doc, 'doc'))
            .catch(err => console.log(err, 'err'))
        })
      }).catch(err => console.log(err, 'err'))
   }
   */
 },

  deleteCountry: async(_, args) => {
   const doc = await satellite_db.destroy(args.input._id, args.input._rev, (err, res)=>{
     console.log(err, 'err')
     console.log(res, 'res')
   })

    /*
      const q = {
         "selector": {
            "_id": { "$gt": null },
            "country_id": args.input._id 
           }
        }
      let doclist1 = await satellite_db.find(q);
    for(let i of doclist1.docs){
      await satellite_db.destroy(i._id, i._rev)
    }
    */

      console.log(doclist1, 'doc')
    return doc;
 },
   deleteSatellite: async(_, args) => {
     satellite_db.get(args.input._id).then(satellite => {
       console.log(satellite, 'sate')
       satellite_db.destroy(args.input._id, args.input._rev).then(deleted_sat => {

           const q = {
             "selector": {
               "_id":{
                  "$or": Array.from(satellite.country_id)
               }
               }
            }
             
           let doclist1 = satellite_db.find(q).then(countries => {
             if(countries.docs.length > 0){
               countries.docs.map(country => {
                  let arr = Array.from(country.satellites_id);
                    console.log(arr, 'arr')
                  let countryData = Object.assign({}, country);
                    console.log(typeof countryData.satellites_id, 'type')
                  let index = arr.indexOf(satellite._id, 0);
                  arr.splice(index, 1);
                    console.log(arr, 'arr')
                  countryData.satellites_id = arr; 
                    console.log(countryData, 'cdata')
                  satellite_db.insert(countryData).then(doc => console.log(doc, 'doc'))
                      .catch(err => console.log(err, 'err'))  
               })

             }
           });

       })


        //const doclist = await satellite_db.destroy(args.input._id)
        //return doclist;
   })
 },

  }

};

async function getItemsByPage(view_family_name, view_name, page_num, limit_num){
  const queryOptions = {
    reduce:false,
    limit: limit_num,
    skip:(page_num-1 )*limit_num,
    include_docs: true
  };

  const doclist = await satellite_db.view(view_family_name, view_name, queryOptions);
  let temp =[];
  for(let i of doclist.rows){
    let obj = i.doc;
    obj.count = doclist.total_rows;
    temp.push(obj)
  }
  return temp 
}

module.exports = resolvers;

