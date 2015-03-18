"use strict";
var should = require('should');
var _ = require('lodash');
var noop = function(){};

module.exports = function(client, config) {

    var me = {
        new: {
            newUrsis: []
        },
        enroll: {}
    };

    me.new.fillForm = function(done) {
        done = done || noop;
        return client
            .setValue('input[name=FirstName]', 'testFirstName')
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
            .selectByVisibleText('select[name=State]', 'AL - Alabama')
            .setValue('input[name=Zip]', 12345)
            .selectByVisibleText('select[name=Country]', 'United States')
            .setValue('#phone1_area_code', 123)
            .setValue('#phone2_area_code', 321)
            .setValue('#phone1_phone_num', 4567890)
            .setValue('#phone2_phone_num', 9876543)
            .setValue('#phone1_extension', 1111)
            .setValue('#phone2_extension', 2222)
            .setValue('#Notes', 'testNotes')
            .setValue('#email_address', 'testEmail@mrn.org')
            .selectByValue('#subject_tag_id', 1) // U.S. SSN
            .setValue('#value', 1112223333) // subject tag value
            .click('#context_site') // subject tag context === site
            .scroll('#study_id')
            .selectByValue('#study_id', 2319) // NITEST
            .alertDismiss(function(err, dismissed) {
                if (err) { console.log("Study Enrollment limit OK - < 90% full"); }
            })
            .waitForVis('#site_id', 8000)
            .scroll('#site_id')
            .selectByValue('#site_id', 7)
            .setValue('#consent_date', '02/22/2015')
            .click('[name=agreestosharedata]') // selects the first matched radio (Yes)
            .click('[name=agrees_to_future_studies]') // selects the first matched radio (Yes)
            .call(done);
    };

    me.new.submit = function(done) {
        done = done || noop;
        return client
            .scroll('#submit_new_subject')
            .click('#submit_new_subject')
            .waitForPaginationComplete()
            .pause(100)
            .isExisting('[value="Add >"]', function(err, isExisting) {
                if (!isExisting) {
                    throw new Error("Submit new subject did not detect that it made it to the verify page.");
                }
            })
            .call(done);
    };

    me.new.verify = function(done) {
        done = done || noop;
        return client
            .click('[value="Add >"]')
            .waitForPaginationComplete()
            .call(done);
    };

    me.new._handleSubjectMatchesClick = function(done) {
        done = done || noop;
        return client
            .scroll('#verify_add_new_subject')
            .click('#verify_add_new_subject')
            .pause(10)
            .call(done);
    };

    me.new.handleSubjectMatchesAddNew = function(done) {
        done = done || noop;
        return me.new._handleSubjectMatchesClick()
            // determine if awful black modal popped up
            .isVisible('#confirm_new_subject_confirmed', function(err, isVisible) {
                if (isVisible) {
                    // test that you can close and reopen
                    client
                        .click('#confirm_new_subject_declined')
                        .isVisible('#confirm_new_subject_declined', function(err, isVisible) {
                            if (isVisible) { throw new Error('#confirm_new_subject_declined should not be visible'); }
                        })
                        .click('#verify_add_new_subject')
                        .pause(50)
                        .click('#confirm_new_subject_confirmed');
                } else {
                     console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");console.log("NO CONFIRM OVERLAY HAPPPENED");
                }
            })
            .waitForPaginationComplete()
            .isExisting('#new_ursi', function(err, isExisting) {
                if (!isExisting) {
                    throw new Error("Submit verify subject did not detect that it made it to new URSI page.");
                }
            })
            .getText('#new_ursi', function(err, text) {
                me.new.newUrsis[text.trim()] = null;
            })
            .call(done);
    };


    me.enroll.prepExisting = function(ursi, done) {
        if (!ursi) {
            throw new Error('URSI to enroll must be provided');
        }
        done = done || noop;
        return client
            .click('[name="ursi"]')
            .setValue('input[name="ursi"]', ursi)
            .selectByValue('[name="study_id"]', 3580)
            .call(done);
    };

    me.enroll.submitExisting = function(done) {
        done = done || noop;
        return client
            .pause(1000)
            .scroll('#enroll_subject_submit')
            .click('#enroll_subject_submit')
            .waitForPaginationComplete()
            // .scroll('.confirmMsg')
            .call(done);
    };

    return me;

};
