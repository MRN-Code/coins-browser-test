"use strict";

// exports
module.exports = function(client, config) {
    var me = {};

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
