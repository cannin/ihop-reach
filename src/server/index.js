import express from 'express'
import { resolvers, context } from './resolvers'
import compression from 'compression'
import graphqlHTTP from 'express-graphql'
import graphQL_Schema from './schema.graphql'
import { buildSchema } from 'graphql'
import cors from 'cors'
import path from 'path'
import useragent from 'express-useragent'

const schema = buildSchema(graphQL_Schema)
const app = express()
app.use(compression())
app.use(cors())
app.use(useragent.express());

const PORT = process.env.PORT || 8080

const react_build_dir = path.join(__dirname, '../graphiql/build')
app.use('/favicon.ico',(req,res)=>res.sendFile(react_build_dir + req.originalUrl))
app.use(
  '*',
  (req,res)=>{
    // respond with html page
    if (req.useragent.browser != 'node-fetch' && req.accepts('html') && req.method == 'GET') {
      res.status(200).sendFile(react_build_dir + req.originalUrl, (err) =>{
          if(err){
            res.sendFile(react_build_dir + '/index.html');
          }
        } 
      )
    }
    // respond with json
    else{
      const graphqlFunc = graphqlHTTP({
          schema,
          rootValue: resolvers,
          graphiql: false,
          context
        }  
      )
      return graphqlFunc(req,res)
    }
  }
)

app.listen(PORT)

console.log(`Server ready at http://localhost:${PORT}/`)