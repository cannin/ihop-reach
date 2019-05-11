# This script's purpose is to import JSON files into local MongoDB.
# Requires pymongo

import os
import json
from pymongo import MongoClient

#check database connection
try: 
    mongoConnection = MongoClient('mongodb://root:password@localhost:27017/')  #Edit MongoDB username and password in this line, MogoClient() if no authorization
except:
    #on mongodb connection fail, this indicates that either mongodb is not started or installed in the device
    print("Could not connect to MongoDB") 
    print("Failed to import")
    print("Closing import script")
    quit()      #exiting the script due to absense of Database

#function to verify the JSON file
def verifyJSON( jsonPath ): 
    #returns JSON content if proper file else None is returned
    with open(jsonPath) as jsonFile:
        try:
            jsonData = json.load(jsonFile)
            return jsonData
        except json.decoder.JSONDecodeError as e:
            #if the file is not a proper json file
            print("Decoding JSON has failed")
            print(e)                            #display the error message
            print("in " + jsonPath)             #display the file location 
    return None

#function to add json in MongoDB
def addToDatabase(data):
    #returns number of inserted documents in the collection
    mongoDatabase = mongoConnection["iHOP"]     #Database name
    mongoCollection = mongoDatabase["articles"] #Collection name
    prevCount = mongoCollection.count()         #Getting number of documents in the collection

    #split data in chunks and insert in mongoDB
    chunkBegin = 0     #Iterator
    chunkSize = 10     #Size of Chunk
    while chunkBegin<len(data):
        chunkSlice = slice(chunkBegin,chunkBegin+chunkSize)    #Creating a slice for the chunk
        mongoCollection.insert_many(data[chunkSlice])           #Command to insert documents
        chunkBegin += chunkSize                                #Increment iterator by chunk size
        print("Inserted {} document{}".format(chunkBegin if chunkBegin<len(data) else len(data),"s" if len(data)>1 else ""))           
    return (mongoCollection.count()-prevCount)
    
#taking input of source directory/file
try:
    #Fallback for Python2
    sourcePath = raw_input("Please enter the path to source [Current directory]:\t").strip()
except:
    #For Python 3
    sourcePath = input("Please enter the path to source [Current directory]:\t").strip()

#set default source path as the present directory
if len(sourcePath) == 0:
    sourcePath = "./"

#Check if valid path given
if os.path.exists(sourcePath)==False:
    #Invalid path given
    print("Invalid path")
    print("Failed to import")
else:
    #Given path is valid
    #Check if provided path is a file or directory
    if os.path.isdir(sourcePath)==False:
        #given path is a file
        data = verifyJSON(sourcePath)
        if data != None:
            if addToDatabase([data])!=1:
                print("Import failed")
            else:            
                print("Successfully inserted the json file to database")
        else:
            print("Decoding JSON has failed")
            print("Import failed")
    else:
        #given path is a directory
        fileData = []
        fileCount = 0
        
        # r=root, d=directories, f = files
        for r, d, f in os.walk(sourcePath):
            for file in f:
                if ('.json' or '.JSON') in file:
                    fileCount += 1                              #keeping count of json files
                    data = verifyJSON(os.path.join(r, file))    #function call for checking validity of the file
                    if data != None:
                        fileData.append(data)                   #append proper JSON data to array
        
        print("{} json files found, out of which {} json file(s) are invalid".format(fileCount,(fileCount-len(fileData))))        
        
        resultCount = 0
        if len(fileData)>0:
            #Call for insertion in database
            print("Importing {} valid json files to MongoDB".format(len(fileData)))
            resultCount = addToDatabase(fileData)               #function call for insertion of array of JSON data
        
        #execution result display
        if fileCount == 0:
            #No valid JSON file to insert
            print("No json file to insert")
        elif resultCount == 0:
            #No document inserted in MongoDB
            print("No json file inserted")
        elif resultCount<fileCount:
            #Partial success in inserting the documents
            print("Successfully inserted {} json files to database out of {} json files".format(resultCount,fileCount))
        elif resultCount==fileCount:
            #Successfull insertion
            print("Successfully inserted {} json files to database".format(resultCount))

#Script termination message
print("Closing import script")
exit()
