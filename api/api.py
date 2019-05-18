import os
from eve import Eve
from gevent.pywsgi import WSGIServer

# Database event hooks

#function to delete _created and _updated from resource dictionary
def on_fetched_resource(resource, response):    
    response['items'] = response.pop('_items')
    for doc in response['items']:
        for field in doc.keys():
            if field.startswith('_'):
                if(field != '_id'):
                    del(doc[field])
                else:
                    doc['id'] = doc.pop(field) #Change name of id key in response

#function to delete _created and _updated from item dictionary                    
def on_fetched_item(response):   
    del(response['_updated'])               # Delete _updated key in response
    del(response['_created'])               # Delete _created key in response
    response['id'] = response.pop('_id')    # Change name of id key in response
    
app = Eve("iHOP API")
#attaching the hooks to events
app.on_fetched_resource += on_fetched_resource
app.on_fetched_item_articles += on_fetched_item

if __name__ == '__main__':    
    port = int(os.environ.get('PORT', 5000))    # Bind to PORT if defined, otherwise default to 5000.
    # Debug/Development
    # app.run(debug=True, host="0.0.0.0", port=port)
    # Production
    http_server = WSGIServer(('', port), app)
    http_server.serve_forever()