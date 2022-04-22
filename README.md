[![version](https://img.shields.io/badge/version-2.1.2-lightseagreen.svg?style=for-the-badge)](https://github.com/flawyte/static-auth/releases/tag/2.1.2)
[![downloads](https://img.shields.io/npm/dm/static-auth.svg?color=salmon&style=for-the-badge)](https://www.npmjs.com/package/static-auth)

# static-auth

The most simple way to add Basic Authentication to a static website hosted on Vercel.

I originally created this to add an authentication layer to my projects hosted on [Vercel](https://vercel.com), but it can be used with Node's built-in [`http`](https://nodejs.org/api/http.html) module too and should work with Express.

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

### with Vercel

* [demo](https://vercel-basic-auth-node-static-auth.flawyte.vercel.app/)
* [source](https://github.com/flawyte/vercel-basic-auth/tree/master/node-static-auth)

### with [Node's HTTP module](https://nodejs.org/api/http.html)

`index.js`

```js
const auth = require('static-auth');

// create a handler that will check for basic authentication before serving the files
const serveHandler = auth( /* ... */ );

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
    - **`[onAuthFailed]`** (*Function*) : A callback that accepts one parameter (`res`, an [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) object), useful if you want to return a custom error message or HTML page when the provided credentials are invalid.
    - **`[realm]`** (*String*, defaults to `'default-realm'`) : See [What is the "realm" in basic authentication](https://stackoverflow.com/questions/12701085/what-is-the-realm-in-basic-authentication) (StackOverflow).
    - **`[serveStaticOptions]`** (*Object*, defaults to `{}`) : [Options](https://github.com/expressjs/serve-static#options) to pass to the underlying *serve-static* module that's used to serve the files (see a usage example [here](https://github.com/flawyte/static-auth/pull/4#issue-573776989)).
