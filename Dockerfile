FROM node:8

# Copy files
COPY ./src/ /src/

WORKDIR /src
RUN npm install
CMD ["npm","run","build"]
