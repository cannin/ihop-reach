FROM mongo:4.0.9

# Copy script
COPY ./src/ /src/
RUN chmod 777 /src/setup.sh

WORKDIR /src
# For installing unzip package
RUN apt-get update
# Install unzip curl node
RUN apt-get install unzip -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install nodejs -y
# Command to start the image
CMD /src/setup.sh
