import { ApolloServer, gql } from 'apollo-server';
import dotenv from 'dotenv';
import { getData, pullData } from './services/MessagingSecond';
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

  type WorkerResponce {
    total_max_workers: Int
    total_current_workers: Int
  }

  type Mutation {
    sendMessage(payload: messageRequest): String!
  }

  type Query {
    Orders(id: ID!): ID!
    getData: [ReturnData]
    getWorkersCount: WorkerResponce!
    pullData(service_names: [String]): String
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
    getWorkersCount: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      try {
        const response = await getData();
        let total_max_workers: number = 0;
        let total_current_workers: number = 0;
        if (response) {
          response.payload.forEach((payload) => {
            total_max_workers += payload.max_workers;
            total_current_workers += payload.node
              ? payload.node.payload.workers_count
              : 0;
          });
          return {
            total_max_workers,
            total_current_workers,
          };
        }
        return 'error';
      } catch (err: any) {
        console.log(err);
        return 'error';
      }
    },
    pullData: async (parent: any, args: any, context: any, info: any) => {
      try {
        await pullData(args.service_names);
        return 'success';
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
