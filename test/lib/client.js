'use strict';

// webdriver deps
const WebdriverIO = require('webdriverio');
const config = require('config');

const options = {
  desiredCapabilities: {
    browserName: config.get('browserName'),
    chromeOptions: {
      /**
       * Disable the Push Notifications API.
       * {@link http://peter.sh/experiments/chromium-command-line-switches/}
       */
      args: ['--disable-notifications'],
    },
  },
  host: config.get('host'),
  port: config.get('port'),
};
const client = WebdriverIO.remote(options);

require('./../../util/pagination.js')(client);

const clientReady = new Promise((resolve, reject) => {
  client.init((err) => {
    if (!err) {
      resolve();
    } else {
      reject(err);
    }
  });
}).catch((err) => {
  console.error(err); // eslint-disable-line no-console
  throw err;
});

module.exports.client = client;
module.exports.client.clientReady = clientReady;
module.exports.clientReady = clientReady;
