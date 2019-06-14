module.exports = {
  siteMetadata:{
    title: "Reach"
  },
  plugins: [
    `gatsby-plugin-flow`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve : `gatsby-plugin-google-analytics`,
      options: {
        trackingId : "GA000000",
        head: false // True to write Google Analytics details in head tag
      }
    },
    {
      resolve: `gatsby-source-mongodb`,
      options: {
          
          dbName: `iHOP`,
          collection: `identifier_mapping`,
          connectionString: process.env.GATSBY_Mongo_SRV,
          extraParams: { 
            replicaSet: "test-shard-0",
            ssl: true,
            authSource: "admin" 
          }
        },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "iHOP",
        // This is the field under which it's accessible
        fieldName: "ihop",
        // URL to query from
        url: `${process.env.GATSBY_GRAPHQL_API_HOST}/graphql`,
      },
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages : [
          {
            name : 'en'
          }
        ],
        fields: [
          {
            name : 'ide', store: true
          },
          {
            name : 'syn', store: true
          }
        ],
        resolvers: {
          mongodbIHOPIdentifier_mapping: {
            ide : node => node.iden, //  Identifier
            syn : node => node.syn,   //  Synonyms
          }
        },
        filename: 'search_index.json'
      }
    }
  ],
}
