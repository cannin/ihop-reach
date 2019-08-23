---
layout: post
title:  "Final Report | Work Product Submission"
tags: [gsoc, 2019, coding period , third phase, final evaluation, final report ]
author: Rohit R Chattopadhyay
---
## REACH Web Application

**An application for users to access biological data extracted from biomedical literature.**

---

Broadly the project can be divided into the following components:
  
  1. GraphQL API with MongoDB as database
  2. Web Application
  3. Data Generation pipeline

The source code of the project is hosted on [GitHub](http://bit.ly/2Hafj5N) and it has been deployed at servers provided by [University of California San Diego](https://ucsd.edu/) and can be accessed using the following links:  

* GraphQL API: http://reach-api.nrnb-docker.ucsd.edu
* Web Application: http://reach.nrnb-docker.ucsd.edu

---
### Table of Contents

1. [Introduction](#1-introduction)
2. [Technology Stack](#2-technology-stack)
3. [Application Programming Interface](#3-application-programming-interface)  
   &ensp; a. [GraphQL API](#a-graphql-qpi)  
   &ensp; b. [MongoDB Database](#b-mongodb-database)  
4. [Web Application Frontend](#4-web-application-frontend)
5. [Web Server](#5-web-server)
6. [Database Generation Pipeline](#6-database-generation-pipeline)  
   &ensp; a. [MongoDB Import](#a-mongodb-import)  
   &ensp; b. [Analyzing PubMed XML files](#b-analyzing-pubmed-xml-files)  
   &ensp; c. [The Pipeline](#c-the-pipeline)  
7. [Docker Images](#7-docker-images)
8. [Pull Requests](#8-pull-requests)
9. [Work Left](#9-work-left)
10. [Important Links](#10-important-links)
11. [Conclusion](#11-conclusion)

---
### 1. Introduction
The project started under [Google Summer of Code 2019](https://summerofcode.withgoogle.com/projects/#6387494919077888) under the mentorship of [Augustin Luna](https://github.com/cannin). [Rohit Rajat Chattopadhyay](https://github.com/rohitchattopadhyay) was selected as the student developer under the program.  
The application allows its users to get access to the vital sentences (`evidence`) present in the biomedical literature describing molecular interactions. The source of these papers is [PubMed Central](https://www.ncbi.nlm.nih.gov/pmc/).

### 2. Technology Stack
The web application and the GraphQL API are built using JavaScript and for the data generation pipeline, Python3 has been used.  

* **Web Application**
    * [*GatsbyJS*](https://github.com/gatsbyjs/gatsby/), for frontend
    * [*NodeJS*](https://nodejs.org/en/) and [*ExpressJS*](https://expressjs.com/), for serving the static files
* **Application Program Interface**
    * [*GraphQL*](https://graphql.org), as web service
    * [*MongoDB*](https://www.mongodb.com/), as database
* **Data Generation pipeline**
    * [*Python3*](https://www.python.org/)

Other than these, *Shell scripting* has been used in Docker images.

### 3. Application Programming Interface
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/docker-api),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay), [Docker Image](https://hub.docker.com/r/rchattopadhyay/reach-api)

Our objective was to allow our users to interact and use the extracted information present in our MongoDB based database. We have used GraphQL for this, as it allows the users to cherry-pick whatever information they need. This also reduces the load on our servers thus improving efficiency.  

Another major motive for choosing GraphQL was, the poor performance of REST API while building our static site using GatsbyJS due to the large size of our database.  

#### a. GraphQL API

GraphQL is a new technology and it has a positive reception from the community. It allows a user to get whatever information they need from single endpoint thus reducing the complexity of the user's code and also reducing the payload of the responses thus increasing efficiency.  

Being a tool for the BioInformatics industry, [GraphiQL](https://www.npmjs.com/package/graphiql), an in-browser GraphQL IDE allows our users to interact with our API without much efforts to set up the environment on their machines.  

We have used [GraphiQL Explorer](https://github.com/OneGraph/graphiql-explorer) as our GraphiQL IDE. This helped us to implement the feature of *Explorer*, which lets the users make queries by simply clicking the required fields.  

To improve the response time, the responses are gzipped using [`compression`](https://www.npmjs.com/package/compression) package.


#### b. MongoDB Database

Since the raw data are in JSON format and the number of documents is quite high, we need a scalable solution for database, hence we wanted a NoSQL Database and MongoDB was the chosen due to its extensive community and presence of well-tested libraries in Python as well as JavaScript.

Our Database is named `iHOP` and consists following collections:  
* **`articles`** , stores all the documents output from [CLULAB/REACH](https://github.com/clulab/reach) after processing files from PubMed repository.
    Indexes:
    * *entityNameA* : `extracted_information.participant_a.entity_text" : 1`
    * *entityNameB* : `extracted_information.participant_b.entity_text" : 1`
    * *identifier* ($text) : 
    ```extracted_information.participant_a.identifier" : 1, extracted_information.participant_b.identifier" : 1```
    
* **`identifier_mapping`** , stores mapping between *identifier* (`iden`),*matched terms* (`syn`),*entity type* (`typ`) among the documents in `articles` collection.
    * *identifier* : `iden : 1`

* **`pubmed`** , stores PUBMED paper information extracted from `NXML` files downloaded from PUBMED FTP.
    * *pmc_index* : `pmcid : -1`
    * *year* : `year : -1`

### 4. Web Application Frontend
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/docker-api),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay), [Docker Image](https://hub.docker.com/r/rchattopadhyay/reach-webapp)

The purpose of the web application is to present the information in a user-friendly way. Each `identifier` having its page consisting of all the `evidence` (sentence) extracted from medical papers present in PubMed Central.  

The application is developed using a [ReactJS](https://reactjs.org) based static site generator [GatsbyJS](https://www.gatsbyjs.org/). GatsbyJS has made its reputation to be capable of building *blazing-fast* websites and apps.

There are three major components as follows:
*   **Programmatically create pages**  
    Static pages are generated using the MongoDB database using the GraphQL API as the interface. The list of unique `identifier`, using which the pages are created using a [template](https://github.com/RohitChattopadhyay/ihop-reach/blob/docker-frontend/src/src/templates/details.js) using `createPages` method [here](https://github.com/RohitChattopadhyay/ihop-reach/blob/docker-frontend/src/gatsby-node.js#L7).  

*   **Sentence Highlighting**  
    This component highlights the keywords present in the sentences. Code is available [here](https://github.com/RohitChattopadhyay/ihop-reach/blob/docker-frontend/src/src/components/sentenceView.js#L27)  
    Please Note that `UAZID` identifiers are ignored as they do not have proper mapping.
    
*   **Search and Typeahead**  
    For search functionality we have used [Lunr](https://lunrjs.com/). We are indexing the `Matches` for `entity_name` [here](https://github.com/RohitChattopadhyay/ihop-reach/blob/2a88bc60234216a93909bca884f12f7fa3a04f81/src/gatsby-config.js#L39).  The search feature has been implemented [here](https://github.com/RohitChattopadhyay/ihop-reach/blob/2a88bc60234216a93909bca884f12f7fa3a04f81/src/src/components/header.js#L114).  
    The typeahead feature has been implemented by adding wildcard and it can resist one typographical error in the searched term. Implementation of the same can be found [here](https://github.com/RohitChattopadhyay/ihop-reach/blob/2a88bc60234216a93909bca884f12f7fa3a04f81/src/src/components/header.js#L44).
    
### 5. Web Server
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/docker-webapp-server),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay), [Docker Image](https://hub.docker.com/r/rchattopadhyay/reach-webapp-server)

To serve the static files generated by GatsbyJS, we are using ExpressJS based on NodeJS. The responses are gzipped using [`compression`](https://www.npmjs.com/package/compression) package.

### 6. Database Generation Pipeline
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/docker-api),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay)

#### a. MongoDB Import  
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/database-import/database/import),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay)

Scripts are written in Python3 to imports all the JSON files into the MongoDB in `iHOP.articles` collection and create a mapping in `iHOP.identifier_mapping` collection.  
    [`importJSON.py`](https://github.com/RohitChattopadhyay/ihop-reach/blob/database-import/database/import/importJSON.py), for importing JSON to `iHOP.articles`  
    [`mapping.py`](https://github.com/RohitChattopadhyay/ihop-reach/blob/database-import/database/import/mapping.py), for creating mapping `iHOP.identifier_mapping`
    
#### b. Analyzing PubMed XML files  
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/pubmed/data-extraction),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay)

Analysis of PubMed XML files is broken down into two steps:  
    &ensp; 1. **[`extractor.py`](https://github.com/RohitChattopadhyay/ihop-reach/blob/pubmed/data-extraction/extraction/extractor.py)** is used to traverse the `XML` files downloaded from PubMed FTP and generate a `CSV` having our required data.  
    &ensp; 2. **[`mongoPubmedImport.py`](https://github.com/RohitChattopadhyay/ihop-reach/blob/pubmed/data-extraction/import/mongoPubmedImport.py)** traverses the generated `CSV` files, creates objects and imports in MongoDB in `iHOP.pubmed` collection.
    
#### c. The Pipeline  
[Source Code](https://github.com/RohitChattopadhyay/ihop-reach/tree/pubmed/data-extraction),  [Pull Request](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-api?author=RohitChattopadhyay), [Docker Image](https://hub.docker.com/r/rchattopadhyay/pubmed-ftp-processor)

The PubMed central maintains several archives, each archive is to be extracted and processed using [CLULAB/REACH](https://github.com/clulab/reach) to get the JSON files as output. These JSON files are to be imported to our database using the [import scripts](#a-MongoDB-Import). The following image shows a basic outline of the process.
![Pipeline Flowchart](https://i.imgur.com/DHEzE9U.png)

At present we are processing our first archive file.

### 7. Docker Images

The application extensively uses [Docker](https://www.docker.com/) to run the containers in the server. Following Docker images hosted in [Docker Hub](https://hub.docker.cpm) are used to run the application:  
&ensp; a. **[`rchattopadhyay/reach-api`](https://hub.docker.com/r/rchattopadhyay/reach-api)**, for GraphQL API and MongoDB  
&ensp; b. **[`rchattopadhyay/reach-webapp`](https://hub.docker.com/r/rchattopadhyay/reach-webapp)**, for building GatsbyJS static site  
&ensp; c. **[`rchattopadhyay/reach-webapp-server`](https://hub.docker.com/r/rchattopadhyay/reach-webapp-server)**, for serving the GatsbyJS generated static files  
&ensp; d. **[`rchattopadhyay/pubmed-ftp-processor`](https://hub.docker.com/r/rchattopadhyay/pubmed-ftp-processor)**, for the pipeline to update the database with latest articles in PubMed Central.  

### 8. Pull Requests

Following are the Pull Requests containing work done during Google Summer of Code 2019:

1.   [PubMed XML data extraction branch](https://github.com/cannin/ihop-reach/pull/64)
2.   [Docker Image for processing PubMed Central archive files](https://github.com/cannin/ihop-reach/pull/65)
3.   [GraphQL API and MongoDB](https://github.com/cannin/ihop-reach/pull/66)
4.   [Server to serve the static pages](https://github.com/cannin/ihop-reach/pull/67)
5.   [Static Site Generator](https://github.com/cannin/ihop-reach/pull/68)
6.   [MongoDB Import Script](https://github.com/cannin/ihop-reach/pull/69)
7.   [Update master branch with documentation](https://github.com/cannin/ihop-reach/pull/70)
8.   [Add publication_date in literature/pubmed_client.py](https://github.com/sorgerlab/indra/pull/902)
9.   [Add hypothesis and context.species information in index_cards](https://github.com/sorgerlab/indra/pull/916)

### 9. Work Left

Work on the pipeline remains. The prototype is ready and we are testing it. Each archive file takes more than two weeks to complete and we have eight such files thus the process is time taking.  
I hope that we do not encounter fatal error and eventually we can process all the archives.

### 10. Important Links
* [GraphQL API](http://bit.ly/2YZi199)
* [Web Application](http://bit.ly/2ZcktnM)
* [GitHub Repository](http://bit.ly/2Hafj5N)
* [GSoC Project URL](http://bit.ly/2OZlRuk)
* [GSoC Proposal by Student](http://bit.ly/2Nf6ICv)

### 11. Conclusion

In these last three months, I got to know BioInformatics can help to improve life. The project aims to make it easy for researchers to find molecular interactions. I hope the tool becomes the favourite tool of the researchers in BioInformatics and related fields.  

I never expected to learn so much in such a short time, the project has helped me to understand how things work at the production level and the level of code and documentation it demands. The program taught me the power of Open Source and why it is important to the community. Thanks to the program and my mentor for making me confident enough to contributed in repositories where I would never think of forking.  

I would like to thank my parents and brother for their support. I would also like to thank my friend, [Priti](https://github.com/pritishaw) for constantly supporting me, especially during the application and community bonding period. I am grateful to [William Markuske](https://github.com/wmarkuske) for providing the computational requirements for the project.  

Any flight cannot fly in the right direction without its Captain, my mentor, [Augustin Luna](https://github.com/cannin) did the same for the project. He was calm, patient and helped me whenever I was stuck. He has taken some major decisions and now I understand the importance of those, one of them being scrapping the REST API in favour of GraphQL API. He is the perfect mentor a student can get.

> The free sharing and teaching of open source is incompatible with the notion of the solitary genius.  
> ~*Golan Levin*
