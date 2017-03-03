'use strict';

// test deps
const vargscb = require('vargs-callback');
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
   * log onto COINS
   * @param url {string} The string to navigate to (should redirect to a CAS login page).
   * @param done {function} a mochajs function to call when login is successful
   * TODO update to be compatible with portals as well
   */
  me.logon = vargscb((url, done) => {
    const callback = done || noop;
    const targetUrl = url || `https://${config.origin}/micis/index.php`;

    configuredClient.url(targetUrl);

    if (!me.loggedOn) {
      configuredClient
        .waitFor('.coins-logon-widget-form')
        .setValue(
          '.coins-logon-widget-form input[name=username]',
          config.auth.un
        )
        .setValue(
          '.coins-logon-widget-form input[name=password]',
          config.auth.pw
        )
        .click('.coins-logon-widget-form button[type=submit]') // TODO: update to use data-selector instead
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
  });

  return me;
};

