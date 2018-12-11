import * as Express from 'express';

import Config from '../common/Config';
import Database from '../common/MongoClient';
import toCard from './Cardify';

const app = Express();

app.get('/api/search', async (_, res) => {
  Database.get({})
    .then(results => res.send(toCard(results)));
});

app.get('/api/report', async (req, res) => {
  Database.get({id: Number(req.query.id)})
    .then(result => {
      if (result.length === 1) {
        res.send(result);
      } else {
        res.send();
      }
  });
});

app.listen(Config.dev_server.express_port, () => {
  console.log(`Server listening on port ${Config.dev_server.express_port}`);
});
