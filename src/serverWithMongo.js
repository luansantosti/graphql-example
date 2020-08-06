const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const cors = require('cors')
const mongoose = require('mongoose');

const Category = require('./models/CategoryModel');
const Product = require('./models/ProductModel');

mongoose.connect('mongodb://localhost/products', { useNewUrlParser: true });

const db = mongoose.connection;

if(!db) {
  console.log('Error connecting db');
} else {
  console.log('DB connected succesfully')
}

const CategoryType = new GraphQLObjectType({
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

const ProductType = new GraphQLObjectType({
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
      type: CategoryType,
      resolve: (product) => Category.findOne({ _id: product.category })
    }
  }
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (_, args) => Product.findById({ _id: args.id })
    },
    products: {
      type: GraphQLList(ProductType),
      resolve: () => Product.find(),
    },
    categories: {
      type: GraphQLList(CategoryType),
      resolve: () => Category.find(),
    }
  })
})

const ProductInputType = {
  name: {
    type: GraphQLString,
  },
  category: {
    type: GraphQLID,
  },
}

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    CategoryAddMutation: {
      type: CategoryType,
      args: {
        name: {
          type: GraphQLString,
        } 
      },
      resolve: (_, args) => {
        const { name } = args;
        
        const category = new Category({
          name
        })

        category.save();

        return category;
      }    
    },
    ProductAddMutation: {
      type: ProductType,
      args: {
        ...ProductInputType,
      },
      resolve: (_, args) => {
        const { name, category } = args;
        
        const product = new Product({
          name,
          category
        })

        product.save();

        return product;
      }
    },
    // ProductEditMutation: {
    //   type: ProductType,
    //   args: {
    //     id: {
    //       type: GraphQLID
    //     },
    //     ...ProductInputType
    //   },
    //   resolve: (_, args) => {
    //     const updateProduct = {
    //       ...args,
    //     }

    //     const index = products.findIndex(product => product.id === args.id);

    //     products[index] = updateProduct;

    //     return products[index];
    //   }
    // }
  }),
})


const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

const app = express();

app.use(cors()) 

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(5000);

console.log('running graphql server on 5000')