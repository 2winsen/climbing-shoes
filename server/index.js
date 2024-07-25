var fs = require('fs');

function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 1234;

var cors_proxy = require('cors-anywhere');
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
// Set up rate-limiting to avoid abuse of the public CORS Anywhere server.
var checkRateLimit = require('cors-anywhere/lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);
var httpsOptions =
  process.env.PORT === 443
    ? {
        key: fs.readFileSync(process.env.SSL_PRIV_KEY),
        cert: fs.readFileSync(process.env.SSL_FULLCHAIN),
      }
    : undefined;

cors_proxy
  .createServer({
    httpsOptions: httpsOptions,
    originWhitelist: originWhitelist,
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    checkRateLimit: checkRateLimit,
  })
  .listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
  });
