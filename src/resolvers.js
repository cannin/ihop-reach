import { MongoClient } from "mongodb";
//Connection to MongoDB Database
const context = () => MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    })
    .then(client => client);
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
                            "extracted_information.participant_a.identifier" : regx
                        },
                        {
                            "extracted_information.participant_b.identifier" : regx
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
                {$limit : 250},
              //   {$lookup: {
              //     'from': 'pubmed', 
              //     'let': {
              //         'pmc': '$pmc_id'
              //     }, 
              //     'pipeline': [
              //         {
              //         '$match': {
              //             '$expr': {
              //                 '$or' : [
              //                     {'$eq': ['$pmcid', {'$concat' : ["PMC",'$$pmc']}]},
              //                     {'$eq': ['$pmcid', '$$pmc']}             
              //                 ]
              //             }
              //         }
              //         }
              //     ], 
              //     'as': 'pubmed'
              //     }
              // }, {
              //     '$addFields': {
              //     'publication_year': {
              //         '$ifNull': [
              //         {
              //             '$arrayElemAt': ['$pubmed.year', 0]
              //         },  ''
              //         ]
              //     }
              //     }
              // }, {
              //     '$sort': {
              //         'publication_year': -1
              //     }
              // }
            ],
           {
             allowDiskUse: true
           }
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

	// It returns PubMed details by PMCID
    getPubMedDetails: (args, context) => context().then(async client => {
        let db = client.db(dbName)
        let query = args.pmcid.toUpperCase()
        // let res = await db.collection("pubmed").find({"pmcid" : query}).limit(1)
        let res = await db.collection("pubmed").findOne({"$or" : [{"pmcid" : query},{"pmcid" : "PMC" + query}]})
        client.close()
        return res
    }),
    // Returns all the document of the specified identifier    
    documentsByIdentifier: (args, context) => context().then(client => {
        let db = client.db(dbName)
        const id = args.identifier.trim()
        const regx = id
        let nameArr = []
        return db.collection(collection).aggregate([
            {
                '$match': {
                '$or': [
                    {
                    'extracted_information.participant_a.identifier': regx
                    }, {
                    'extracted_information.participant_b.identifier': regx
                    }
                ]
                }
            }, {
                '$lookup': {
                'from': 'pubmed', 
                'let': {
                    'pmc': '$pmc_id'
                }, 
                'pipeline': [
                    {
                    '$match': {
                        '$expr': {
                            '$or' : [
                                {'$eq': ['$pmcid', {'$concat' : ["PMC",'$$pmc']}]},
                                {'$eq': ['$pmcid', '$$pmc']}             
                            ]
                        }
                    }
                    }
                ], 
                'as': 'pubmed'
                }
            }, {
                '$addFields': {
                'publication_year': {
                    '$ifNull': [
                    {
                        '$arrayElemAt': ['$pubmed.year', 0]
                    },  ''
                    ]
                }
                }
            }, {
                '$sort': {
                    'publication_year': -1
                }
            }
            ],
           {
             allowDiskUse: true
           }
	).toArray().then((arr) => {
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
        let x,y
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

export {resolvers,context}