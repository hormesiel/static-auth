const getCredentials = require('basic-auth');
const serveStatic = require('serve-static');

/*
 *
 */

const protect = (url, validator, { directory = process.cwd(), realm = 'default-realm', onAuthFailed = null } = {}) => {
  // checks >>
  if (typeof url !== 'string')
    throw new Error('`url` is not a string');

  if (typeof validator !== 'function')
    throw new Error('`validator` is not a function');
  // << checks

  const serve = serveStatic(directory);

  return (req, res) => {
    // If request URL starts with the URL the user wants to restrict access to
    if (req.url.startsWith(url)) {
      const credentials = getCredentials(req);

      // If no credentials provided or they're not valid
      if (!credentials || !validator(credentials.name, credentials.pass)) {
        // Return 401 to ask for auth
        res.writeHead(401, { 'WWW-Authenticate': `Basic realm=${realm}` });

        // Call user's auth failed handler if provided (e.g. to return a custom HTML error page)
        if (typeof onAuthFailed === 'function')
          onAuthFailed(res);
        // Else, respond with a basic error message
        else
          res.end('401 Unauthorized');

        // Don't serve the requested file
        return;
      }
    }

    // Serve the requested file
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
