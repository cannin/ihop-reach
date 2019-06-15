const express = require('express');
const async = require("async");
const graphqlHTTP = require('express-graphql');
const {
    buildSchema
} = require('graphql');
const {
    MongoClient,
    ObjectId
} = require('mongodb');

//Connection to MongoDB Database
const context = () => MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    })
    .then(client => client);
// A Schema, using GraphQL schema language
const schema = buildSchema(`
    "List of GraphQL Queries the API supports"
    type Query {
        """
            It returns all documents( maximum 250 per page) present in the database

            Example:
            
            {
            
                allDocuments(iden: "uniprot:Q16595") {
            
                    pmc_id
            
                    extracted_information {
            
                        participant_b {
            
                            identifier
            
                        }
            
                        participant_a {
            
                            identifier
            
                        }
            
                    }
            
                }
            
            }

            The query will return pmc_id and participant information of documents having identifier uniprot:Q16595
        """
        allDocuments(            
            "Page Number"
            page: Int = 1
            "Hypothesis Information"
            hypothesis: Boolean 
            "Interaction Type"     
            interactionType : String
            "Negative Information"
            negInfo : Boolean
            "Participant Entity Text"
            entityText: String
            "Participant Entity Type"
            entityType : String
            "Exact match PMCID of Article"
            pmc : String
            "Triggering phrase"
            trigger : String
            "Sentence in the article"
            evidence : String
            "Context Species"
            species : String
            "Exact match Identifier of participant entity"
            iden : String
        ): [Document]

		"""
            It returns single document matching the  Object ID

            Example:

            {
            
                document(id: "5d00179ce3318daa924be884") {
                
                    pmc_id
                
                }
            
            }  

            The query returns pmc_id of the document specifed as argument
        """
        document(
            """
            Object ID(_id) of the document

            eg *5d00179ce3318daa924be883*
            """
            id: ID!
        ): Document

		"Returns all the articles of the specified identifier"
        articlesByIdentifier(
            "Identifier of the Entity"
            id: String!
        ): Entities

		"It returns all unique identifiers present in database"
        uniqueIdentifiers: [String]

		"It returns details of all Entities present in database by identifiers."
        allIdentifiers : [IdentifierDetails]

		"It returns Entity details by identifier"
        identifier(
            "Identifier of the Entity"
            id: String!
        ): IdentifierDetails
    }
	
	"Object type for documentByIdentifier query. Returns all articles consisting the searched identifier."    
    type Entities {
        count : Int
        searchkey : String
        articles: [Document]
    }
	"Object type for identifier and allIdentifiers queries. Returns identifier details."
    type IdentifierDetails {
        iden : String
        syn : [String]
        typ: String
    }
	"Object type for article and allArticles queries. Returns all Biomedical details from the extracted article details."
    type Document {	
        _id: ID
        "Relevant text from the article."        
        evidence: [String]
        "Extracted information from the evidence"
        extracted_information: Extracted_information
        model_relation: String
        "PMC ID of the article"
        pmc_id: String
        reader_type: String
        reading_complete: String
        reading_started: String
        score: Int
        submitter: String
        trigger: String
    }
    "Contains the extracted information from the evidence text"
    type Extracted_information{
        context: Context
        hypothesis_information: Boolean
        interaction_type: String
        modifications: [Modification]
        negative_information: Boolean
        "Array containing Details of the relevant Biological entities"
        participant_b: [Participant]
        "Array containing Details of the relevant Biological entities"
        participant_a: [Participant]
        binding_site: [String]
        from_location_id : String
        from_location_text : String
        to_location_id : String
        to_location_text : String
    }
    "Details of the relevant Biological entities"
    type Participant{
        entity_text: String
        entity_type: String
        features: [Feature]
        in_model: Boolean
        "Unique identifier associated with the entity"
        identifier: String
    }
    "Contains features of the entity"
    type Feature{
        feature_type: String
        modification_type: String
        position: String
        evidence: String
        to_base: String
        site: Int
    }
    "Shows characteristics of the trigger word"
    type Modification{
        modification_type: String
        position: String
    }
    type Context{
        CellType: [String]
        Organ: [String]
        Species: [String]
    }    
`);

