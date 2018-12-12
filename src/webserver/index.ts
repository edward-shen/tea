import * as Express from 'express';

import Config from '../common/Config';
import MongoClient from '../common/MongoClient';
import Cardify from './Cardify';

const app = Express();

app.get('/api/search', async (req, res) => {
  MongoClient.get({}, req.query.page)
    .then(results => res.send(Cardify(results)));
});

app.get('/api/report', async (req, res) => {
  MongoClient.get({ id: Number(req.query.id) })
    .then((result) => {
      if (result.length === 1) {
        res.send(result[0]);
      } else {
        console.log(result.map((a) => {
          return {
            instructorFirstName: a.instructorFirstName,
            subject: a.subject,
            number: a.number,
          };
        }));
        res.send({ error: result.length });
      }
    });
});

app.listen(Config.dev_server.express_port, () => {
  console.log(`Server listening on port ${Config.dev_server.express_port}`);
});
