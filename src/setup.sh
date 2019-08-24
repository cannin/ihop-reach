#!/bin/bash

file_name=(
    # sorted on the basis of increasing size
    "non_comm_use.A-B"
    "non_comm_use.O-Z"
    "non_comm_use.C-H"
    "non_comm_use.I-N"
    "comm_use.A-B"
    "comm_use.C-H"
    "comm_use.I-N"
    "comm_use.O-Z"
)

array_length=${#file_name[*]}
if [[ -z "${MACHINE_ID}" ]]; then
    echo """
    Missing Machine Number \n
    Restart image by setting proper MACHINE_ID environment varible \n
    MACHINE_ID Range: 0 to $((array_length - 1))
    """
    exit 1
else
  machine_number="${MACHINE_ID}"
fi


if [[ -z "${RAM}" ]]; then
  memory_limit=12
  echo "Heap Size set to 12GB"
else
  memory_limit="${RAM}"
  echo "Heap Size set to "$memory_limit"GB"
fi
if ((machine_number>((array_length - 1)))); then
    printf """
    Invalid Machine Number \n
    Restart image by setting proper MACHINE_ID environment varible \n
    MACHINE_ID Range: 0 to $((array_length - 1))
    """
    exit 1
fi

if [[ -f "/src/reach.jar" ]]; then
  echo "JAR found"
else   
  printf "/src/reach.jar does not exist.\nPlease mount reach.jar and try again.\n"
  exit 1
fi

if [[ -f "/src/reach/output/restart.log" ]]; then
  echo "restart.log found"
else   
  printf "/src/reach/output/restart.log does not exist.\nPlease save restart.log in output folder and try again.\n"
  exit 1
fi
find /src/reach/output -name '*.tar.gz' -execdir tar -xzf '{}' \;
rm /src/reach/output/*.tar.gz
file_link="ftp://ftp.ncbi.nlm.nih.gov/pub/pmc/oa_bulk/${file_name[$machine_number]}.xml.tar.gz"
# file_link="https://reach.nrnb-docker.ucsd.edu/reach_sample.tar.gz"
echo "Downloading from $file_link"
curl -o /src/reach/source.tar.gz "$file_link"
mkdir -p /src/reach/papers
echo "Starting mongo script"
tar -tf /src/reach/source.tar.gz > /src/reach/inputFiles.txt
python ./mongo.py
tar -xzf /src/reach/source.tar.gz -C /src/reach/papers/ -T /src/reach/filterFiles.txt
rm /src/reach/source.tar.gz
echo "Starting Reach Server"
java -cp reach.jar org.clulab.processors.server.ProcessorServer &
echo "Starting Reach NLP"
jobs
java -jar -Xmx"$memory_limit"g reach.jar
echo "Zipping output"
cd /src/reach/output/
tar -zcf ../result.tar.gz .
cd ..
mv ./output/restart.log ./restart.log
echo "Output zip and restart.log saved in /src/reach/"
rm -rf ./output
mkdir output
rm -rf ./papers
cp restart.log ./output/restart.log
mv result.tar.gz ./output/"${file_name[$machine_number]}".tar.gz


