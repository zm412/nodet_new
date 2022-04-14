const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const hbs = require('hbs');
var nano = require('nano')('http://admin:4455@db:5984');
var satellite_db = nano.use('satellite_db');
const { graphqlHTTP } = require("express-graphql");
const schema = require('./schema');
const resolvers = require('./resolvers');
const fs=require("fs")
const { makeExecutableSchema } = require('@graphql-tools/schema')


const app = express();
app.use(express.static(__dirname + '/public'));


const temp = async () => {
  const dblist = await nano.db.list()
 // const doclist = await satellite_db.list({include_docs: true})
      /*
  const response = await satellite_db.destroy('_design/satellite_n', '3-438862191d9b62757eeffb86eba22e5f', (err, res)=>{
    console.log(err, 'err')
    console.log(res, 'res')
  })
    await satellite_db.insert({
  "views": {
    "all_data_type": {
      "map": "function (doc) {\n  if(doc.type)  emit(doc._id, doc);\n}"
    },
    "by_country": {
      "map": "function (doc) {\n  if(doc.type == 'country')  emit(doc._id, doc);\n}"
    },
    "by_satellite": {
      "map": "function (doc) {\n  if(doc.type == 'satellite')  emit(doc._id, doc);\n}"
    }
  }},"_design/satellite_n", function (error, response) {
    console.log("yay");
  }
  )

  */
  //const response = await satellite_db.insert({ _id: '_design/satellite_n', _rev: '3-438862191d9b62757eeffb86eba22e5f', views.all_data_types:{ } })
      //  const doc = await satellite_db.get('_design/satellite_n')
       // console.log(doc, 'doc')
}

temp()

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers
  }),
}))

app.use(cors())

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.listen(5000);
