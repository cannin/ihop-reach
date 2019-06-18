FROM node:8-alpine

# Copy script
COPY ./src/ /src/

WORKDIR /src
RUN npm install
RUN npm run clean
CMD ["npm","run","build"]
