'use strict';

// test deps
const config = require('config');
const client = require('../client.js').client;
const nav = require('../nav/navigation.js')(client, config);
const noop = require('lodash/noop');

/**
 * Browser actions for authenticating with MICIS
 * @param {Object} configuredClient The browser client to perform actions on
 */
module.exports = (configuredClient) => {
  const me = {};
  /* eslint-disable no-underscore-dangle,no-param-reassign */
  Object.defineProperty(me, 'loggedOn', {
    get() { return configuredClient._loggedOnMicis; },
    set(x) { configuredClient._loggedOnMicis = x; },
  });
  /* eslint-enable no-underscore-dangle,no-param-reassign */

  /**
   * log out of COINS
   * @param done {function} a mochajs function to call when login is successful
   */
  me.logout = () => {
    me.loggedOn = false;
    return configuredClient.url(`https://${config.origin}/micis/logout.php`);
  };

  /**
   * Log in to COINS.
   *
   * @todo update to be compatible with portals as well
   *
   * @param {Function} [done] Function to execute once logon is complete
   */
  me.logon = (done) => {
    const callback = done || noop;

    configuredClient.url(`https://${config.origin}`);

    if (!me.loggedOn) {
      configuredClient
        .waitForExist('input[name=password]', 3000)
        .setValue('.modal form input[name=username]', config.auth.un)
        .setValue('.modal form input[name=password]', config.auth.pw)
        .click('.modal form button[type=submit]')
        .waitForPaginationComplete()
        .getCookie('MICIS', (err, cookie) => {
          if (cookie) {
            me.loggedOn = cookie;
          } else {
            throw new Error('micis cookie not found');
          }
        });
    }

    return nav
      .disableNavigationAlert()
      .call(callback);
  };

  return me;
};

