import { diff } from 'deep-object-diff';
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

app.get('/api/report', async (req, res) => {
  mongoClient.get({ id: Number(req.query.id), instructorId: Number(req.query.prof) })
    .then((result) => {
      if (result.length === 1) {
        res.send(result[0]);
      } else {
        const difference = Object.keys(diff(result[0], result[1]));
        if (difference.length === 1 && difference[0] === '_id') {
          console.warn('Multiple results found for id/prof combo; corrupted metadata db?');
          res.send(result[0]);
        } else {
          console.log(result.map((a) => {
            return {
              _id: a._id,
              queryId: req.query.id,
              instructorId: req.query.prof,
              instructorFirstName: a.instructorFirstName,
              subject: a.subject,
              number: a.number,
            };
          }));
          res.send({ error: result.length });
        }
      }
    });
});

app.listen(Config.dev_server.express_port, () => {
  console.log(`Server listening on port ${Config.dev_server.express_port}${server.graphqlPath}`);
});
