# This script's purpose is to import JSON files into local MongoDB.
# Requires pymongo

from pymongo import MongoClient
from collections import defaultdict 

#check database connection
try: 
    mongoConnection = MongoClient()  #Edit MongoDB username and password in this line, MogoClient() if no authorization

except Exception as e:
    #on mongodb connection fail, this indicates that either mongodb is not started or installed in the device
    print(e)
    print("Could not connect to MongoDB") 
    print("Failed to import")
    print("Closing import script")
    quit()      #exiting the script due to absense of Database
print("Connection established")

mongoDatabase = mongoConnection["iHOP"]     #Database name
mongoCollectionS = mongoConnection["iHOP"]["articles"] #Collection name
mongoCollectionD = mongoConnection["iHOP"]["identifier_mapping"] #Collection name
mongoCollectionD.drop()

identifiers = defaultdict(set)
entType = defaultdict(str)
documents = []
errLog = open("errorLog.csv", "a")
#function to add json in MongoDB
def addToDatabase(data):
    if(len(data)==0):
        return 0
    #returns number of inserted documents in the collection
    try:  
        res = mongoCollectionD.insert_many(data)           #Command to insert documents
    except:
        print("Documents insertion failed")         #Incase of any error from mongodb
        errLog.write("Mongo Ins Fail:\t{}\n".format(data))
    return (len(res.inserted_ids))

print("Fetching collection from database")
#articles = mongoCollectionS.find({})
articles = mongoCollectionS.find({})
i = 1
missA = 0
print("Reading documents")
for article in articles:
    info = article["extracted_information"]
    for participant in info["participant_b"]:
        identifiers[participant["identifier"]].add(participant["entity_text"].lower())
        entType[participant["identifier"]] = (participant["entity_type"])
    for participant in info["participant_a"]:
        identifiers[participant["identifier"]].add(participant["entity_text"].lower())
        entType[participant["identifier"]] = (participant["entity_type"])
    print(i, end=" ")
    i += 1
i = 0
print("\nAdding {} identifiers".format(len(entType)))
for iden in identifiers:
    if "uazid" in iden:
        continue
    i += 1    
    obj = {
        "iden" : iden,
        "syn": list(identifiers[iden]),
        "typ": entType[iden]
    }
    documents.append(obj)
    if(len(documents) == 10000):
        print("\tAdded {} documents".format(addToDatabase(documents)))
        documents = []
    print(i,"\t", iden)
addToDatabase(documents)    

#Script termination message
print("\nClosing mapping script")
exit()
