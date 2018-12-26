import * as Express from 'express';
import { ApolloServer } from 'apollo-server-express';

import Config from '../common/Config';
import MongoClient from '../common/MongoClient';
import { toReportCard } from './Cardifier';
import typeDefs from '../common/graphql/typeDefs';

const app = Express();
const mongoClient = new MongoClient('report');

const resolvers = {
  Query: {
    report: (_, { id, instructorId }: { id: number, instructorId: number }) => {
      if (instructorId) {
        return mongoClient.get({ id, instructorId });
      }
      return mongoClient.get({ id });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.get('/api/search', async (req, res) => {
  mongoClient.get({}, req.query.page)
    .then(results => res.send(toReportCard(results)));
});

app.listen(Config.dev_server.express_port, () => {
  console.log(`Server listening on port ${Config.dev_server.express_port}${server.graphqlPath}`);
});
