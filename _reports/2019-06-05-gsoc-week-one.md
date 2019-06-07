---
layout: post
title:  "Week One | Let's Start Coding"
tags: [gsoc, weekly report, coding period ]
author: Rohit R Chattopadhyay
---
## Coding Phase

This is the period of GSoC where the students work on their projects, with an intention to contribute to the Open Source Community.<br>
This phase spans until the end of the program. During this period, three evaluations are done to keep a track of the progress the student is making. First evaluation starts from 24th June and the final one marks the end of the program.

My first week of the Coding phase was mostly focused on the user interface for the project. By the end of the week, I was able to deploy a demo of our project with the basic features using a small subset of the database.


## Work Progress

1. **Developing the User Interface**

    Status: **Under Development**<br>
    The modified wireframes for the User Interface were confirmed by my [mentor](https://github.com/cannin). The basic demo was deployed to test the features of the application.
    
    The initial deployment received positive feedback. The suggested modifications and additions are being implemented.
    
    Related Issues:
    
    *    [Build Site Mockup Using GatsbyJS](https://github.com/cannin/ihop-reach/issues/3)
    *    [Gatsby Mockup Setup](https://github.com/cannin/ihop-reach/issues/17) 
    *    [Add react-helmet and react-ga to Gatsby](https://github.com/cannin/ihop-reach/issues/14)
    *    [Add Flow for Static Type Checking](https://github.com/cannin/ihop-reach/issues/19)
    *    [Add Links for Identifiers in Details Panel](https://github.com/cannin/ihop-reach/issues/10)
    *    [Add Examples to Search Bar](https://github.com/cannin/ihop-reach/issues/20)
    *    [Build Demo Site with Database Subset](https://github.com/cannin/ihop-reach/issues/22)
    
2. **Developing the GraphQL API**

    Status: **Prototype Ready**<br>
    Our static GatsbyJS web application is using a GraphQL API as the data source, hence this API needs to support methods which helps the development of the web application in an efficient manner.
    
    The need for a GraphQL API was felt when we analysed the dataset and the high number of pages which we expect to be built by GatsbyJS was taken into consideration.
    The REST API was failing due to the large size of the database. GatsbyJS [plugin](https://www.gatsbyjs.org/packages/gatsby-source-mongodb/) for using MongoDB as a source also failed due to the same reason.
    
    Related Issues:
        
    *    [Create Docker Container for GraphQL API](https://github.com/cannin/ihop-reach/issues/21)
    *    [Documenting GraphQL API](https://github.com/cannin/ihop-reach/issues/16)
    
3. **Analysing the Database**
    
    Several statistical questions were raised by my mentor, answers of which are written in the *[Analysis Report](https://docs.google.com/document/d/148H0S0h2VewO3-aQbbKHZr7q9A6Yi7lCbVVGiThv6Xg/)*.
    
    This report helped us to take several major developmental decisions like creating database indexes, counting the number of expected pages and the data variation to expect.
    
    Some documents did not match the expected schema. We plan to address this issue by implementing a JSON Schema check while importing the articles to the MongoDB database.
    
    Related Issues:
    
    *    [Get MongoDB Database Statistics](https://github.com/cannin/ihop-reach/issues/18)
    *    [Invalid Documents encountered in Dataset](https://github.com/cannin/ihop-reach/issues/11)
    
## Conclusion

The week was a great start to my open source journey. Analysing the dataset helped me, know the objectives of our project.<br>
My mentor responsibly took several tough decisions for the betterment of the project, which taught me some vital lessons of application development.<br>
Overall, it has been a great learning experience, and I hope that the Open Source community finds a good contributor in me, by the end of summer.
> In true open source development, there's lots of visibility all the way through the development process. <br>
> ~*Brian Behlendorf*
