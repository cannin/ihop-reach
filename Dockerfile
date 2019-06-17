FROM node:8-alpine

# Copy script
COPY ./src/ /src/
COPY setup.sh /src/setup.sh
RUN chmod 777 /src/setup.sh

RUN apk update
RUN apk add mongodb
RUN apk add mongodb-tools
RUN mkdir /src/log
WORKDIR /src
CMD ["sh","setup.sh"]