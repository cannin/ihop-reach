FROM openjdk:8

COPY ./pipeline.sh /src/setup.sh
WORKDIR /src
RUN mkdir -p reach/papers

CMD ["bash" , "setup.sh"]
