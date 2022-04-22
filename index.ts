// Imports

import type * as http from 'http';
import readCredentials from 'basic-auth';
import serveStatic from 'serve-static';

// Types

interface Options {
  directory?: string;
  realm?: string;
  onAuthFailed?: (res) => void;
  serveStaticOptions?: serveStatic.ServeStaticOptions;
}

type ValidatorFunction = (username: string, password: string) => boolean;

// Variables

const optionsDefaultValues: Options = {
  directory: process.cwd(),
  onAuthFailed: res => res.write('401 Unauthorized'), // by default send a basic error message
  realm: 'default-realm',
  serveStaticOptions: {}
};

// Exports

export default (url: string, validator: ValidatorFunction, optionsUserValues: Options = {}): http.RequestListener => {
  // Check required parameters

  if (typeof url !== 'string')
    throw new Error('`url` is not a string');
  if (typeof validator !== 'function')
    throw new Error('`validator` is not a function');

  // Make sure all options are initialized

  const options = {
    ...optionsDefaultValues,
    ...optionsUserValues,
  };

  // Everything OK

  const serve = serveStatic(options.directory, options.serveStaticOptions);

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url.startsWith(url)) { // if request URL requires authentication
      const credentials = readCredentials(req);

      if (!credentials || !validator(credentials.name, credentials.pass)) { // if credentials are missing / invalid
        res.writeHead(401, { 'WWW-Authenticate': `Basic realm="${options.realm}"` });
        options.onAuthFailed(res); // tell the user
        return res.end(); // don't serve the requested file
      }
    }

    serve(req, res, () => {
      res.statusCode = 404;
      res.end('404 Not Found');
    });
  };
};
