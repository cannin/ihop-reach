import os

#Setting up MongoDB URI
MONGO_URI = os.environ.get('MONGODB_URI', 'mongodb://db:27017/iHOP')
#Edit your MongoDB username and password in above line or use Environment variables

# pyeve settings
ALLOW_UNKNOWN = True
OPTIMIZE_PAGINATION_FOR_SPEED = True
IF_MATCH = False # disable etag
HATEOAS = False
# Set API Settings
RENDERERS = [
    'eve.render.JSONRenderer', #for JSON output
]
URL_PREFIX = 'api'
API_VERSION = 'v1'
PAGINATION_DEFAULT = 20

# Standard client cache directives for all resources exposed by the API.
CACHE_CONTROL = 'max-age=20'
CACHE_EXPIRES = 20

# Explaining which resource will be available and how they will be accessible to the API consumer.
DOMAIN = {
    'articles': {}
}
