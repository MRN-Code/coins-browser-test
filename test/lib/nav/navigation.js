"use strict";

// exports
module.exports = function(client, config) {
    var me = {};

    // disable COINS navigation alerts when changing pages
    me.disableNavigationAlert = function() {
        return client.execute(function _disableNavigationAlert() {
            if (window.preventExitPopup === undefined) {
                window.alert('EXPECTED `preventExitPopup` set in pagination.js');
            }
            window.preventExitPopup = true;
        });
    };

    me.micisMenu = require('./micisMenu.js')(client, config);
    me.asmtMenu = require('./asmtMenu.js')(client, config);

    me.hoverHome = function(done) {
        return client.moveToObject('.navUl>li>font>.homeLi', done);
    };

    me.gotoAsmt = function(done) {
        return client
            .call(me.hoverHome)
            .click('=ASMT')
            .waitForPaginationComplete(done);
    };

    me.selectAsmtStudy = function(studyId, done) {
        return client
            .waitForPaginationComplete()
            .selectByValue('#asmt_study_id', studyId)
            .waitForPaginationComplete(done);
    };

    return me;
};
