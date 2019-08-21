---
layout: post
title:  "Week Six | User Feedback"
tags: [gsoc, weekly report, coding period ]
author: Rohit R Chattopadhyay
---
This week, USA celebrated its Independence Day, hence work pace was affected. The focus was on the non-mainstream works on API and Static site.  

## Work Progress

1. **GraphQL API**

   To improve user experience, _Explorer_ has been implemented in the GraphiQL IDE. The implementation was done following an example from its creator [OneGraph](https://github.com/OneGraph/graphiql-explorer-example).  
    Minor modifications to the schema were done to incorporate the information required by GatsbyJS.
    The API was tested by running it over some queries to get statistics.  
    
    Related Issues:
    
    *    [Add GraphiQL Explorer in GraphQL API](https://github.com/cannin/ihop-reach/issues/51)
    *    [Use API for a Set of Queries](https://github.com/cannin/ihop-reach/issues/46)
    *    [Add SSL for enabling HTTPS protocol](https://github.com/cannin/ihop-reach/issues/52)
    *    [Test GraphQL API with Jest](https://github.com/cannin/ihop-reach/issues/37)
    *    [Documenting GraphQL API](https://github.com/cannin/ihop-reach/issues/16)
    
2. **Static GatsbyJS site**

    Journal title has been added in Details View. Dummy text has been replaced with meaningful ones.  
    SSL Ceritificate for HTTPS protocol was implemented using [Let's Encrypt](https://letsencrypt.org/).  
    
    Related Issues:
        
    *    [Add SSL for enabling HTTPS protocol](https://github.com/cannin/ihop-reach/issues/52)
    *    [Add Journal Title to Details Column to Site](https://github.com/cannin/ihop-reach/issues/54)
    
3. **Data Generation pipeline**
    
    As expected, this part of our project will take up our efforts as well as it will require some shrewd decisions from my mentor. I am sure he will sail the ship smoothly.  
    
    Related Issues:
    
    *    [Extract PublicationTypeList from PubMed](https://github.com/cannin/ihop-reach/issues/53)
    *    [Invalid Documents encountered in Dataset](https://github.com/cannin/ihop-reach/issues/11)
    
## Conclusion

The demo was shown to our users for their valuable feedback. In the following week, our focus will be on working on the received feedbacks also giving the data-generation pipeline a basic shape will be our priority.  
> In the year 2020 you will be able to go into the drug store, have your DNA sequence read in an hour or so, and given back to you on a compact disc so you can analyse it.  
> ~*Walter Gilbert*
