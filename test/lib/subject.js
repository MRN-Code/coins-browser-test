"use strict";
var should = require('should');
var _ = require('lodash');
var noop = function(){};

module.exports = function(client, config) {

    var me = {};
    me.newSubject = {};

    me.newSubject.fillForm = function(done) {
        return client.setValue('input[name=FirstName]', 'testFirstName')
            .setValue('input[name=MiddleName]', 'testMiddleName')
            .setValue('input[name=LastName]', 'testLastName')
            .setValue('input[name=Suffix]', 'testSuffix')
            .setValue('input[name=BirthDate]', '10/10/2010')
            .click('#GenderF')
            .selectByVisibleText('select[name=ethnicity]', 'Unknown')
            .click('#racCat1')
            .click('#racCat2')
            .click('#racCat3')
            .click('#racCat4')
            .click('#racCat5')
            .setValue('input[name=Line1]', 'testAddressLine1')
            .setValue('input[name=Line2]', 'testAddressLine2')
            .setValue('input[name=City]', 'testCity')
            .setValue('input[name=max_per_segment]', getStrict(options, 'maxPerSegment'))
            .setValue('input[name=skip_question_text]', getStrict(options, 'skipQuestionText'))
            .selectByVisibleText('select[name=State]', 'AL - Alabama')
            .setValue('input[name=Zip]', 12345)
            .selectByVisibleText('select[name=Country]', 'United States')
            .setValue('#phone1_area_code', 123)
            .setValue('#phone2_area_code', 321)
            .setValue('#phone1_phone_num', 4567890)
            .setValue('#phone2_phone_num', 0987654)
            .setValue('#phone1_extension', 1111)
            .setValue('#phone2_extension', 2222)
            .setValue('#Notes', 'testNotes')
            .setValue('#email_address', 'testEmail@mrn.org')
            .selectByValue('#subject_tag_id', 1) // U.S. SSN
            .setValue('#value', 1112223333) // subject tag value
            .click('#context_site') // subject tag context === site
            .selectByValue('#study_id', 2319) // NITEST
            .waitForVisible('#enroll_study_meta')
            .setValue('#consent_date', '02/22/2015')
            .click('[name=agreestosharedata]') // selects the first matched radio (Yes)
            .click('[name=agrees_to_future_studies]') // selects the first matched radio (Yes)
            // (missing) select site MRN
            .call(done || noop);
    };

    return me;

};
