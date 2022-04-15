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

      console.log(doc, 'doclist')
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
        console.log(args, 'id')
        const doc = await satellite_db.get(args.id, {include_docs: true});
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
        const queryOptions = {
          reduce:false,
          limit: args.limit_num,
          skip:(args.page_num-1 )*args.limit_num,
          include_docs: true
        };

        const doclist = await satellite_db.view( 'satellite_n', 'by_country', queryOptions);
        //console.log(doclist.rows.map(n=>n.doc), 'doclist')
        return doclist.rows.map(n=> n.doc);
      },


      getSatellitesByPages: async(_, args) => {
        const queryOptions = {
          reduce:false,
          limit: args.limit_num,
          skip:(args.page_num-1 )*args.limit_num,
          include_docs: true
        };

        const doclist = await satellite_db.view( 'satellite_n', 'by_satellite', queryOptions);
        //console.log(doclist.rows.map(n=>n.doc), 'doclist')
        return doclist.rows.map(n=> n.doc);
      },

 
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
    let data = { type: 'country', name: args.input.name };
    const doc = await satellite_db.insert(data, args.input._id);
     console.log(doc, 'NEWCOUNTRY')
    return doc;
 },

   createSatellite: async(_, args) => {
     console.log(args, 'args')
    let data = { type: 'satellite', name: args.input.name, country_id: args.input.country_id };
    const doc = await satellite_db.insert(data, args.input._id);
     console.log(doc, 'NEWSatellite')
    return doc;
 },

  deleteCountry: async(_, args) => {
   const doc = await satellite_db.destroy(args.input._id, args.input._rev, (err, res)=>{
     console.log(err, 'err')
     console.log(res, 'res')
   })

     console.log(args, 'args')
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

      console.log(doclist1, 'doc')
    return doc;
 },
   deleteSatellite: async(_, args) => {
      const doc = await satellite_db.destroy(args.input._id, args.input._rev, (err, res)=>{
      console.log(err, 'err')
      console.log(res, 'res')
  })
    return doc;
 },

  }

};

module.exports = resolvers;

