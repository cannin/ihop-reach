module.exports = {
  siteMetadata:{
    title: "iHOP-Reach"
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
  ],
}
