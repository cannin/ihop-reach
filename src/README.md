## REACH Static Site using GatsbyJS
This branch is responsible for the project's frontend development.

##### Installation

1. Download using `git clone --branch docker-frontend https://github.com/RohitChattopadhyay/ihop-reach.git`
2. Enter working directory using `cd src`
3. Install using `npm install`
4. Start GraphQL Server
5. RUN `GATSBY_GRAPHQL_API_HOST={GRAPHQL} gatsby develop` for starting development server
6. RUN `GATSBY_GRAPHQL_API_HOST={GRAPHQL} gatsby build` for building the static site

You can use environment variable `GATSBY_PAGE_LIMIT` for restricting number of generated pages, by default it is `0` ie all pages.
