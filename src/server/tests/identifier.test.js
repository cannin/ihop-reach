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

it('Test GET identifier Query', async () => {
  let method = 'GET'
  let query = `{identifier(identifier:"chebi:CHEBI:10007"){syn typ iden}}`
  await middleware(request(method, query), response)
  const responseData = response.json.mock.calls[0][0]
  expect(responseData).toMatchSnapshot()
})
