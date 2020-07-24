const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors')

const schema = buildSchema(`
  type Category {
    id: ID!
    name: String
  }

  type Product {
    id: ID!
    name: String
    price: Float
    description: String
    category: Category
  }

  type Query {
    products: [Product]
    categories: [Category]
  }

  input ProductInput {
    name: String
    price: Float
    category: ID!
    description: String
  }

  input CategoryInput {
    name: String
  }

  type Mutation {
    createCategory(input: CategoryInput): Category
    createProduct(input: ProductInput): Product
  }
`)


let products = [];
let categories = [];

const root = {
  products: () => products,
  categories: () => categories,
  createCategory: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    categories.push({ id, ...input })

    return categories.find(category => category.id === id);
  },
  createProduct: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    products.push({ id, ...input })

    return products.find(product => product.id === id);
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