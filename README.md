[![version](https://img.shields.io/badge/version-1.1.1-cornflowerblue.svg?style=for-the-badge)](https://github.com/flawyte/static-auth/releases/tag/1.1.1)
[![downloads](https://img.shields.io/npm/dm/static-auth.svg?color=salmon&style=for-the-badge)](https://www.npmjs.com/package/static-auth)

# static-auth

The most simple way to add Basic Authentication to a static website, using a simple `Node.js` script.

I originally created this to add an authentication layer to my projects hosted on [Vercel](https://zeit.co/now), but it can be used with Node's built-in [`http`](https://nodejs.org/api/http.html) module too and should work with Express.

## Getting started

1. Install the package :
```bash
$ npm i static-auth -s

# or
$ yarn add static-auth
```

2. Use it :
```js
const auth = require('static-auth');

// Example with Vercel
module.exports = auth(
  '/admin',
  (user, pass) => (user === 'admin' && pass === 'admin') // (1)
);
  ```

3. There's no step 3 − it's that easy!

> (1) Checking credentials via the `==` or `===` operators makes your code vulnerable to [Timing attacks](https://snyk.io/blog/node-js-timing-attack-ccc-ctf/). This can be solved by using the [safe-compare](https://www.npmjs.com/package/safe-compare) package instead.

## Examples

### with [Vercel](https://zeit.co/now) ([demo](https://now-basic-auth-node-static-auth.flawyte.now.sh/), [source](https://github.com/flawyte/now-basic-auth/tree/master/node-static-auth))

See [here](https://github.com/flawyte/now-basic-auth/tree/master/node-static-auth) for a complete example.

### with Node's [HTTP](https://nodejs.org/api/http.html) module

`index.js`
```js
const protect = require('static-auth');

// create a handler that will check for basic authentication before serving the files
const serveHandler = protect( /* ... */ );

// start the server
const http = require('http');
const server = http.createServer(serveHandler);
server.listen(4444, () => console.log('Listening on port 4444...'));
```

## API

`auth(url, validator, [options])`

Required :
- **`url`** (*String*) : The base url to protect with Basic Authentication. Use `/` to restrict access to the whole website, or `/<path>` (e.g. `/admin`) to restrict access only to a section of your site.
- **`validator`** (*Function*) : A function that accepts two parameters (`user` and `pass`) and returns `true` if the provided login credentials grant access to the restricted area.

Optional :
- **`[options]`** (*Object*) :
  - **`[directory]`** (*String*, defaults to `process.cwd()`) : The base path to serve the static assets from. For example, if a request to `my-website.com/app.css` should return the content of the file located at `./www/app.css` (relative to the Node script), then you should set this to `__dirname + '/www'`, otherwise the script will look for `./app.css` − which doesn't exist − and return a 404.
  - **`[realm]`** (*String*, defaults to `'default-realm'`) : See [What is the "realm" in basic authentication](https://stackoverflow.com/questions/12701085/what-is-the-realm-in-basic-authentication) (StackOverflow).
  - **`[onAuthFailed]`** (*Function*) : A callback that accepts one parameter (`res`, an [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) object), useful if you want to return a custom error message or HTML page when the provided credentials are invalid.
