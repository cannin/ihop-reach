// createPages API
const path = require('path');
const slug = require('slug')
exports.createPages = ({boundActionCreators, graphql}) => {
  const {createPage} = boundActionCreators;
  
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
	var  pageCount = 0
    res.data.ihop.unqEntities.forEach((entity) => {
      if(typeof(entity) != 'string')
        return
      createPage({
        path: `/details/${slug(entity)}`,
        component: detailsTemplate,
        context: {
          name : entity
        }
      })
      console.log(pageCount)
	pageCount ++
    });
  })
}
