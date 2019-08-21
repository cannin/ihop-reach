---
layout: post
title:  "Week Four | First Evaluation"
tags: [gsoc, weekly report, coding period , first evaluation]
author: Rohit R Chattopadhyay
---
Hard to believe that the first phase of the journey has come to an end, it feels like I was preparing my proposal just a week back.  
First Evaluation marks the end of one-third of the program. I hope I have performed up to the mark.  

## Work Progress

1. **Web Application Development**

    Vital features like Caching, Search Typeahead and Sentence filtering were implemented.  
    Related Issues:

    *    [Typeahead Search with Lunr](https://github.com/cannin/ihop-reach/issues/36)
    *    [Make Details Panel Table Filterable](https://github.com/cannin/ihop-reach/issues/35)
    *    [Remove Advanced Search Options from Website](https://github.com/cannin/ihop-reach/issues/40)
    *    [Use Cache API for Search Index](https://github.com/cannin/ihop-reach/issues/38)
    
2. **GraphQL API Development**

    To improve user experience, enumeration was implemented wherever there was scope.  
    [List of Commits](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-graphql-and-mongodb)  

3. **Server Setup**

    Our server was upgraded with more RAM and HDD space. This upgrade reduced GatsbyJS build time from 3 hours to 50 minutes. Our [GraphQL API](http://reach-api.nrnb-docker.ucsd.edu) and [prototype](http://reach.nrnb-docker.ucsd.edu) are live and are being tested.
    
4. **Data Generation Pipeline**

    Work has commenced using [INDRA](https://github.com/sorgerlab/indra). In the coming week, our focus will be to develop the basic functionalities of the pipeline.  
    Related Issues:
    
    *    [Setup Indra Locally for Data Generation](https://github.com/cannin/ihop-reach/issues/41)

## Conclusion

Any project is incomplete without great guidance. I am thankful to my mentor, [Augustin Luna](mailto:cannin@gmail.com) for keeping faith in me and constantly supporting me. He has made the journey, simple.  
I am grateful to [William Markuske](mailto:wmarkuske@ucsd.edu), Systems Administrator, UCSD for the constant support.  
We will start work on the Data Generation pipeline in the coming week, the scale of data is huge thus it will be a challenge to handle it in an efficient manner.

> Always deliver more than expected.  
> ~*Larry Page*
