## REACH GraphQL API

GraphQL provides a complete and understandable description of the data in our API, it helps the user to ask for exactly what they need.  
This Docker image contains two vital components of the application
  1. NoSQL Database, using MongoDB
  2. API, using GraphQL
  
### Installation Steps

The installation requires `mongodump` created zip file in the following structure.  
```
zipFile.zip
└─── iHOP
      └─── articles.bson
           articles.metadata.json
           identifier_mapping.bson
           identifier_mapping.metadata.json
           pubmed.bson
           pubmed.metadata.json
```

##### Run the image container
Docker Hub: [`rchattopadhyay/reach-api`](https://hub.docker.com/r/rchattopadhyay/reach-api)
```
docker run --restart=always --name reach-api --expose 8080 \
-e VIRTUAL_HOST=subdomain.domain.com -e VIRTUAL_PORT=8080 \
-v /PATH/TO/mongo/dump.zip:/src/dataset.zip \
-d -t rchattopadhyay/reach-api:latest
```

In the machine, port 8080 for API and 27017 for MongoDB will be accessible using local ip.

##### Build locally

1. Download using `git clone --branch docker-api https://github.com/RohitChattopadhyay/ihop-reach.git`
2. Build using `docker build -t reach-api .`
