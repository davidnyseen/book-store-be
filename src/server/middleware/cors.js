import { HttpStatus } from '@server/utils/status';
function cors(app) {
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.set('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.setHeader('Content-Length', '0');
      res.status(HttpStatus.NoContent);
      res.end();
      return;
    }
    next();
  });
}

export default cors;
