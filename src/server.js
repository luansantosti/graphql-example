const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const cors = require('cors')

const Category = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: {
      type: GraphQLID,
      resolve: (category) => category.id,
    },
    name: {
      type: GraphQLString,
      resolve: (category) => { 
        return category.name
      },
    }
  }
})

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: {
      type: GraphQLID,
      resolve: (product) => product.id,
    },
    name: {
      type: GraphQLString,
      resolve: (product) => { 
        return product.name
      },
    },
    category: {
      type: Category,
      resolve: (product) => categories.find(category => category.id === product.category)
    }
  }
})

let categories = [
  {
    id: 3,
    name: 'Nike',
  }
]

let products = [
  {
    id: 1,
    name: 'Air Max',
    category: 3
  }
]

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    product: {
      type: Product,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (_, args) => products.find(product => product.id === parseInt(args.id))
    },
    products: {
      type: GraphQLList(Product),
      resolve: () => products,
    }
  }
})


const schema = new GraphQLSchema({
  query: QueryType,
  // mutation: MutationType
})

const app = express();

app.use(cors()) 

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(5000);

console.log('running graphql server on 5000')