[![version](https://img.shields.io/badge/version-1.0.0-cornflowerblue.svg?style=for-the-badge)](https://github.com/flawyte/static-auth/releases/tag/1.0.0)
[![downloads](https://img.shields.io/npm/dm/static-auth.svg?color=salmon&style=for-the-badge)](https://www.npmjs.com/package/static-auth)

# static-auth

The most simple way to add Basic Authentication to a static website, using a simple `Node.js` script.

I originally created this to add an authentication layer to my projects hosted on [Now](https://zeit.co/now), but it can be used with Node's [`http`](https://nodejs.org/api/http.html) module too and should work with Express.

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

// Example with Now
module.exports = auth(
  '/admin',
  (user, pass) => (user == 'admin' && pass == 'admin')
);
  ```

3. There's no step 3 − it's that easy!

## Examples

### with [Now](https://zeit.co/now) ([demo](https://now-basic-auth-node-static-auth.flawyte.now.sh/))

`index.js`
```js
const auth = require('static-auth');

module.exports = auth(
  '/admin',
  (user, pass) => (user == 'admin' && pass == 'admin')
);
```

`now.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@now/node",
      "config": {
        "includeFiles": ["**/*.html"]
      }
    }
  ],
  "routes": [
    { "src": "/.*", "dest": "index.js" }
  ]
}
```

The `includeFiles` property tells Now (in particular : [ncc](https://github.com/zeit/ncc)) to bundle your HTML files with the lambda, so it can access those files and serve them to the user. If you have other static assets, like CSS or JS files, you should tell Now to include them too (e.g. `"includeFiles": ["**/*.html", "**/*.css", "**/*.js"]`).

Note that we also redirect all the HTTP requests to the Node script (thus avoiding Now's default behavior) so it can check for authorization before serving the requested files. Otherwise, the script would be useless.

### with Node's [HTTP](https://nodejs.org/api/http.html) module

`index.js`
```js
// ... same as the Now example above ...

// Just add this
const http = require('http');
const server = http.createServer(module.exports);
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
  - **`[onAuthFailed]`** (*Function*) : A callback that accepts one parameter (`res`, an [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) object) and calls `res.end()` at some point (**otherwise your script will not terminate**). Useful if you want to return a custom message or HTML page when the provided credentials are not valid.
