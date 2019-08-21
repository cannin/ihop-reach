---
layout: post
title:  "Week Seven | Data Generation Pipeline"
tags: [gsoc, weekly report, coding period ]
author: Rohit R Chattopadhyay
---
The focus of our project now shifts to implementing the data-generation pipeline, which will fetch articles from the [NCBI](https://ncbi.nlm.nih.gov) repository to keep our database up to date.  

## Work Progress

1. **Data Generation Pipeline**
    
    The size of the repository is a major hurdle in this task. We tried to run it in the UCSD server and found out that, it will take at least a year to complete.  
    To improve the time, my mentor suggested that we will split the work in different computers so that parallel processing can be done.  
   
2. **Setting up Analytics**

    This is one of the major features that will not only help us know our users but also help us in developing a better application for the users.  
    Integration of Google Analytics for the static site was done using the official [gatsby-plugin-google-analytics](https://www.npmjs.com/package/gatsby-plugin-google-analytics).  
    For GraphQL API we implemented server-side analytics using Google Analytics API's [Mesurement Protocol API](https://developers.google.com/analytics/devguides/collection/protocol/v1/). For now, we have set it up to get geographic location and pageviews of the users.  
    
    Related Issue:
        
    *    [Obtain Usage Statistics for GraphQL Queries](https://github.com/cannin/ihop-reach/issues/61)  
    *    [Add react-helmet and react-ga to Gatsby](https://github.com/cannin/ihop-reach/issues/14)

3. **Others**

    *    [Add More Complex Example Queries to GraphQL Documentation](https://github.com/cannin/ihop-reach/issues/60)
    *    [Extract MeshHeadingList from Pubmed](https://github.com/cannin/ihop-reach/issues/56)
    *    [Change the word "Synonyms" to "Matched Entities" in the Details Page](https://github.com/cannin/ihop-reach/issues/57)
    *    [Extract PublicationTypeList from PubMed](https://github.com/cannin/ihop-reach/issues/53)

    
## Conclusion

I will be relocating to Kolkata as my classes begin next week. This restricts my work hours towards the project, but I believe proper planning will allow me to handle everything smoothly.  
> When something is important enough, you do it even if the odds are not in your favour.  
> ~*Elon Musk*
