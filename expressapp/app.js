const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
var nano = require('nano')('http://admin:4455@db:5984');
var satellite_db = nano.use('satellite_db');
const { graphqlHTTP } = require("express-graphql");
const schema = require('./schema');
const resolvers = require('./resolvers');
const fs=require("fs")
const { makeExecutableSchema } = require('@graphql-tools/schema')
const  { GraphQLObjectType, GraphQLList,GraphQLInt, GraphQLError } = require('graphql');
const hbs = require('hbs');


const app = express();
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
const temp = async () => {
  const dblist = await nano.db.list()
  const doclist = await satellite_db.list({include_docs: true})
}

temp()

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers,
  }),
}))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", async function(req, res){
  res.render('index')
});

app.listen(5000);
