## REACH WebApp Server 

This branch is responsible for image containing the server that is being used to host the GatsbyJS built static pages.

##### Run the image container
Docker Hub: [`rchattopadhyay/reach-webapp-server`](https://hub.docker.com/r/rchattopadhyay/reach-webapp-server)
```
docker run  --restart=always --name reach --expose 8080 \
-e "VIRTUAL_HOST=subdomain.domain.com" \
-e "LETSENCRYPT_HOST=subdomain.domain.com" \
-e "VIRTUAL_PORT=8080" \
-v  /PATH/TO/gatsby/public:/src/public \
-w /src -d -t rchattopadhyay/reach-webapp-server:latest
```

##### Build locally

1. Download using `git clone --branch docker-webapp-server https://github.com/RohitChattopadhyay/ihop-reach.git`
2. Build using `docker build -t reach-webapp-server .`

