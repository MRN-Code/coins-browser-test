"use strict";
// test deps
var should = require('should');
var _ = require('lodash');

var getStrict = function(obj, key) {
    if (obj[key] === undefined) {
        throw new Error('Expected option `' + key + '` to be set');
    }
    return obj[key];
};

var getFormField = function(key) {
    var exceptions = {
        saLabel: 'salabel'
    };
    var actions = {
        hideSaPrevious: 'selectByValue',
        saHideSkippedQuestions: 'selectByValue',
        lock: 'selectByValue',
        _default: 'setValue'
    }
    return {
        name: exceptions[key] || _.snakeCase(key),
        action: actions[key] || actions._default
    };
};

// exports
module.exports = function(client, config) {
    var me = {instrumentId:undefined};

    me.filterList = function(query, done) {
        var selector = '#instrument_grid_filter input[type=search]';
        return client.setValue(selector, query, done);
    };

    me.setInstrumentIdFromPage = function(done) {
        var selector = '[name=instrument_id]';
        return client.getValue(selector, function(err, val) {
            if (err) {
                throw err;
            }
            me.instrumentId = val;
            done();
        });
    };

    me.toggleLockFromList = function(instrumentId, done) {
        var selector = '[data-instrument_id="' + instrumentId + '"] input.locked-unlocked';
        var lockState, expectedState;
        var expectedStateMap = {
            'lock': 'unlock',
            'unlock': 'lock'
        };
        var setLockState = function(err, val) {
            if (!err) {
                lockState = val;
                expectedState = expectedStateMap[val];
            } else {
                throw err;
            }
        };
        return client.getValue(selector, setLockState)
            .click(selector)
            .waitForPaginationComplete()
            .getValue(selector, function(err, val) {
                if(err) {
                    throw err;
                }
                val.should.be.eql(expectedState);
                done();
            });
    };

    me.gotoEditFromList = function(instrumentId, done) {
        var selector = '[data-instrument_id="' + instrumentId + '"] a.pvedit';
        return client.click(selector)
            .waitForPaginationComplete(done);
    };

    me.gotoSection = function(sectionLabel, done) {
        var navSelector = '#asmtPageNav';
        var xPathNavSelector = '//*[@id="asmtPageNav"]';
        var xPathSelector = xPathNavSelector + '//li[normalize-space(.) = "' + sectionLabel + '"]';

        return client.moveToObject(xPathNavSelector, 80, 10)
            .click(xPathSelector, done);
    };


    me.create = function(options, done) {
        return client
            .setValue('input[name=label]', getStrict(options, 'label'))
            .setValue('input[name=salabel]', getStrict(options, 'saLabel'))
            .setValue('input[name=description]', getStrict(options, 'description'))
            .setValue('input[name=cr_notice]', getStrict(options, 'crNotice'))
            .setValue('input[name=version]', getStrict(options, 'version'))
            .setValue('input[name=max_per_segment]', getStrict(options, 'maxPerSegment'))
            .setValue('input[name=skip_question_text]', getStrict(options, 'skipQuestionText'))
            .click('button[id=add_instrument]')
            .waitForPaginationComplete(done);
    };

    me.edit = function(options, done) {
        _.forEach(options, function(option, key) {
            var field = getFormField(key);
            client[field.action]('[name=' + field.name + ']', option);
        });

        return client
            .click('button[id=update_instrument]')
            .waitForPaginationComplete(done);
    };

    me.fromHtml = function(callback) {
        var options = {};
        var callbackWrapper = function() {
            callback(null, options);
        };
        client
            .getValue('input[name=label]', function(err, val) { options.label = val; })
            .getValue('input[name=salabel]', function(err, val) { options.saLabel = val; })
            .getValue('input[name=description]', function(err, val) { options.description = val; })
            .getValue('input[name=cr_notice]', function(err, val) { options.crNotice = val; })
            .getValue('input[name=version]', function(err, val) { options.version = val; })
            .getValue('input[name=max_per_segment]', function(err, val) { options.maxPerSegment = val; })
            .getValue('input[name=skip_question_text]', function(err, val) { options.skipQuestionText = val; })
            .getValue('select[name=hide_sa_previous]', function(err, val) { options.hideSaPrevious = val; })
            .getValue('select[name=sa_hide_skipped_questions]', function(err, val) { options.saHideSkippedQuestions = val; })
            .getValue('select[name=lock]', function(err, val) { options.lock = val; })
            .call(callbackWrapper);
    };

    return me;
};
