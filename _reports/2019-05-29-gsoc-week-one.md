---
layout: post
title:  "Week 0 | Welcome GSoC"
tags: [gsoc, weekly report, community bonding]
author: Rohit R Chattopadhyay
---
## About Me
I am an undergraduate student, pursuing Computer Science and Engineering at [Jadavpur University](http://jaduniv.edu.in), Kolkata, India.
My interests lie in application development, alongside which I am interested in exploring the computer science world of machine learning and image processing.

## GSoC Project

[GSoC Project URL](https://summerofcode.withgoogle.com/projects/#6387494919077888) | [Work Repository](https://github.com/cannin/ihop-reach) | [GSoC Project Proposal](https://drive.google.com/file/d/16pof96ke0hR23rIwl0_fnOhe30DlEHLN/view?usp=sharing)

Mentor: **Augustin Luna** ([@cannin](https://github.com/cannin))

The aim of the project is to make a web app which will be an interface to interact with biological data extracted from biomedical literature.

Stack to be used:
* **GatsbyJS** for frontend
* **Python** for development of the API
* **MongoDB** as database
* **GraphQL** as the query language for the database


## Community Bonding

This period of GSoC started after the project announcements. I was given some material to study, which helped me a lot to understand what I was about to build in the summer.

I used this period, to set up my development environment and discuss our approach with Mentor.
I was given the dataset, which I analysed and made a Python script to import it to MongoDB.

This report marks the end of the Community Bonding period.

My end-semester ended on 22nd May, thus I was not able to devote my whole time to the project. I will cover it up by putting in extra hours during the Coding period.

## Tasks

During the community bonding period, I was assigned the following work:

1. **Dataset import script to MongoDB**

    Status: **Complete**<br>
    The script is made using `Python`. After consulting with Augustin, I implemented a method to shred the payload, to make it easy for the user as well for the MongoDB drivers.
    For the whole dataset(16GB), it took around 20hours on my 8GB Ubuntu system to import the JSON documents to local MongoDB.
    
    Related Issues:
    
    *    [Script to import JSON documents to MongoDB](https://github.com/cannin/ihop-reach/issues/1) 
    *    [Test Out Import Script on Full Dataset](https://github.com/cannin/ihop-reach/issues/6)
    
    
2. **Setup REST API for MongoDB**

    Status: **Final stage**<br>
    The REST API is made using the [python-Eve framework](https://github.com/pyeve/eve).
    Following three endpoints have been set up:
    
    1. `/articles`<br> to retrieve all articles
    2. `/articles/{articleId}`<br> to retrieve an articles by Document ID
    3. `/articles/identifier/{identifierKey}`<br> to retrieve one or more articles by identifier

    For the identifier endpoint, a 301 redirection is set up to endpoint `/articles` with suitable filters.
    Swagger is used for documenting the REST API. [Link to Swagger documentation](https://app.swaggerhub.com/apis-docs/RohitChattopadhyay/i-hop_reach_api/).

    Related Issues:
        
    *    [Set up a REST API for the MongoDB](https://github.com/cannin/ihop-reach/issues/2)
    *    [Make Swagger Documentation for pyeve REST API](https://github.com/cannin/ihop-reach/issues/4)
    *    [Create Docker Container for pyeve API](https://github.com/cannin/ihop-reach/issues/5)
    *    [Provide An Endpoint to Allow Identifier Queries](https://github.com/cannin/ihop-reach/issues/7)
    
3. **Create Docker images for MongoDB and REST API**
    
    Status: **Final stage**<br>
    The Docker images for the MongoDB database and REST API was created using docker-compose.
    After required testing, it has been hosted in Docker Hub.
    
    Docker Hub links:
    
    *    REST API: [rchattopadhyay/ihop-api](https://hub.docker.com/r/rchattopadhyay/ihop-api)
    *    Database: [rchattopadhyay/ihop-database](https://hub.docker.com/r/rchattopadhyay/ihop-database)
    
    Related Issues:
    
    *    [Create Docker Container for pyeve API](https://github.com/cannin/ihop-reach/issues/5)
    *    [Create and Configure MongoDB Instance with Docker](https://github.com/cannin/ihop-reach/issues/8)

4. **Frontend Development**
    
    Status: **At Early stage**<br>
    This is my highest priority when the coding period begins. Till now only wireframes have been confirmed, and basic work of the GatsbyJS setup has been done.
    
    Related Issues:
    
    *    [Build Site Mockup Using GatsbyJS](https://github.com/cannin/ihop-reach/issues/3)
    *    [Add Links for Identifiers in Details Panel](https://github.com/cannin/ihop-reach/issues/10)

## Conclusion

It has been a great learning experience till now. I had very less experience in working with python for web services, but I am using it now since the first day of Google Summer of Code 2019. I am enjoying the journey and I hope that with time and experience my work efficiency and quality will increase.<br>
My mentor, Augustin has constantly helped me by providing materials. He is just a message away, whenever I require his guidance. I am indebted to him, for the patience he shows.
> In real open source, you have the right to control your own destiny.<br>
> ~*Linus Torvalds*
