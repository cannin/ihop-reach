## iHOP-Reach Database container

**Step 1** Download the files and build using

    docker build -t ihop-database .

**Step 2** Run the instance using

     docker run -v /path/to/dataset.zip:/home/dataset.zip -p 27017:27017 ihop-database
