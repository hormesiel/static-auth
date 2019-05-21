const auth = require('static-auth');

// Example with Now
module.exports = auth(
  '/admin',
  (user, pass) => (user == 'admin' && pass == 'admin')
);

/*
 *
 */

if (process.env.SERVE === 'true') {
  const http = require('http');
  const server = http.createServer(module.exports);
  server.listen(4444, () => console.log('Listening on port 4444...'));
}
