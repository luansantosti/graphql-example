const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } = require('graphql');
const { products, categories } = require('./data');

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    products: {
      type: GraphQLList(ProductType),
      resolve: (category) => products.filter(product => product.category === category.id),
    }
  })
})

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
    category: {
      type: CategoryType,
      resolve: (product, args, ctx) => categories.find(category => category.id === product.category),
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (_, args) => products.find(product => product.id === args.id),
    },
    products: {
      type: GraphQLList(ProductType),
      resolve: () => products,
    },
  })
})

const ProductInputType = {
  title: {
    type: GraphQLString,
  },
  price: {
    type: GraphQLString,
  },
  category: {
    type: GraphQLString,
  },
}

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ProductAddMutation: {
      type: ProductType,
      args: {
        ...ProductInputType,
      },
      resolve: (_, args) => {
        const { title, price, category } = args;
        const id = require('crypto').randomBytes(16).toString("hex");

        products.push({ id, title, price, category });

        return products.find(product => product.id === id);
      }
    },
    CategoryAddMutation: {
      type: CategoryType,
      args: {
        title: {
          type: GraphQLString
        }
      },
      resolve: (_, args) => {
        const { title } = args;
        const id = require('crypto').randomBytes(16).toString("hex");

        categories.push({ title, id});

        return categories.find(category => category.id === id);
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = schema;