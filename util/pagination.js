var vargscb = require('vargs-callback');
var config = require('config');
var _ = require('lodash');

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
var waitForCondition = function(condition, conditionArgs, options, cb) {
    //locate callback (always last param)
    if (!_.isArray(conditionArgs)) {
        conditionArgs = [conditionArgs];
    }
    options = options || {};
    var timeout = options.timeout || config.defaultTimeout;
    var interval = options.interval || 500;

    var startTime = new Date();
    var self = this;
    var exec = function() {
        var executeArgs;
        var pollF = function(err, ret) {
            var duration = +new Date() - startTime;
            if (err) {
                cb(err);
            }
            if (ret.value) {
                cb();
            } else {
                if (duration > timeout) {
                    console.log(timeout);
                    console.log(duration);

                    err = new Error('waitForCondition timeout of ' + timeout + ' exceeded');
                    cb(err);
                    return;
                }
                return exec();
            }
        };
        executeArgs = _.flatten([condition, conditionArgs, pollF]);
        return self.pause(interval).execute.apply(self, executeArgs);
    };
    // call exec to set off the recursive waiting
    return exec();
};


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
var waitForPaginationComplete = function(timeout, cb) {
    timeout = timeout || config.defaultTimeout;
    // function to be executed in browser
    var checkBrowserPaginationComplete = function() {
        if (window.coinsUtils && window.coinsUtils.seleniumUtils) {
            if (window.coinsUtils.seleniumUtils.testNetworkAndPageReady instanceof Function) {
                return window.coinsUtils.seleniumUtils.testNetworkAndPageReady();
            }
        }
        return false; //not ready yet
    };
    return this.waitForCondition(checkBrowserPaginationComplete, null, {timeout: timeout}, cb);
};




var waitForVis = function(sell, timeout, cb) {
    timeout = timeout || config.defaultTimeout;
    // function to be executed in browser
    var testForVis = function(sell) {
        var el = window.document.querySelector(sell);
        return (el.offsetParent !== null);
    };
    return this.waitForCondition(testForVis, sell, {timeout: timeout}, cb);
};

// exports;
module.exports = function(client) {
    client.addCommand('waitForCondition', vargscb(waitForCondition));
    client.addCommand('waitForPaginationComplete', vargscb(waitForPaginationComplete));
    client.addCommand('waitForVis', vargscb(waitForVis));
    return client;
};
