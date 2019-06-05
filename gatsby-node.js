// createPages API
const path = require('path');
const slug = require('slug')
exports.createPages = ({actions, graphql}) => {
  const {createPage} = actions;
  
  const detailsTemplate = path.resolve('src/templates/details.js');

  return graphql(`
    {
      ihop {
        unqEntities
      }
    }
  `)
  .then( res => {
    if(res.errors) {
      return Promise.reject(res.errors);
    }
	  var pageCount = 0
    res.data.ihop.unqEntities.forEach((id) => {
      if(typeof(id) != 'string')
        return
      // var idenArr = id.split(":")
      // var path = `/details/${slug(idenArr[0])}/${slug(idenArr[idenArr.length-1])}`
      var path = `/details/${id}`
      createPage({
        path: path,
        component: detailsTemplate,
        context: {
          id : id
        }
      })
      console.log(pageCount)
	    pageCount ++
    });
  })
}
