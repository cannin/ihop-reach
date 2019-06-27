# This script's purpose is to import JSON files into local MongoDB.
# Requires pymongo

import os
import json
import time
from pymongo import MongoClient
#check database connection
try: 
    mongoConnection = MongoClient()  #Edit MongoDB username and password in this line, MogoClient() if no authorization
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

            #convert participant b
            participant_b = jsonData["extracted_information"]["participant_b"]
            del jsonData["extracted_information"]["participant_b"]
            jsonData["extracted_information"]["participant_b"] = [participant_b]
            temp = []
            if "participant_a" in jsonData["extracted_information"]:
                participant_a = jsonData["extracted_information"]["participant_a"]
                partA_type = type(participant_a)
                if(partA_type is dict):
                    del jsonData["extracted_information"]["participant_a"]
                    temp = [participant_a]
                elif(partA_type is list):
                    del jsonData["extracted_information"]["participant_a"]
                    temp.extend(participant_a)
            jsonData["extracted_information"]["participant_a"] = temp
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
    try:
        prevCount = mongoCollection.count()         #Getting number of documents in the collection    
        mongoCollection.insert_many(data)           #Command to insert documents
    except:
        print("Documents insertion failed")         #Incase of any error from mongodb
        quit()
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
    sourcePath = os.path.dirname(os.path.realpath(__file__))
print("Starting import script")
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
        
        resultCount = 0        
        chunkSize = 10000 # Size of smaller parts of the payload 
        
        # r=root, d=directories, f = files
        for r, d, f in os.walk(sourcePath):
            for file in f:
                if ('.json' or '.JSON') in file:
                    fileCount += 1                              #keeping count of json files
                    fromPath = os.path.join(r, file)
                    data = verifyJSON(fromPath)                 #function call for checking validity of the json file
                    if data != None:
                        directory = os.path.join(os.path.dirname(os.path.realpath(__file__)),"processed",fromPath.split("/")[-2])
                        if not os.path.exists(directory):
                            os.makedirs(directory)
                        os.rename(fromPath,os.path.join(directory,file))
                        fileData.append(data)                   #append proper JSON data to array
                        if(fileCount%chunkSize==0):
                            #Call for insertion in database
                            resultCount += addToDatabase(fileData)              #function call for insertion of array of JSON data
                            print("Inserted {} documents".format(resultCount))	#print info message
                            print("Uploaded till "+fromPath)
                            fileData.clear()                                    #clear list for next set of documents
	
        if(len(fileData)>0):
             #Call for insertion in database
             resultCount += addToDatabase(fileData)               #function call for insertion of array of JSON data
             print("Inserted {} documents".format(resultCount))	 
             print("Uploaded till "+ fromPath)        
        print("{} json files found, out of which {} json file(s) are invalid".format(fileCount,(fileCount-resultCount)))        
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
print("Starting mapping script")
os.system("python mapping.py")
exit()
