import express from 'express'
import {resolvers,context} from './resolvers'
import compression from 'compression'
import graphqlHTTP from 'express-graphql'
import graphQL_Schema from './schema.graphql'
import {buildSchema} from 'graphql'

const schema =  buildSchema(graphQL_Schema)
const app = express()
app.use(compression())

const welcomeMsg = `
# Welcome to REACH GraphQL API explorer
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#       Run Query:  Ctrl-Enter (or press the play button above)
#   Auto Complete:  Ctrl-Space (or just start typing)
#
# At the top right corner of your screen you can find "Docs", clicking on
# which will open Documentation Explorer which lets you access the definations and accepted arguments by the
# query functions.
#
# Following is an example query which returns pmc_id and participant_a 
# information of the documents in the database

{
  allDocuments{
    pmc_id
    extracted_information{
      participant_a{
        entity_text
        identifier
      }
    }
  }
}

# Following is an example of a REACH file as stored in our database
# {
#     "_id" : ObjectId("5d00162be3318daa924b9959"),
#     "submitter" : "Reach",
#     "model_relation" : "extension",
#     "extracted_information" : {
#         "interaction_type" : "decreases_activity",
#         "negative_information" : false,
#         "hypothesis_information" : false,
#         "context" : {
#             "Species" : [ 
#                 "taxonomy:10535"
#             ]
#         },
#         "participant_b" : [ 
#             {
#                 "in_model" : true,
#                 "identifier" : "uniprot:P29972",
#                 "entity_text" : "AQP1",
#                 "entity_type" : "protein"
#             }
#         ],
#         "participant_a" : [ 
#             {
#                 "in_model" : true,
#                 "identifier" : "interpro:IPR000818",
#                 "entity_text" : "TEA",
#                 "entity_type" : "family"
#             }
#         ]
#     },
#     "reading_complete" : "2016-01-08T14:49:54Z",
#     "reader_type" : "machine",
#     "reading_started" : "2016-01-08T14:48:55Z",
#     "trigger" : "Block",
#     "evidence" : [ 
#         "Block by TEA of AQP1"
#     ],
#     "pmc_id" : "100781",
#     "score" : 0
# }
`

const PORT = process.env.PORT || 8080
app.use('/', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: {
        defaultQuery: welcomeMsg
    },
    context
}));
app.listen(PORT);

console.log(`Server ready at http://localhost:${PORT}/`);