
var schema = `
    type Country {
        _id: ID!
        _rev: String
        type: String!
        name: String!
        satellites: [ Satellite ]
    }
    type Satellite {
        _id: String!
        _rev: String
        type: String!
        name: String!
        country_id: String!
        countries: [ Country ]
    }


    input CountryInput {
        _id: String! 
        name: String!
    }

    input SatelliteInput {
        _id: String! 
        name: String!
        country_id: String! 
    }

    input RemoveItemInput {
        _id: String!
        _rev: String!
    }

    union SearchResult = Satellite | Country

    type Query {
      getAllItems: [SearchResult]
      getCountry(id: ID): Country 
      getSatellite(id: ID): Satellite
      getSatellitesByPages(page_num: Int!, limit_num: Int!): [ Satellite ]
      getCountriesByPages(page_num: Int!, limit_num: Int!): [ Satellite ]
      searchItemByName(str: String): [ SearchResult ]
    }

    type Mutation {
      createCountry(input: CountryInput): Country
      createSatellite(input: SatelliteInput): Satellite 
      deleteCountry(input: RemoveItemInput): Country 
      deleteSatellite(input: RemoveItemInput): Satellite 
    }
`



module.exports = schema


