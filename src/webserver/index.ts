import * as Express from 'express';
import Config from '../common/Config';

const app = Express();

app.listen(Config.dev_server.express_port, () => {
  console.log(`Development server listening on port ${Config.dev_server.express_port}`);
});

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
