const readCredentials = require('basic-auth');
const serveStatic = require('serve-static');

/*
 *
 */

const protect = (url, validator, { directory = process.cwd(), realm = 'default-realm', onAuthFailed = null } = {}) => {
  if (typeof url !== 'string')
    throw new Error('`url` is not a string');

  if (typeof validator !== 'function')
    throw new Error('`validator` is not a function');

  const serve = serveStatic(directory);

  return (req, res) => {
    if (req.url.startsWith(url)) { // if request URL requires authentication
      const credentials = readCredentials(req);

      if (!credentials || !validator(credentials.name, credentials.pass)) { // if credentials are missing / invalid
        res.writeHead(401, { 'WWW-Authenticate': `Basic realm="${realm}"` });

        if (typeof onAuthFailed === 'function') // if the user wants to customize the response
          onAuthFailed(res);
        else
          res.write('401 Unauthorized'); // otherwise, send a basic error message

        return res.end(); // don't serve the requested file
      }
    }

    serve(req, res, () => {
      res.statusCode = 404;
      res.end('404 Not Found');
    });
  };
};

/*
 *
 */

module.exports = protect;
