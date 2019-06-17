FROM node:8-alpine

# Copy script
COPY ./src/ /src/
COPY setup.sh /src/setup.sh
RUN chmod 777 /src/setup.sh

WORKDIR /src
RUN npm install
CMD ["sh","setup.sh"]