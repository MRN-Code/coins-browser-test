"use strict";
/**
 * available section options object properties:
 *   label: {string}
 *   desc: {string}
 *   saLabel: {string}
 *   saDesc: {string}
 *   saQuestionsPerPage: {string}
 *   tableType: {undefined}
 *   multiInstGrid: {undefined}
 *   likertGrid: {undefined}
 *   noGrid: {undefined}
 * The last four are mutually exclusive (only one may be specified). If more than one is specified, the last one specified will be used.
 */
// test deps

var should = require('should');
var _ = require('lodash');

var getFormField = function(key) {
    var exceptions = {};
    var actions = {
        noGrid: 'click',
        likertGrid: 'click',
        tableType: 'click',
        multiInstGrid: 'click',
        _default: 'setValue'
    }
    return {
        id: exceptions[key] || _.snakeCase(key),
        selector: '#' + (exceptions[key] || _.snakeCase(key)),
        action: actions[key] || actions._default
    };
};

// exports
module.exports = function(client, config) {
    var me = {};
    var formSelector = '#instrument_add_edit_new_section';

    me.openSectionEditor = function(done) {
        var selector = 'div.simLink[title="Edit Section Sort Order"]';
        return client.click(selector)
            .waitForPaginationComplete()
            .pause(1000)
            .isVisible(formSelector, done);
    }
    me.create = function(options, done) {
        var setValues = function() {
            _.forEach(options, function(option, key) {
                var field = getFormField(key);
                client[field.action](field.selector, option);
            });
            return client;
        }
        return client
            .call(setValues)
            .click('#addSectionIcon')
            .waitForPaginationComplete()
            .waitForVis(formSelector, 2, done);
    };
    me.closeSectionEditor = function(done) {
        return client.click('.tclose')
            .waitForPaginationComplete(done);
    };

    return me;
};
