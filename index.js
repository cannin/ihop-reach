const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { MongoClient, ObjectId } = require('mongodb');

const context = () => MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
    .then(client => client.db('iHOP'));

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    "Queries this API supports"
    type Query {
	"It returns all the articles present in the database"
        articles(page: Int): [Article]
	"It returns single article matching the document Object ID"
        article(id: ID): Article
    }
    "Contains the Biomedical data"
    type Article {	
        _id: ID
        evidence: [String]
        extracted_information: Extracted_information
        model_relation: String
        pmc_id: String
        reader_type: String
        reading_complete: String
        reading_started: String
        score: Int
        submitter: String
        trigger: String
    }
    "Contains extracted information"
    type Extracted_information{
        context: Context
        hypothesis_information: Boolean
        interaction_type: String
        modifications: [Modification]
        negative_information: Boolean
	"Participant B information Description"
        participant_b: Participant
        participant_a: Participant
        binding_site: [String]
        from_location_id : String
        from_location_text : String
        to_location_id : String
        to_location_text : String
    }
    "For participant A and participant B"
    type Participant{
        entity_text: String
        entity_type: String
        features: [Feature]
        in_model: Boolean
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

// Provide resolver functions for your schema fields
const resolvers = {
    articles: (args, context) => context().then(db => db.collection('articles').find().skip(args.page<1?0:(args.page-1)*250).limit(250).toArray()),
    article: (args, context) => context().then(db => db.collection('articles').findOne(ObjectId(args.id)))
  };

// Starting the application
const app = express();
const PORT = process.env.PORT || 4000
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
  context
}));
app.listen(PORT);

console.log(`Server ready at http://localhost:${PORT}/graphql`);
