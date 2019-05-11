
## Script to import JSON files to MongoDB
Requirements:
	Python
	pymongo

Usage Instructions

 1. Make sure that MongoDB is installed and is running
 2. Download `importJSON.py` and `Pipfile` in same directory
 3. Open terminal in the directory
 4. Install dependencies using `pipenv install`
 6. Run the importJSON.py file using `python importJSON.py`
 7. You will be asked to enter the path to the JSON files source. Default is current directory. Relative path can be used.
 8. The JSON files will be inserted as documents in local MongoDB.
