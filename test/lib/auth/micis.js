'use strict';
// test deps
var vargscb = require('vargs-callback');
var config = require('config');
var client = require('../client.js').client;
var noop = function(){};

// exports
/**
 * Browser actions for authenticating with MICIS
 * @param client {webdriverioClient} The browser client to perform actions on
 */
module.exports = function(client) {

    var me = {
        loggedOn: false
    };

    /**
     * log out of COINS
     * @param done {function} a mochajs function to call when login is successful
     */
    me.logout = function(done) {
        return client.url('https://' + config.origin + '/micis/logout.php');
    };

    /**
     * log onto COINS
     * @param url {string} The string to navigate to (should redirect to a CAS login page).
     * @param done {function} a mochajs function to call when login is successful
     */
    me.logon = vargscb(function(url, done) {
        done = done || noop;
        //set default params
        url = url || 'https://' + config.origin + '/micis/index.php';
        return client
            .url(url)
            .waitFor('#loginPopupUsername')
            .setValue('#loginPopupUsername', config.auth.un)
            .setValue('#loginPopupPassword', config.auth.pw)
            .click('input.submit') //TODO: update to use data-selector instead
            .waitForPaginationComplete()
            .getCookie('MICIS', function(err, cookie) {
                if (cookie) {
                    me.loggedOn = cookie;
                }
            })
            .call(done); //TODO: update to be compatible with portals as well

    });

    return me;
};
