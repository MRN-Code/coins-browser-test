var Vargscallback = require('vargs-callback');

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
var waitForCondition = function(condition, options, cb) {
    //locate callback (always last param)
    options = options || {};
    var timeout = options.timeout || 9000;
    var interval = options.interval || 500;
    
    var startTime = new Date();
    var self = this;
    var exec = function() {
        return self.pause(interval)
        .execute(condition,
            function(err, ret) {
                var duration = +new Date() - startTime;
                var err;
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
            }
        );
    };
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
var waitForPaginationComplete = function(timeout, cb) {
    timeout = timeout || 9000;
    // function to be executed in browser
    var checkBrowserPaginationComplete = function() {
        if (window.coinsUtils && window.coinsUtils.seleniumUtils) {
            if (window.coinsUtils.seleniumUtils.testNetworkAndPageReady instanceof Function) {
                return window.coinsUtils.seleniumUtils.testNetworkAndPageReady();
            } 
        } 
        return false; //not ready yet
    };
    return this.waitForCondition(checkBrowserPaginationComplete, {timeout: timeout}, cb);
};

// exports;
module.exports = function(client) {
    client.addCommand('waitForCondition', Vargscallback(waitForCondition));
    client.addCommand('waitForPaginationComplete', Vargscallback(waitForPaginationComplete));
    return client;
};
