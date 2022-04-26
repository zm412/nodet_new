var nano = require("nano")("http://admin:4455@db:5984");
var satellite_db = nano.use("satellite_db");
//const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(url);
  console.log(`🚀  Server ready at ${url}`);
});
