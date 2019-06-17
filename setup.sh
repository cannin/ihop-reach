#!/bin/bash



echo "Remove temporary files"
rm -rf /src/unzipDestDataset
rm /src/dataset.zip
echo "Building Node Application"
npm run build
rm /src/setup.sh
echo "Starting Node Application"
npm run serve
# Keep container running
tail -f /dev/null