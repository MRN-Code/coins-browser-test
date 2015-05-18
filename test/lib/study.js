"use strict";
var _ = require('lodash');
var noop = function(){};

module.exports = function(client, config) {
    var nav = require('./nav/navigation.js')(client, config);

    var me = {
        list: {},
        view: {}
    };

    me.goToView = function(name) {
        nav.micisMenu
            .clickNested('List Studies');
        return me.list.selectByName(name);
    };

    /**
     * Simulates navigating through the list studies page and clicking
     * the study that verbatim matches the provided name
     * @param  {string} name
     * @return {WebdriverIO} client
     */
    me.list.selectByName = function(name) {
        return client
            .moveToObject('#study_list_filter input[type=search]')
            .click('#study_list_filter input[type=search]')
            .setValue('#study_list_filter input[type=search]', name)
            .waitForText('=' + name)
            .click('=' + name)
            .waitForPaginationComplete();
    };

    me.view.subjects = function() {
        return client
            .click('[data-hook=view-subjects-btn]')
            .waitForPaginationComplete();
    };

    me.view.subjectDetails = function(ursi) {
        return client
            .click('//*[contains(text(), "' + ursi + '")]//..//*[contains(text(), "View")]')
            .waitForPaginationComplete();
    };

    me.view.subjectDetails.addTag = function(text, type, context) {
        client
            .click('=Subject Tags')
            .waitForPaginationComplete();
        return client.selectByVisibleText('#addextFrm select[name=subject_tag_id]', type)
            .setValue('#addextFrm [name=value]', text)
            .click('#addextFrm #context_' + context)
            .click('#addextFrm [name="doAdd"]')
            .waitForPaginationComplete();
    };

    return me;

};
