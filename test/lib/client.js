

// webdriver deps
const WebdriverIO = require('webdriverio');
let paginationUtils;
const config = require('config');
const options = {
  desiredCapabilities: {
    browserName: config.get('browserName'),
  },
  host: config.get('host'),
  port: config.get('port'),
};
const client = WebdriverIO.remote(options);
paginationUtils = require('./../../util/pagination.js')(client);

const clientReady = new Promise((resolve, reject) => {
  client.init((err) => {
    if (!err) {
      resolve();
    } else {
      reject(err);
    }
  });
}).catch((err) => {
  console.error(err);
  throw err;
});

module.exports.client = client;
module.exports.client.clientReady = clientReady;
module.exports.clientReady = clientReady;

