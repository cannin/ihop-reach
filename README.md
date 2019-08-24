## REACH Static Site generator

This branch is responsible for the project's frontend development and static files generating image.

##### Run the image container
Docker Hub: [`rchattopadhyay/reach-webapp`](https://hub.docker.com/r/rchattopadhyay/reach-webapp)
```
docker run --name reach-webapp -e GATSBY_GRAPHQL_API_HOST=http://<reach-api-ip>:8080 \
-e GATSBY_MONGO_HOST=mongodb://<reach-api-ip>:27017 \
-v /PATH/TO/gatsby/public:/src/public rchattopadhyay/reach-webapp:latest
```

##### Build locally

1. Download using `git clone --branch docker-webapp https://github.com/RohitChattopadhyay/ihop-reach.git`
2. Build using `docker build -t reach-webapp .`
