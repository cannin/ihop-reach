const express = require('express');
const compression =  require('compression')
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
    "Options for entity type."
    enum entityTypeEnum {
        celltype
        cellular_component
        family
        gene_or_gene_product
        organ
        protein
        simple_chemical
        site
        species
    }
    "Options for interaction type."
    enum interactionTypeEnum {
        adds_modification
        binds
        decreases_activity
        increases_activity
        inhibits_modification
        translocates
    }
    "List of GraphQL Queries the API supports"
    type Query {
        """
            It returns all documents( maximum 250 per page) present in the database

            Example:  
            {\n
                    allDocuments(identifier: "uniprot:Q16595") {  
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
            _id: ID        
            "Page Number"
            page: Int = 1
            "Interaction Type"     
            interaction_type : interactionTypeEnum
            "Negative Information"
            negative_information : Boolean
            "Hypothesis Information"
            hypothesis_information: Boolean 
            "Context Species identifier"
            Species : String
            "Exact match identifier of participant entity"
            identifier : String
            "Participant Entity Text"
            entity_text: String
            "Participant Entity Type"
            entity_type : entityTypeEnum
            "Triggering phrase"
            trigger : String
            "Sentence in the article"
            evidence : String
            "PMCID of Article"
            pmc_id : String
        ): [Document]

#		"""
#            It returns single document matching the Object ID
#
#            Example:
#
#            {\n
#                    document(_id: "5d00179ce3318daa924be884") {  
#                        pmc_id  
#                    }  
#            }  
#
#            The query returns pmc_id of the document specifed as argument
#        """
#        document(
#            """
#            Object ID(_id) of the document
#
#            eg *5d00179ce3318daa924be883*
#            """
#            _id: ID!
#        ): Document

		"""
        Returns all the documents of the specified identifier  

        Example:  
        {\n  
                documentsByIdentifier(identifier : "chebi:CHEBI:1"){  
                    documents{  
                        extracted_information{  
                            participant_b{  
                                identifier  
                            }  
                        }  
                    }  
                }  
        }  

        The query will return all documents having participant_a/b.identifier as chebi:CHEBI:1
        """
        documentsByIdentifier(
            "Identifier of the Entity (Case sensitive)"
            identifier: String!
        ): Entities

		"It returns details of all Identifiers details present in database."
        allIdentifiers(limit: Int) : [IdentifierDetails]

		"It returns Identifier details by identifier"
        identifier(
            "Identifier of the Entity (Case sensitive)"
            identifier: String!
        ): IdentifierDetails

#        "It returns all unique identifiers present in database"
#        uniqueIdentifiers(limit: Int): [String]
    }
	
	"Object type for documentByIdentifier query. Returns all articles consisting the searched identifier."    
    type Entities {
        count : Int
        searchkey : String
        documents: [Document]
    }
	"Object type for identifier and allIdentifiers queries. Returns identifier details."
    type IdentifierDetails {
        "Entity Identifier"
        iden : String
        "Entity Synonyms"
        syn : [String]
        "Entity Type"
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
        interaction_type: interactionTypeEnum
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
        entity_type: entityTypeEnum
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

// async function uniIden(db) {
//     return await new Promise(async (resolve, reject) => {
//         var idenArr = await db.collection("identifier_mapping").distinct("iden")
//         var sortedArr = idenArr.sort((x,y) =>{
//             if (x<y)
//                 return 1
//             else if(x>y)
//                 return -1
//             else
//                 return 0
//         })
//         console.log("Total Identifiers: ", sortedArr.length)
//         resolve(sortedArr)
//     })
// }

// Provide resolver functions for schema fields
const collection = "articles" // Set collection name
const dbName = 'iHOP'
const resolvers = {

    //	It returns all Document(250 per page) present in the database
    allDocuments: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        const fieldArr = {
            _id : "_id",
            hypothesis_information : "extracted_information.hypothesis_information",
            interaction_type : "extracted_information.interaction_type",
            negative_information : "extracted_information.negative_information",
            pmc_id : "pmc_id",
            trigger : "trigger",
            evidence : "evidence",
            Species : "extracted_information.context.Species",
            // entity_text : "extracted_information.participant_a/b.entity_text",
            // entity_type : "extracted_information.participant_a/b.entity_type",
            // identifier : "extracted_information.participant_a/b.identifier"
        }
        let andArray = []
        let orArray = []
        let regx,tempRes
        for ( let arg in args ){
            regx = new RegExp(args[arg],"i")
            switch (arg) {
                case "page":                    
                    break
                case "entity_type":
                    orArray = []
                    orArray.push(
                        {
                            "extracted_information.participant_a.entity_type" : regx
                        },
                        {
                            "extracted_information.participant_b.entity_type" : regx
                        }
                    )
                    andArray.push({
                        "$or" : orArray
                    })
                    break
                case "entity_text":
                    orArray = []
                    orArray.push(
                        {
                            "extracted_information.participant_a.entity_text" : regx
                        },
                        {
                            "extracted_information.participant_b.entity_text" : regx
                        }
                    )
                    andArray.push({
                        "$or" : orArray
                    })
                    break
                case "identifier":
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
                    if(arg == "negative_information" || arg == "hypothesis_information")
                        fieldObj[fieldArr[arg]] = args[arg]
                    else if(arg == "_id"){
                        args.page = 0
                        fieldObj["_id"] = new ObjectId(args._id)
                    }
                    else
                        fieldObj[fieldArr[arg]] = regx
                    andArray.push(fieldObj)
                    break
            }
        }
        let filter = {}
        if(andArray.length>0)
            filter["$and"] = andArray
        let res
        res = await db.collection(collection).aggregate(
            [
                {$match : filter},
                {$skip : args.page < 1 ? 0 : (args.page - 1) * 250},
                {$limit : 250}
            ]
        ).toArray()
        client.close()
        return res
        }
    ),

    //	It returns single document matching the document Object ID
    // document: (args, context) => context().then(async client => {
    //     let db = client.db(dbName)
    //     let res = await db.collection(collection).findOne(ObjectId(args._id))
    //     client.close()
    //     return res
    // }),

    // Returns all the document of the specified identifier
    // TODO change to documentByIdentifier after making necessory changes in GatsbyJS
    documentsByIdentifier: (args, context) => context().then(client => {
        let db = client.db(dbName)
        const id = args.identifier.trim()
        let nameArr = []
        return db.collection(collection).find({
            $or: [{
                "extracted_information.participant_a.identifier": id
            }, {
                "extracted_information.participant_b.identifier": id
            }]
        }).toArray().then((arr) => {
            client.close()
            return {
                "documents": arr,
                "count": arr.length,
                "searchkey": id
            }
        })
    }),
    //	It returns all unique identifiers present in database
    // uniqueIdentifiers: async (args, context) => {        
    //     return await context().then(async client => {
    //         let db = client.db(dbName)
    //         return uniIden(db).then((r) => {
    //             client.close();

    //         })
    //     })
    // },
    //	It returns details of all Entities present in database by identifiers.
    allIdentifiers: (args, context) => context().then(async client => {
        let db = client.db(dbName)        
        let res = await db.collection("identifier_mapping").find().toArray()
        client.close()
        let limit = args["limit"]>0?args["limit"]:res.length
        return res.sort((a,b)=>{
            x = a.iden
            y = b.iden
            if (x<y)
                return -1
            else if(x>y)
                return 1
            else
                return 0
        }).slice(0,limit)
    }),
    //	It returns Entity details by identifier
    identifier: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        let res = await db.collection("identifier_mapping").findOne({"iden": args.identifier})
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
app.use(compression())
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
