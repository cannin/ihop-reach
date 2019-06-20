FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
# Building for production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
