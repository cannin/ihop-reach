iHOP Reach GraphQL API
---

### Table of Content
1. [GraphiQL](#GraphiQL)
2. [CURL Instruction](#CURL-Instruction)
3. [Local Installation](#Local-Installation)
4. [Example Query](#Example-Query)

***

1. ### GraphiQL
    
    It is a graphical interactive in-browser GraphQL IDE. It consists of helper text which acts as a guide to extract data from the database. This tool helps you make and test the GraphQL queries.
    Try it by going to `[BASEURL]/graphql` from your browser.
    
    ![image](https://user-images.githubusercontent.com/19877300/58692172-a9078780-83ab-11e9-9077-76aef3e1d60e.png)

***

2. ### CURL Instruction
    
    The GraphQL API can be accessed by sending POST or GET requests to the endpoint `/graphql`
    For example
      ```
        curl \
      -X POST \
      -H "Content-Type: application/json" \
      --data '{ "query": "{articles(page: 1){pmc_id evidence extracted_information{participant_b {entity_text}}score}}" }' \
      http://[BASEURL]/graphql
      ```
    It specifies four things about the request.
    
    1. The `POST` HTTP verb, defines the type of the request. `GET` is also supported, but mutation cannot be done using a `GET` request.
    2. The *content type* of `application/json`, the query is being sent as a part of a JSON object.
    3. The *data sent*, is a JSON document. In this above example: 
    ```
    {articles(page: 1){pmc_id evidence extracted_information{participant_b {entity_text}}score}}
    ```
    4. The *actual URL of the GraphQL endpoint*, in the example `http://[BASEURL]/graphql`
    
***  

3. ### Local Installation

    1. Clone or Download this repository
    2. Run command `npm install` in terminal
    3. Make sure that MongoDB is running.
    4. To start the API run command `npm start`

***

4. ### Example Query
    
    1. To retrieve 250 articles per page. `$pageNumber` indicates the page number to be fetched
    
        Query:

            {
              articles(page: $pageNumber){
                pmc_id
                evidence
                extracted_information{
                  participant_b {
                    entity_text
                  }
                }
                score
              }
            }
        
        Example Output:
        
        ```
        {
          "data": {
            "articles": [
              {
                "pmc_id": "100781",
                "extracted_information": {
                  "participant_b": {
                    "entity_text": "cGMP"
                  }
                }
              },
              {
                "pmc_id": "100781",
                "extracted_information": {
                  "participant_b": {
                    "entity_text": "AQP1"
                  }
                }
              },

              {
                "pmc_id": "102322",
                "extracted_information": {
                  "participant_b": {
                    "entity_text": "p50"
                  }
                }
              },
                
                        |
                        |
                        |
                
                
              {
                "pmc_id": "102332",
                "extracted_information": {
                  "participant_b": {
                    "entity_text": "TNF"
                  }
                }
              },
              {
                "pmc_id": "102332",
                "extracted_information": {
                  "participant_b": {
                    "entity_text": "WOX1"
                  }
                }
              }
            ]
          }
        }
        ```
    2. To retrive an article by `_id`
    
        Query:
            
            {
              article(id: $_id) {
                extracted_information {
                  participant_a {
                    identifier
                  }
                  participant_b {
                    identifier
                  }
                }
              }
            }
        
        Example Output:
            
            {
              "data": {
                "article": {
                  "extracted_information": {
                    "participant_a": {
                      "identifier": "uniprot:Q12794"
                    },
                    "participant_b": {
                      "identifier": "uniprot:Q9NZC7"
                    }
                  }
                }
              }
            }

