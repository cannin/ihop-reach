FROM node:8-alpine

# Copy script
COPY ./src/ /src/

WORKDIR /src
RUN npm install
RUN gatsby clean
CMD ["npm","run","build"]
