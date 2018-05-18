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
 */
function waitForCondition(condition, conditionArgs, options) {
  options = options || {}; // eslint-disable-line no-param-reassign
  if (!_.isArray(conditionArgs)) {
    conditionArgs = [conditionArgs]; // eslint-disable-line no-param-reassign
  }
  const self = this;
  const timeout = options.timeout || 3000; // config.defaultTimeout;
  const interval = options.interval || 500;
  const executeArgs = _.flatten([condition, conditionArgs]);
  // call exec to set off the recursive waiting
  self.waitUntil(() => {
    const res = self.execute.apply(self, executeArgs); // eslint-disable-line prefer-spread
    return res.value === true;
  }, timeout, 'Error waiting for condition', interval);
  return self;
}


/**
 * waitForPaginationComplete
 * performs a busy-wait, while polling for the MICIS pagination system to be ready for interaction.
 * This means that all AJAX requests have completed, and that the page-container has been rendered.
 * @param timeout {number} an (optional) the maximum amount of time to wait (default = 9 seconds)
 */
function waitForPaginationComplete(timeout) {
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
  return this.waitForCondition(checkBrowserPaginationComplete, null, {
    timeout,
  });
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
  this.waitForCondition(testForVis, sell, {
    timeout,
  }, cb);
}
/** Selenium issue:getText fails because of many parallel connections.
 * https://github.com/webdriverio/webdriverio/issues/2406
 * should use this func where getText() fails with server excepetion
 * @param {string} selector  css selectors
 * @return {string}  text
 */
function customGetText(selector) {
  const {
    value: elements,
  } = this.elements(selector);
  if (elements.length === 1) return (this.elementIdText(elements[0].ELEMENT)).value;
  const text = [];
  _.forEach(elements, (elem) => {
    text.push((this.elementIdText(elem.ELEMENT)).value);
  });
  return text;
}

// exports;
module.exports = function pagination(client) {
  client.addCommand('waitForCondition', vargscb(waitForCondition));
  client.addCommand('waitForPaginationComplete', vargscb(waitForPaginationComplete));
  client.addCommand('waitForVis', vargscb(waitForVis));
  client.addCommand('customGetText', vargscb(customGetText));
  return client;
};
