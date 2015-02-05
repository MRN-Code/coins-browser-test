"use strict";
// test deps
var should = require('should');

// test
var timeoutDur = 95000;

// exports
module.exports = function(client, config) {
    var me = {};

    me.hoverHome = function(done) {
        return client.moveToObject('.navUl>li>font>.homeLi', done);
    };

    me.gotoAsmt = function(done) {
        return client
            .waitForPaginationComplete()
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
