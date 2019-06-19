---
layout: post
title:  "Week Three | Setting up the Server"
tags: [gsoc, weekly report, coding period ]
author: Rohit R Chattopadhyay
---
This week we received our machine to host the application. The server is located at University of California, San Diego. It is powered by a Intel Xeon E5-2687W, having 16GB of RAM.  

## Setting up the Server

The basic requirements to run the application were setup. Our initial focus was to start the GraphQL API and we have successfully deployed it at [reach-api.nrnb-docker.ucsd.edu](http://reach-api.nrnb-docker.ucsd.edu).<br/>
We tested the GatsbyJS Build process with the complete database, and GatsbyJS did not let us down. The complete build time was around three hours, and we have successfully deployed the prototype at [reach.nrnb-docker.ucsd.edu](http://reach.nrnb-docker.ucsd.edu).<br/>

## Work Progress

1. **Web Application Development**

    Basic work on improving the user interface was done. Also, Docker image was built for the frontend of the application.  
    Related Issues:

    *    [Add Hypothesis Information to Details Panel](https://github.com/cannin/ihop-reach/issues/33)
    *    [Make Gatsby Site Links Open in New Tab](https://github.com/cannin/ihop-reach/issues/32)
    *    [Add Additional Columns to Details Panel ](https://github.com/cannin/ihop-reach/issues/10)
    *    [Filter Reported Sentences Without Entity Text](https://github.com/cannin/ihop-reach/issues/23)
    
2. **GraphQL API Development**

    Queries were refined and optimized to reduce request time and thus improve user experience. Filters were added to the queries.  
    [List of Commits](https://github.com/RohitChattopadhyay/ihop-reach/commits/docker-graphql-and-mongodb)
    
## Conclusion

Overall this has been quite a successful week. We were able to test GatsbyJS over complete dataset which is a positive sign that we are on the right track.<br>
Next week, we have our first GSoC evaluation, and I hope I have performed up to the mark the program demands.

> While free software was meant to force developers to lose sleep over ethical dilemmas, open source software was meant to end their insomnia.<br>
> ~*Evgeny Morozov*
