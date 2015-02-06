"use strict";
// test deps
var should = require('should');
var _ = require('lodash');

var getStrict = function(obj, key) {
    if (obj[key] === undefined) {
        throw new Error('Expected options.' + key + ' to be set');
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
    var me = {};
    
    me.create = function(options, done) {
        return client
            .setValue('input[name=label]', getStrict(options, 'label'))
            .setValue('input[name=salabel]', getStrict(options, 'saLabel'))
            .setValue('input[name=description]', getStrict(options, 'description'))
            .setValue('input[name=cr_notice]', getStrict(options, 'crNotice'))
            .setValue('input[name=version]', getStrict(options, 'version'))
            .setValue('input[name=max_per_segment]', getStrict(options, 'maxPerSegment'))
            .setValue('input[name=skip_question_text]', getStrict(options, 'skipQuestionText'))
            .click('input.frmButton')
            .waitForPaginationComplete(done);
    };

    me.edit = function(options, done) {
        _.forEach(options, function(option, key) {
            var field = getFormField(key);
            client[field.action]('[name=' + field.name + ']', option);
        });
        
        return client
            .click('input.frmButton')
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
