import os
from eve import Eve
from flask import redirect
from gevent.pywsgi import WSGIServer

from eve_swagger import swagger # Swagger for API

# Database event hooks

#function to delete _created and _updated from resource dictionary
def on_fetched_resource(resource,response):
    response['items'] = response.pop('_items')
    for doc in response['items']:
        doc['id'] = doc.pop('_id') #Change name of id key in response
        del doc['_created']
        del doc['_updated']

#function to delete _created and _updated from item dictionary
def on_fetched_item(response):
    del response['_updated']              # Delete _updated key in response
    del response['_created']              # Delete _created key in response
    del response['_links']               # Delete _links Hateos key in response
    response['id'] = response.pop('_id')   # Change name of id key in response

# Create a pyeve instance
app = Eve("iHOP API")

# Uncomment the next line to expose /api-docs where JSON of the
# API for creating documention will be available
# app.register_blueprint(swagger)

# attaching event hook with functions
app.on_fetched_resource += on_fetched_resource
app.on_fetched_item_articles += on_fetched_item

# Swagger API documentation options
app.config['SWAGGER_INFO'] = {
    'title': 'iHOP Reach API',
    'version': '1.0',
    'description': 'An API to access the NLP Extracted Interaction Network',
    'schemes': ['http', 'https'],
}

# endpoint for identifier search
@app.route('/api/v1/articles/identifier/<key>')
def identifier_redirect(key):
    # The endpoint is permanent(301) redirect to article endpoint with
    # where clause using a OR for filtering either fields
    return redirect('/api/v1/articles?where={%22$or%22:[{%22extracted_information.participant_a.identifier%22:%22'+key+'%22},{%22extracted_information.participant_b.identifier%22:%22' + key + '%22}]}', code=301)

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000
    PORT = int(os.environ.get('PORT', 5000))

    # Debug/Development
    # app.run(port=PORT)
    # Production
    HTTP_SERVER = WSGIServer(('0.0.0.0', PORT), app)
    HTTP_SERVER.serve_forever()
