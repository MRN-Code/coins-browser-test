'use strict';

/* eslint-env browser */

const vargscb = require('vargs-callback');
const config = require('config');
const _ = require('lodash');

/**
 * Pagination Utilities
 * This module adds commands to the webdriver.io client to aid in dealing with COINS pagination
 * @param client {WebdriverioClient} a webdriverio client to add the helpers to
 */

/**
 * waitForCondition
 * performs a busy-wait, while polling for a condition to return true in the browser
 * @param condition {string|Function} required. a string or function to be executed in the browser.
 *   This function will be recursively executed until it returns true, or until timeout
 * @param options {object} an (optional) object containing properties for timeout and interval:
 *   options.interval = the amount of time to wait between polling (default 500ms)
 *   options.timeout = the maximum amount of time to wait
 * @param cb {function} A callback function supplied by mocha (aka `done`) or by webdriverio
 * Note: this function will be wrapped by webdriverio, and will always be passed a callback
 *   as the last parameter. Since we have optional parameters, we will use the vargs-callback
 *   module to __pad__ the arguments passed to this function (replace missing args with unknowns)
 */
function waitForCondition(condition, conditionArgs, options, cb) {
  options = options || {}; // eslint-disable-line no-param-reassign
  if (!_.isArray(conditionArgs)) {
    conditionArgs = [conditionArgs]; // eslint-disable-line no-param-reassign
  }
  const timeout = options.timeout || config.defaultTimeout;
  const interval = options.interval || 500;

  const startTime = new Date();
  const self = this;
  function exec() {
    function pollF(err, ret) {
      const duration = +new Date() - startTime;
      if (err) {
        cb(err);
      }
      if (ret.value) {
        cb();
      } else {
        if (duration > timeout) {
          /* eslint-disable no-console */
          console.log(timeout);
          console.log(duration);
          /* eslint-enable no-console */

          /* eslint-disable no-param-reassign */
          err = new Error(`waitForCondition timeout of ${timeout} exceeded`);
          cb(err);
          /* eslint-enable no-param-reassign */
        }
        exec();
      }
    }
    const executeArgs = _.flatten([condition, conditionArgs, pollF]);
    return self.pause(interval).execute.apply(self, executeArgs);
  }
  // call exec to set off the recursive waiting
  return exec();
}


/**
 * waitForPaginationComplete
 * performs a busy-wait, while polling for the MICIS pagination system to be ready for interaction.
 * This means that all AJAX requests have completed, and that the page-container has been rendered.
 * @param timeout {number} an (optional) the maximum amount of time to wait (default = 9 seconds)
 * @param cb {function} A callback function supplied by mocha (aka `done`) or by webdriverio
 * Note: this function will be wrapped by webdriverio, and will always be passed a callback
 *   as the last parameter. Since we have optional parameters, we will use the vargs-callback
 *   module to __pad__ the arguments passed to this function (replace missing args with unknowns)
 */
function waitForPaginationComplete(timeout, cb) {
  timeout = timeout || config.defaultTimeout; // eslint-disable-line no-param-reassign
  // function to be executed in browser
  function checkBrowserPaginationComplete() {
    if (window.coinsUtils && window.coinsUtils.seleniumUtils) {
      if (window.coinsUtils.seleniumUtils.testNetworkAndPageReady instanceof Function) {
        return window.coinsUtils.seleniumUtils.testNetworkAndPageReady();
      }
    }
    return false; // not ready yet
  }
  return this.waitForCondition(checkBrowserPaginationComplete, null, { timeout }, cb);
}


/**
 * Waits for element to be visible in DOM (not in screen)
 * @param  {string}   sell    css selector
 * @param  {number}   timeout ms
 * @param  {Function} cb      internally populated by webdriverio. do not use
 * @return {WebDriverIO}
 */
function waitForVis(sell, timeout, cb) {
  timeout = timeout || config.defaultTimeout; // eslint-disable-line no-param-reassign
  // function to be executed in browser
  function testForVis(selector) {
    const el = window.document.querySelector(selector);
    return (el ? el.offsetParent !== null : false);
  }
  return this.waitForCondition(testForVis, sell, { timeout }, cb);
}


// exports;
module.exports = function pagination(client) {
  client.addCommand('waitForCondition', vargscb(waitForCondition));
  client.addCommand('waitForPaginationComplete', vargscb(waitForPaginationComplete));
  client.addCommand('waitForVis', vargscb(waitForVis));
  return client;
};
