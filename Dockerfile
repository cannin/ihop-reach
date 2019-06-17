FROM node:8-alpine

# Copy script
COPY ./src/ /src/

WORKDIR /src
RUN npm install
CMD ["npm","run","build"]