const express = require('express');
const async = require("async");
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { MongoClient, ObjectId } = require('mongodb');

//Connection to MongoDB Database
const context = () => MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(client => client.db('iHOP'));
// A Schema, using GraphQL schema language
const schema = buildSchema(`
    "List of GraphQL Queries the API supports"
    type Query {
		"Returns all the articles of the specified identifier"
        articlesByIdentifier(id: String!): Entities

		"It returns all unique identifiers present in database"
        uniqueIdentifiers: [String]

		"It returns details of all Entities present in database by identifiers."
        allIdentifiers : [IdentifierDetails]

		"It returns Entity details by identifier"
        identifier(id: String!) : IdentifierDetails

		"It returns all articles(250 per page) present in the database"
        allArticles(page: Int): [Article]

		"It returns single article matching the document Object ID"
        article(id: ID!): Article
    }
	
	"Object type for articlesByIdentifier query. Returns all articles consisting the searched identifier."    
    type Entities {
        count : Int
        searchkey : String
        articles: [Article]
    }
	"Object type for identifier and allIdentifiers queries. Returns identifier details."
    type IdentifierDetails {
        iden : String
        syn : [String]
        typ: String
    }
	"Object type for article and allArticles queries. Returns all Biomedical details from the extracted article details."
    type Article {	
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
    return await new Promise(async (resolve,reject) => {
        var arrA = await db.collection(collection).distinct("extracted_information.participant_a.identifier",{$and : [{"extracted_information.participant_a.identifier" : { $not : /^uazid/}}]})
        var arrB = await db.collection(collection).distinct("extracted_information.participant_b.identifier",{$and : [{"extracted_information.participant_b.identifier" : { $not : /^uazid/}}]})
        var mergedArray = [...new Set([...arrB , ...arrA])].sort()
        var entityArr = []
        var idenArr = []
        var tempArr = []
        console.log("Total Identifiers: ", mergedArray.length)
	resolve(mergedArray)
        }
    )
}

// Provide resolver functions for schema fields
const collection = "articles" // Set collection name
const resolvers = {
	//	Returns all the articles of the specified identifier
    articlesByIdentifier: (args, context) => context().then(db => {
           const id = args.id.trim()
           console.log(id)   
           let nameArr = []
           return db.collection(collection).find({$and:[{ $or : [{"extracted_information.participant_a.identifier" : id},{"extracted_information.participant_b.identifier" : id}]}]}).collation( { locale: 'en', strength: 2 } ).toArray().then((arr) =>{
                    
                    return {
                        "articles" : arr,
                        "count" : arr.length,
                        "searchkey" : id
                    }
                }
            )
        }
    ),
	//	It returns all unique identifiers present in database
    uniqueIdentifiers: async (args, context) => {
                return await context().then( async db => {                    
                    return uniIden(db).then((r) => r)
                }
            )
        },
    //	It returns details of all Entities present in database by identifiers.
    allIdentifiers: (args, context) => context().then(db => {
            return db.collection("identifier_mapping").find().toArray()
        }
    ),
   	//	It returns Entity details by identifier
    identifier: (args, context) => context().then(db => db.collection("identifier_mapping").findOne({"iden" : args.id})),
    //	It returns all articles(250 per page) present in the database
    allArticles: (args, context) => context().then(db => db.collection(collection).find().skip(args.page<1?0:(args.page-1)*250 || 1).limit(250).toArray()),
    //	It returns single article matching the document Object ID
    article: (args, context) => context().then(db => db.collection(collection).findOne(ObjectId(args.id)))
  };

// Starting the application
const app = express();
const PORT = process.env.PORT || 8080
app.use('/', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
  context
}));
app.listen(PORT);

console.log(`Server ready at http://localhost:${PORT}/`);
