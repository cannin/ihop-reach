#!/bin/bash

# Initialize a mongo data folder and logfile
mkdir -p /data/db
touch /var/log/mongodb.log
chmod 777 /var/log/mongodb.log
echo "Starting MongoDB"
# Start mongodb with logging
# --logpath    Without this mongod will output all log information to the standard output.
# --logappend  Ensure mongod appends new entries to the end of the logfile. We create it first so that the below tail always finds something
docker-entrypoint.sh mongod --logpath /var/log/mongodb.log --logappend &

# Wait until mongo logs that it's ready (or timeout after 60s)
COUNTER=0
grep -q 'waiting for connections on port' /var/log/mongodb.log
while [[ $? -ne 0 && $COUNTER -lt 60 ]] ; do
    sleep 2
    let COUNTER+=2
    echo "Waiting for mongo to initialize... ($COUNTER seconds so far)"
    grep -q 'waiting for connections on port' /var/log/mongodb.log
done

# Unzip source
echo "Unzip the Dataset zip"
unzip /src/dataset.zip -d /src/unzipDestDataset

# Restore from dump
mongorestore --drop --db iHOP --collection identifier_mapping /src/unzipDestDataset/iHOP/identifier_mapping.bson

echo "Remove temporary files"
rm -rf /src/unzipDestDataset
rm /src/dataset.zip
rm /src/setup.sh
echo "Installing Node Application"
npm install
npm run build
# Stop mongo
mongod --shutdown
apk del mongodb
apk del mongodb-tools
npm run serve
# Keep container running
tail -f /dev/null