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

 3. `GET /api/v1/articles/identifier/:key`
Redirects to /articles endpoint with a where clause
Returns all the articles matching the identifier at participant_a or participant_b and the key

	Path Variable

		key : Identifier of the extracted biomedical literature
