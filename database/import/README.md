## Script to import JSON files to MongoDB
Requirements:
	Python
	pymongo : install using `pip install pymongo`

Usage Instructions

 1. Make sure that MongoDB is installed and is running
 2. Open terminal in the directory having `importJSON.py` file
 3. Run the importJSON.py file using `python importJSON.py`
 4. You will be asked to enter the path to the JSON files source. Default is current directory. Relative path can be used.
 5. The JSON files will be inserted as documents in local MongoDB.