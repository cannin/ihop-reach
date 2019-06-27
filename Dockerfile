FROM node:8

# Copy files
COPY ./src/ /src/

WORKDIR /src
ENV NODE_ENV = "production"
RUN npm install
CMD ["npm","start"]