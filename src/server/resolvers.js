import { MongoClient } from "mongodb";
import request from "request";

//Connection to MongoDB Database
const context = () =>
  MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true
  }).then(client => client);

const collection = "articles"; // Set collection name
const dbName = "iHOP";

const analytics = (context, query) => {
  //Skip analytics in case of GatsbyJS Build process
  if (context.isGatsbyBuild == true) return;
  const GA_ID = "UA-57486113-9"; // Google Analytics Tracking Tag
  const client_ip = context.ip;
  const uuid = context.uuid;
  const payload = `v=1&t=pageview&tid=${GA_ID}&ni=1&dt=${query}&ds=API&cid=${uuid}&dp=api/${query}&uip=${client_ip}`;
  request.post(
    { url: "https://www.google-analytics.com/collect", body: payload },
    err => {
      if (err) {
        return console.error("Analytics failed:", err);
      }
    }
  );
};

// Aggregate pipeline to join Pubmed Collection
const aggregatePubmedAddFields =  
            {
              $addFields: {
                publication_year: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.year", 0]
                    },
                    ""
                  ]
                },
                journal_title: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.journal_title", 0]
                    },
                    ""
                  ]
                },
                pmid: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.pmid", 0]
                    },
                    ""
                  ]
                },
                doi: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.doi", 0]
                    },
                    ""
                  ]
                },
                mesh_headings: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.mesh_headings", 0]
                    },
                    []
                  ]
                },                             
                article_type: {
                  $ifNull: [
                    {
                      $arrayElemAt: ["$pubmed.article_type", 0]
                    },
                    ""
                  ]
                },                
              }
            }

const resolvers = {
  //	It returns all Document(250 per page) present in the database
  allDocuments: (args, context) =>
    context.db().then(async client => {
      analytics(context, "allDocuments");
      let db = client.db(dbName);
      const fieldArr = {
        _id: "_id",
        hypothesis_information: "extracted_information.hypothesis_information",
        interaction_type: "extracted_information.interaction_type",
        negative_information: "extracted_information.negative_information",
        pmc_id: "pmc_id",
        trigger: "trigger",
        evidence: "evidence",
        Species: "extracted_information.context.Species"
        // entity_text : "extracted_information.participant_a/b.entity_text",
        // entity_type : "extracted_information.participant_a/b.entity_type",
        // identifier : "$text"
      };
      let andArray = [];
      let orArray = [];
      let regx, tempRes;
      for (let arg in args) {
        regx = new RegExp(args[arg], "i");
        switch (arg) {
          case "page":
            break;
          case "entity_type":
            orArray = [];
            orArray.push(
              {
                "extracted_information.participant_a.entity_type": regx
              },
              {
                "extracted_information.participant_b.entity_type": regx
              }
            );
            andArray.push({
              $or: orArray
            });
            break;
          case "entity_text":
            orArray = [];
            orArray.push(
              {
                "extracted_information.participant_a.entity_text": regx
              },
              {
                "extracted_information.participant_b.entity_text": regx
              }
            );
            andArray.push({
              $or: orArray
            });
            break;
          case "identifier":
            // orArray = [];
            // orArray.push(
            //   {
            //     "extracted_information.participant_a.identifier": regx
            //   },
            //   {
            //     "extracted_information.participant_b.identifier": regx
            //   }
            // );

            // Use Text index to search
            andArray.push({
              $text: {
                $search : '\"' + args['identifier'] + '\"'
              }
            });
            break;
          default:
            let fieldObj = {};
            if (
              arg == "negative_information" ||
              arg == "hypothesis_information"
            )
              fieldObj[fieldArr[arg]] = args[arg];
            else if (arg == "_id") {
              args.page = 0;
              fieldObj["_id"] = new ObjectId(args._id);
            } else fieldObj[fieldArr[arg]] = regx;
            andArray.push(fieldObj);
            break;
        }
      }
      let filter = {};
      if (andArray.length > 0) filter["$and"] = andArray;
      let res;
      res = await db
        .collection(collection)
        .aggregate(
          [
            { $match: filter },
            { $skip: args.page < 1 ? 0 : (args.page - 1) * 250 }, // Per query documents limit
            { $limit: 250 }, // Per query documents limit
            {
              $lookup: {
                from: "pubmed",
                let: {
                  pmc: "$pmc_id"
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ["$pmcid", { $concat: ["PMC", "$$pmc"] }] },
                          { $eq: ["$pmcid", "$$pmc"] }
                        ]
                      }
                    }
                  }
                ],
                as: "pubmed"
              }
            },
            aggregatePubmedAddFields,
            // {
            //     '$sort': {
            //         'publication_year': -1
            //     }
            // },
          ],
          {
            allowDiskUse: true
          }
        )
        .toArray();
      client.close();
      return res;
    }),

  // It returns PubMed details by PMCID
  getPubMedDetails: (args, context) =>
    context.db().then(async client => {
      analytics(context, "getPubMedDetails");
      let db = client.db(dbName);
      let query = args.pmcid.toUpperCase();
      let res = await db
        .collection("pubmed")
        .findOne({ $or: [{ pmcid: query }, { pmcid: "PMC" + query }] });
      client.close();
      return res;
    }),

  // Returns all the document of the specified identifier
  documentsByIdentifier: (args, context) =>
    context.db().then(client => {
      analytics(context, "documentsByIdentifier");
      let db = client.db(dbName);
      const id = args.identifier.trim();
      // const regx = id;
      let nameArr = [];
      return db
        .collection(collection)
        .aggregate(
          [
            {
              $match: {
                $or: [
                  {
                    "extracted_information.participant_a.identifier": id
                  },
                  {
                    "extracted_information.participant_b.identifier": id
                  }
                ]
              }
            },
            {
              $lookup: {
                from: "pubmed",
                let: {
                  pmc: "$pmc_id"
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ["$pmcid", { $concat: ["PMC", "$$pmc"] }] },
                          { $eq: ["$pmcid", "$$pmc"] }
                        ]
                      }
                    }
                  }
                ],
                as: "pubmed"
              }
            },
            aggregatePubmedAddFields,
            {
              $sort: {
                publication_year: -1
              }
            }
          ],
          {
            allowDiskUse: true
          }
        )
        .toArray()
        .then(arr => {
          client.close();
          return {
            documents: arr,
            count: arr.length,
            searchkey: id
          };
        });
    }),

  //	It returns details of all Entities present in database by identifiers.
  allIdentifiers: (args, context) =>
    context.db().then(async client => {
      analytics(context, "allIdentifiers");
      let db = client.db(dbName);
      let res = await db
        .collection("identifier_mapping")
        .find()
        .toArray();
      client.close();
      let limit = args["limit"] > 0 ? args["limit"] : res.length;
      let x, y;
      return res
        .sort((a, b) => {
          x = a.iden;
          y = b.iden;
          if (x < y) return -1;
          else if (x > y) return 1;
          else return 0;
        })
        .slice(0, limit);
    }),
    
  //	It returns Entity details by identifier
  identifier: (args, context) =>
    context.db().then(async client => {
      analytics(context, "identifier");
      let db = client.db(dbName);
      let res = await db
        .collection("identifier_mapping")
        .findOne({ iden: args.identifier });
      client.close();
      return res;
    })
};

export { resolvers, context };
