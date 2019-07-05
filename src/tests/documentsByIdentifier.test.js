import graphqlHTTP from 'express-graphql'
import { resolvers, context } from '../resolvers'
import graphQL_Schema from '../schema.graphql'
import { buildSchema } from 'graphql'

const schema = buildSchema(graphQL_Schema)

const middleware = graphqlHTTP({
  schema,
  rootValue: resolvers,
  context,
})

const request = (met, q) => ({
  method: met,
  headers: {},
  //replace with your query
  body: { query: q },
})

const response = {
  setHeader: jest.fn(),
  end: jest.fn(),
  json: jest.fn(),
}
it('Test POST documentsByIdentifier Query', async () => {
  jest.setTimeout(10000)
  let method = 'POST'
  let query = `{documentsByIdentifier(identifier: "taxonomy:9606") {documents {pmc_id}}}`
  await middleware(request(method, query), response)
  const responseData = response.json.mock.calls[0][0]
  expect(responseData).toMatchSnapshot()
})
