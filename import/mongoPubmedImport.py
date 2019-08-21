import sys,csv,threading
from pymongo import MongoClient

if(len(sys.argv)!=2):
    print("Less arguments provided")
    print("python <SCRIPT_NAME>.py <Source>.csv")
    print("Closing Script")
    quit()
try:
    dataFile = open(sys.argv[1])
    reader = csv.reader(dataFile)
except:
    print("Failed to read input file")
    print("Closing Script")
    quit()
print("Completed Reading File")

# Mongo Functions
url = "localhost"
def refreshCollection():
    # Function deletes the collection if present and makes it again with a index on pmcid
    client = MongoClient("mongodb://{}:27017/".format(url))
    db = client["iHOP"]
    col = db["pubmed"]
    col.drop()
    print("Dropped Collection")
    col.create_index([('pmcid', -1)], name='pmc_index')
    print("Index Created")

def sendToMongo(payload):
    insertList = payload
    client = MongoClient("mongodb://{}:27017/".format(url))
    db = client["iHOP"]
    col = db["pubmed"]
    res = col.insert_many(insertList)
    print("Insered {} documents".format(len(res.inserted_ids)))

payloadLimit = 1000
threadsLimit = 10
refreshCollection()
# Extracting important information
fields = ['journal_title','year','doi','pmcid','pmid','article_type','mesh_headings']
# Saving in CSV file
documents = []
threads = [None] * threadsLimit
count = 0
threadsCount = 0
for row in reader:
    count +=1
    if count == 1:
        # Ignore header of CSV
        continue
    if len(row[3])<2:
        # ignore rows with empty pmcid
        count -=1
        continue
    document = {}
    i = 0
    for field in fields:
        document[field] = row[i]
        i += 1
    document[field] = document[field].split(' , ')
    documents.append(document)
    if count%payloadLimit==0:
        threads[threadsCount] = threading.Thread(target=sendToMongo, args=(documents,))
        threads[threadsCount].start()
        threadsCount += 1
        documents = []
    if threadsCount==threadsLimit:
        for x in threads:
            x.join()
        threadsCount = 0

sendToMongo(documents)

dataFile.close()
print("Closing Script")
