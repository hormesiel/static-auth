> ⚠️ This project is still experimental and API may break in future releases.

# static-auth

The most simple way to add Basic Authentication to a static website, using a simple `Node.js` script.

It was originally created to protect websites hosted on [Now](https://zeit.co/now), but it can be used in vanilla HTTP projects too and should work with Express.

## Usage
### with [Now](https://zeit.co/now)

```node
const restrictAccessTo = require('static-auth');

module.exports = restrictAccessTo(
  // Use '/' if you want to restrict access to the whole website
  '/admin',

  // A callback to validate login credentials
  (user, pass) => (user == 'admin' && pass == 'admin'),

  // Optional options
  {
    // Path to the static files' parent directory (if not a sibling of this script).
    //
    // For example if your static files are located on disk at `~/my/website/public` but you don't
    // want `public` to appear in the URL so your HTML can have `<link href='/app.css'>` instead of
    // `<link href='/public/app.css'>` ‒ and this script is located at `~/my/website/index.js` ‒ then
    // you should pass `__dirname + '/public'`
    directory: __dirname + '/_static',

    // See https://stackoverflow.com/questions/12701085/what-is-the-realm-in-basic-authentication
    realm: 'my-website-admin',

    // A callback to respond with a custom message (or a custom error HTML page) to the user when
    // his login credentials are not valid.
    //
    // Note: You don't need to set the `statusCode` to 401 and the `WWW-Authenticate` header as this
    // is already done internally.
    onAuthFailed: (res) => res.end('Restricted area. Please login.')
  }
);
```

### with a Vanilla [HTTP](https://nodejs.org/api/http.html) server

```node
//
// <copy / paste the code from the Now usage example above>
//

// Then just add this to start the server
const http = require('http');
const server = http.createServer(module.exports);
server.listen(4444, () => console.log('Listening on port 4444...'));
```