// TODO Change function
async function uniIden(db) {
    return await new Promise(async (resolve, reject) => {
        var arrA = await db.collection(collection).distinct("extracted_information.participant_a.identifier", {
            $and: [{
                "extracted_information.participant_a.identifier": {
                    $not: /^uazid/
                }
            }]
        })
        var arrB = await db.collection(collection).distinct("extracted_information.participant_b.identifier", {
            $and: [{
                "extracted_information.participant_b.identifier": {
                    $not: /^uazid/
                }
            }]
        })
        var mergedArray = [...new Set([...arrB, ...arrA])].sort()
        var entityArr = []
        var idenArr = []
        var tempArr = []
        console.log("Total Identifiers: ", mergedArray.length)
        resolve(mergedArray)
    })
}

// Provide resolver functions for schema fields
const collection = "articles" // Set collection name
const dbName = 'iHOP'
const resolvers = {

    //	It returns all Document(250 per page) present in the database
    allDocuments: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        const fieldArr = {
            hypothesis : "extracted_information.hypothesis_information",
            interactionType : "extracted_information.interaction_type",
            negInfo : "extracted_information.negative_information",
            pmc : "pmc_id",
            trigger : "trigger",
            evidence : "evidence",
            species : "extracted_information.context.Species",
            // entityText : "extracted_information.participant_a/b.entity_text",
            // entityType : "extracted_information.participant_a/b.entity_type",
            // iden : "extracted_information.participant_a/b.identifier"
        }
        let andArray = []
        let orArray = []
        for ( let arg in args ){
            switch (arg) {
                case "page":                    
                    break
                case "entityType":
                    orArray = []
                    orArray.push(
                        {
                            "extracted_information.participant_a.entity_type" : args[arg]
                        },
                        {
                            "extracted_information.participant_b.entity_type" : args[arg]
                        }
                    )
                    andArray.push({
                        "$or" : orArray
                    })
                    break
                case "entityText":
                    orArray = []
                    orArray.push(
                        {
                            "extracted_information.participant_a.entity_text" : args[arg]
                        },
                        {
                            "extracted_information.participant_b.entity_text" : args[arg]
                        }
                    )
                    andArray.push({
                        "$or" : orArray
                    })
                    break
                case "iden":
                    orArray = []
                    orArray.push(
                        {
                            "extracted_information.participant_a.identifier" : args[arg]
                        },
                        {
                            "extracted_information.participant_b.identifier" : args[arg]
                        }
                    )
                    andArray.push({
                        "$or" : orArray
                    })
                    break
                default:
                    let fieldObj = {}
                    fieldObj[fieldArr[arg]] = args[arg]
                    andArray.push(fieldObj)
                    break
            }
        }
        let filter = {}
        if(andArray.length>0)
            filter["$and"] = andArray
        let res = await db.collection(collection).find(filter).skip(args.page < 1 ? 0 : (args.page - 1) * 250 || 1).limit(250).toArray()
        client.close()
        return res
        }
    ),

    //	It returns single document matching the document Object ID
    document: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        let res = await db.collection(collection).findOne(ObjectId(args.id))
        client.close()
        return res
    }),

    // Returns all the document of the specified identifier
    // TODO change to documentByIdentifier after making necessory changes in GatsbyJS
    articlesByIdentifier: (args, context) => context().then(client => {
        let db = client.db(dbName)
        const id = args.id.trim()
        console.log(id)
        let nameArr = []
        return db.collection(collection).find({
            $and: [{
                $or: [{
                    "extracted_information.participant_a.identifier": id
                }, {
                    "extracted_information.participant_b.identifier": id
                }]
            }]
        }).collation({
            locale: 'en',
            strength: 2
        }).toArray().then((arr) => {
            client.close()
            return {
                "articles": arr,
                "count": arr.length,
                "searchkey": id
            }
        })
    }),
    //	It returns all unique identifiers present in database
    uniqueIdentifiers: async (args, context) => {
        return await context().then(async client => {
            let db = client.db(dbName)
            return uniIden(db).then((r) => {
                client.close();
                return r
            })
        })
    },
    //	It returns details of all Entities present in database by identifiers.
    allIdentifiers: (args, context) => context().then(async client => {
        let db = client.db(dbName)        
        let res = await db.collection("identifier_mapping").find().toArray()
        client.close()
        return res
    }),
    //	It returns Entity details by identifier
    identifier: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        let res = await db.collection("identifier_mapping").findOne({"iden": args.id})
        client.close()
        return res
        }
    )
};
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
// Starting the application
const app = express();
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
