
var schema = `
    type Country {
        _id: ID!
        type: String!
        name: String!
        satellites: [ Satellite ]
    }
    type Satellite {
        _id: String!
        type: String!
        name: String!
        country_id: String!
        countries: [ Country ]
    }


    input CountryInput {
        _id: ID
        type: String!
        name: String!
        satellites: [ SatelliteInput ]
    }

    input SatelliteInput {
        _id: ID
        type: String!
        name: String!
        country_id: ID 
        countries: [ CountryInput ]
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
    }
`



module.exports = schema


