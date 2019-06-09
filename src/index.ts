// setup mstime to measure API response time
const mstime = require('mstime');

mstime.plugins([{ plugin: require('mstime/dist/cjs/plugins/msPluginTrimMean') }]);
mstime.start('app-start');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// const https = require('https');
const spdy = require('spdy'); // for HTTP2
const fs = require('fs');
const socket = require('api/services/socket');
const app = require('./config/express');
const { port, env, socketEnabled } = require('./config/vars');

const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();

// HTTPS options
// const options = {
//   key: fs.readFileSync('./src/config/https/localhost-key.pem'),
//   cert: fs.readFileSync('./src/config/https/localhost.pem')
// };
// const server = spdy.createServer(options, app);

// if (socketEnabled) {
//   socket.setup(server);
// }

app.listen(port, () => {
  console.info(`--- 🌟  Started (${env}) --- https://localhost:${port}`);
  console.log(`${mstime.end('app-start').last} ms`);
});

if (env === 'development') {
  // initialize test data once (admin@example.com)
  require('./api/utils/InitData');
}

/**
 * Exports express
 * @public
 */
module.exports = app;