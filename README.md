> ⚠️ This project is still experimental and API may break in future releases.

# static-auth

The most simple way to add Basic Authentication to a static website.

It was originally created to protect websites hosted on [Now](https://zeit.co/now), but it can be used in vanilla HTTP projects too and should work with Express.

## Usage with [Now](https://zeit.co/now) deployments

```node
const protect = require('static-auth');

module.exports = protect(
  __dirname + '/_static', // The directory where your static files (HTML, CSS...) live
  '/admin', // The path that requires authentication, meaning every URL that doesn't match is public (e.g. `/about`)
  { admin: 'admin' }, // Valid credentials in the form `<username>: "<password>"`
  { realm: 'my-website-name' } // Used by browsers
);
```

## Usage with a Vanilla [HTTP](https://nodejs.org/api/http.html) server

```node
//
// <code from the Now example above>
//

// Just add this
const http = require('http');
const server = http.createServer(module.exports);
server.listen(4444, () => console.log('Listening on port 4444...'));
```
