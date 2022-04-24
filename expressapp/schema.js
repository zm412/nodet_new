var schema = `
    type Country {
        _id: ID!
        _rev: String
        count: Int 
        type: String!
        name: String!
        satellites: [Satellite]
    }
    type Satellite {
        _id: ID!
        _rev: String
        count: Int 
        type: String!
        name: String!
        country_id: [ID]
        countries: [ ID!]
    }


    input CountryInput {
        name: String!
    }

    input SatelliteInput {
        name: String!
        country_id: [ID!] 
    }

    input RemoveItemInput {
        _id: ID!
        _rev: String!
    }

    union SearchResult = Satellite | Country

    type Query {
      getAllItems: [SearchResult]
      getCountry(id: ID!): Country 
      getSatellite(id: ID): Satellite
      getSatellitesByPages(page_num: Int!, limit_num: Int!): [ Satellite ]
      getCountriesByPages(page_num: Int!, limit_num: Int!): [ Country ]
      getSatellitesByCountryId(country_id: ID!): [Satellite]
      searchItemByName(str: String): [ SearchResult ]
    }

    type Mutation {
      createCountry(input: CountryInput): Country
      createSatellite(input: SatelliteInput): Satellite 
      deleteCountry(input: RemoveItemInput): Country 
      deleteSatellite(input: RemoveItemInput): Satellite 
    }
`;

module.exports = schema;
