var Vargs= require('vargs').Constructor;

/**
 * Pagination Utilities
 * This module adds commands to the webdriver.io client to aid in dealing with COINS pagination
 * @param client {WebdriverioClient} a webdriverio client to add the helpers to
 */
module.exports = function(client) {
    /**
     * waitForCondition
     * performs a busy-wait, while polling for a condition to return true in the browser
     * @param condition {string|Function} required. a string or function to be executed in the browser.
     *   This function will be recursively executed until it returns true, or until timeout
     * @param options {object} an (optional) object containing properties for timeout and interval:
     *   options.interval = the amount of time to wait between polling (default 500ms)
     *   options.timeout = the maximum amount of time to wait
     * Note: this function will be wrapped by webdriverio, and will always be passed a callback
     *   as the last parameter. We use the `vargs` library to extract that callback even though it is
     *   not in the function signature.
     */
    client.addCommand('waitForCondition', function(condition, options) {
        //locate callback (always last param)
        var args = new Vargs(arguments); 
        cb = args.callback;

        options = args.all[1] || {};
        var timeout = options.timeout || 9000;
        var interval = options.interval || 500;
        
        var callcb = function(err, val) {
            if (typeof cb === 'function') {
                console.log('calling cb');
                cb(err, val);
                return;
            }
            if (err instanceof Error) {
                throw err;
            }
            return;
        };
        var startTime = new Date();
        var self = this;
        var count = 0;
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
    });

    /**
     * waitForPaginationComplete
     * performs a busy-wait, while polling for the MICIS pagination system to be ready for interaction.
     * This means that all AJAX requests have completed, and that the page-container has been rendered.
     * @param timeout {number} an (optional) the maximum amount of time to wait (default = 9 seconds)
     * Note: this function will be wrapped by webdriverio, and will always be passed a callback
     *   as the last parameter. We use the `vargs` library to extract that callback even though it is
     *   not in the function signature.
     */
    client.addCommand('waitForPaginationComplete', function(timeout) {
        var args = new Vargs(arguments);
        cb = args.callback;
        timeout = args.all[0] || 9000;
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
    });

    return client;
};
