---
layout: post
title:  "Week Five | First Evaluation ✔"
tags: [gsoc, weekly report, coding period , second phase]
author: Rohit R Chattopadhyay
---
July 2019, has brought in several happy moments for me, first passing the First Evaluation of GSoC and second being my first paycheck.   
My evaluation feedback was positive and I am thankful to my mentor Augustin, for highlight things which I was not doing correctly.  
Being a part of the Open Source community it is my responsibility to maintain proper documentation for future contributors, I was lacking in this, in future I will take care of this.

## Work Progress

1. **Data Generation Pipeline**

    In this phase of our project, the main objective is to set up the data generation pipeline, this will help us to maintain the database and keep our application up to date.  
    Related Issues:
    
    *    [Setup Indra Locally for Data Generation](https://github.com/cannin/ihop-reach/issues/41)
    *    [Absence of Year in PubMed XML files](https://github.com/cannin/ihop-reach/issues/43)
    *    [Add publication_date in literature/pubmed_client.py](https://github.com/sorgerlab/indra/pull/902)

2. **Web Application Development**

    Details view was made more informative by adding details about the publication date of the articles, taxonomy and other useful details.  
    Related Issues:

    *    [Remove the Full Star from Details Panel](https://github.com/cannin/ihop-reach/issues/50)
    *    [Add Additional Animal Information for Taxonomy Column](https://github.com/cannin/ihop-reach/issues/49)
    *    [Fix Colors in Highlight PMC Script](https://github.com/cannin/ihop-reach/issues/48)
    *    [Add Date Column to Site](https://github.com/cannin/ihop-reach/issues/47)
    
3. **GraphQL API Development**
    
    Some analytics was done using the API. Instead of the traditional `find()`, the MongoDB query has been switched to `aggregate()` to improve performance and joining multiple collections.  
    Related Issues:
    
    *    [Added NLP identifier hit and entity hit ](https://github.com/cannin/reach-query/pull/1)
    *    [Use API for a Set of Queries](https://github.com/cannin/ihop-reach/issues/46)
    *    [Add Date Column to Site](https://github.com/cannin/ihop-reach/issues/47)

    
    
## Conclusion

This week, our focus will be on the data generation pipeline, some major decisions will be made after receiving feedback from the user group of our application.  
I contributed to some related projects in Open Source community, this has helped me gain exposure and develop self-belief.  

> Problems are not stop signs, they are guidelines.  
> ~*Robert H. Schuller*
