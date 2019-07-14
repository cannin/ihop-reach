import express from 'express'
import compression from 'compression'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import cors from 'cors'
import path from 'path'
import useragent from 'express-useragent'
import uuidv3 from 'uuid/v3'
import { ApolloEngine } from 'apollo-engine'
import { resolvers, context } from './resolvers'
import graphQL_Schema from './schema.graphql'

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
    let uuid = uuidv3(JSON.stringify(req.useragent),'042ffd34-d989-321c-ad06-f60826172424')    
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
          context : {
            db : context,
            uuid : uuid
          }
        }  
      )
      return graphqlFunc(req,res)
    }
  }
)

const engine = new ApolloEngine({
  apiKey: 'service:REACH:IFvX9jccc4VTgrHwNN8t7g'
});

engine.listen({
  port: PORT,
  expressApp: app
});

console.log(`Server ready at http://localhost:${PORT}/`)
