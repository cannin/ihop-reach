## API
Requirements:
	
	Python
	eve
	gevent

### Endpoints
 1. `GET /api/v1/articles/`
Returns the list of articles present in database.

 2. `GET /api/v1/articles/:id`
Returns the article matching the Object ID and given path variable

	Path Variable

		id : Object ID of the collection document	
