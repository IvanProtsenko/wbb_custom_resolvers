import { ApolloServer, gql } from 'apollo-server';
import dotenv from 'dotenv';
import getData from './services/MessagingSecond';
import convertToReturnData from './services/ConvertToReturnData';
import ReturnData from './interfaces/ReturnData';

dotenv.config();

const typeDefs = gql`
  input messageRequest {
    url: String
    text: String
  }

  type ReturnData {
    service_name: String
    instance_uuid: String
    current_workers: Int
    max_workers: Int
  }

  type Mutation {
    sendMessage(payload: messageRequest): String!
  }

  type Query {
    Orders(id: ID!): ID!
    getData: [ReturnData]
  }
`;

const resolvers = {
  Mutation: {
    sendMessage: async (parent: any, args: any, context: any, info: any) => {
      try {
        return 'success';
      } catch (err) {
        console.log(err);
        return 'error';
      }
    },
  },
  Query: {
    Orders: (parent: any, args: any, context: any, info: any) => {
      return args.id;
    },
    getData: async (parent: any, args: any, context: any, info: any) => {
      try {
        const response = await getData();
        if (response) {
          const result: ReturnData[] = convertToReturnData(response);
          return result;
        }
        return 'error';
      } catch (err: any) {
        console.log(err);
        return 'error';
      }
    },
  },
};

async function run() {
  const server = new ApolloServer({
    cors: { allowedHeaders: '*' },
    typeDefs,
    resolvers,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

run();
