const graphQL_API = process.env.GATSBY_GRAPHQL_API_HOST || "https://reach-api.nrnb-docker.ucsd.edu"
const mongodbSRV = process.env.GATSBY_MONGO_HOST || "mongodb://localhost:27017"
console.log("GraphQL",graphQL_API)
console.log("MongoDB",mongodbSRV)
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
        trackingId : "UA-57486113-10",
        head: true // True to write Google Analytics details in head tag
      }
    },
    {
      resolve: `gatsby-source-mongodb`,
      options: {
          connectionString : mongodbSRV,
          dbName: `iHOP`,
          collection: `identifier_mapping`,
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
        url: graphQL_API
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
    },
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        cacheId: `reach-sw`,
        // Don't cache-bust JS or CSS files, and anything in the static directory,
        // since these files have unique URLs and their contents will never change
        dontCacheBustUrlsMatching: /(\.js$|\.css$|static\/)/,
        runtimeCaching: [
          {
            // Use cacheFirst since these don't need to be revalidated (same RegExp
            // and same reason as above)
            urlPattern: /(\.js$|\.css$|static\/)/,
            handler: `cacheFirst`,
          },
          {
            // Search in cache and then revalidate in network
            urlPattern: /search_index\.json/,
            handler: `staleWhileRevalidate`,
          },
          {
            // Add runtime caching of various other page resources
            urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
            handler: `staleWhileRevalidate`,
          },
          {
            // Google Fonts CSS (doesn't end in .css so we need to specify it)
            urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
            handler: `staleWhileRevalidate`,
          },
        ]
      }
    }
  ],
}
