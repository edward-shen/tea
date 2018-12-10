import * as Express from 'express';
import Config from '../common/Config';
import Database from '../common/MongoClient';
const app = Express();

app.get('/api/express_backend', async (_, res) => {
  const results = await Database.get({"subject":"CS", "number": 2500});
  res.send(results);
});

app.listen(Config.dev_server.express_port, () => {
  console.log(`Server listening on port ${Config.dev_server.express_port}`);
});
