const getCredentials = require('basic-auth');
const serveStatic = require('serve-static');

/*
 *
 */

const checkCredentials = (current, authorized) => {
  if (!current)
    return false;

  const usernames = Object.keys(authorized);
  const passwords = Object.values(authorized);

  for (let i = 0; i < usernames.length; i++) {
    const user = usernames[i];
    const pass = passwords[i];
    const matches = (user == current.name) && (pass == current.pass);

    if (matches)
      return true;
  }

  return false;
};

const protect = (dir, path, authorizedCredentials, { realm = 'default-realm' } = {}) => {
  return (req, res) => {
    // Check authorization if URL requires it
    if (req.url.startsWith(path)) {
      const credentials = getCredentials(req);

      if (!checkCredentials(credentials, authorizedCredentials)) {
        res.writeHead(401, { 'WWW-Authenticate': `Basic realm=${realm}` });
        res.end('401 Unauthorized');
        return;
      }
    }

    // Serve target file
    serveStatic(dir)(req, res, () => res.end('404 Not Found'));
  };
};

/*
 *
 */

module.exports = protect;
