
// broken selector, seeking clarity from:
// https://github.com/webdriverio/webdriverio/issues/389
"use strict";
var config = require('config');
var should = require('should');
var Nav = require('coins/util/navigator.js');
var webdriverio = require('webdriverio');
var wdOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var nav = new Nav({wdOptions: wdOptions});

describe('do something else after logon', function() {
    var block = this;
    this.timeoutDur = 15000;
    this.timeout(this.timeoutDur);
    var client = {};

    before(function(){
    });

    it('should logon and other stuff', function(done) {
        nav.client
            .url('https://' + config.origin + '/micis/index.php')
            .setValue('#loginPopupUsername', config.auth.un)
            .setValue('#loginPopupPassword', config.auth.pw)
            .click('#submitBtn')
            .waitFor('#nav_anchor_ADMIN', 8000)
            .moveToObject('#nav_anchor_ADMIN')
            .waitFor('[title="List and add sites"]', 1000)
            // .click('[title="List and add sites"]') TODO WHY IS THIS ITEM NOT SHOWN NOW?
            .getUrlAndTitle('a custom variable',function(err,result){})
            .end(done);
    });

});
