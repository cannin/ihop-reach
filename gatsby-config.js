module.exports = {
  siteMetadata:{
    title: "iHOP-Reach"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`
  //   {
  //     resolve: "gatsby-source-graphql",
  //     options: {
  //       // This type will contain remote schema Query type
  //       typeName: "iHOP",
  //       // This is the field under which it's accessible
  //       fieldName: "ihop",
  //       // URL to query from
  //       url: "http://localhost:4000/graphql",
  //     },
  //   },
  ],
}