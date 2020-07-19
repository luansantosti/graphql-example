const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors')

const schema = buildSchema(`
  type Query {
    hello: String,
  }
`)

const root = {
  hello: () => {
    return 'hello world';
  }
}

const app = express();

app.use(cors()) 

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}))

app.listen(5000);

console.log('running graphql server on 5000')