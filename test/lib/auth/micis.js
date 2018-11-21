'use strict';

// test deps
const nav = require('../nav/navigation.js');

/**
 * Browser actions for authenticating with MICIS
 * @param {Object} configuredClient The browser client to perform actions on
 */
module.exports = (configuredClient) => {
  const me = {};
  /* eslint-disable no-underscore-dangle,no-param-reassign */
  Object.defineProperty(me, 'loggedOn', {
    get() {
      return configuredClient._loggedOnMicis;
    },
    set(x) {
      configuredClient._loggedOnMicis = x;
    },
  });
  /* eslint-enable no-underscore-dangle,no-param-reassign */

  /**
   * log out of COINS
   * @param done {function} a mochajs function to call when login is successful
   */
  me.logout = () => {
    me.loggedOn = false;
    return configuredClient.url('/micis/logout.php');
  };

  /**
   * Log in to COINS.
   *
   * @todo update to be compatible with portals as well
   *
   * @param {Function} [done] Function to execute once logon is complete
   */
  me.logon = () => {
    if (configuredClient.options.baseUrl.includes('coinstraining')) {
      configuredClient.url('/');
    } else {
      const route = encodeURIComponent(`${configuredClient.options.baseUrl}/micis/index.php`);
      configuredClient.url(`/login/?rp=${route}`);
    }

    if (!me.loggedOn) {
      configuredClient.element('input[name=password]').waitForExist();
      configuredClient
        .setValue('.modal form input[name=username]', configuredClient.options.auth.un)
        .setValue('.modal form input[name=password]', configuredClient.options.auth.pw)
        .click('.modal form button[type=submit]')
        .waitForPaginationComplete();
      const cookie = configuredClient.getCookie('MICIS');
      if (cookie) {
        me.loggedOn = cookie;
      } else {
        throw new Error('micis cookie not found');
      }
    }
    return nav(configuredClient)
      .disableNavigationAlert();
  };

  return me;
};
