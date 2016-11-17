'use strict';

// test deps
let vargscb = require('vargs-callback');
let config = require('config');
let client = require('../client.js').client;
let nav = require('../nav/navigation.js')(client, config);
let noop = function () {};

/**
 * Browser actions for authenticating with MICIS
 * @param client {webdriverioClient} The browser client to perform actions on
 */
module.exports = function (client) {
    let me = {};
  Object.defineProperty(me, 'loggedOn', {
      get () { return client._loggedOnMicis; },
      set (x) { client._loggedOnMicis = x; },
    });


    /**
     * log out of COINS
     * @param done {function} a mochajs function to call when login is successful
     */
  me.logout = function (done) {
      me.loggedOn = false;
      return client.url(`https://${  config.origin  }/micis/logout.php`);
    };

    /**
     * log onto COINS
     * @param url {string} The string to navigate to (should redirect to a CAS login page).
     * @param done {function} a mochajs function to call when login is successful
     * TODO update to be compatible with portals as well
     */
  me.logon = vargscb((url, done) => {
      done = done || noop;
        // set default params
      url = url || `https://${  config.origin  }/micis/index.php`;

      client.url(url);
      if (!me.loggedOn) {
          client
                .waitFor('.coins-logon-widget-form')
                .setValue(
                    '.coins-logon-widget-form input[name=username]',
                    config.auth.un,
                )
                .setValue(
                    '.coins-logon-widget-form input[name=password]',
                    config.auth.pw,
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
            .call(done);
    });

  return me;
};
