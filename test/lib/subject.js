'use strict';

const noop = require('lodash/noop');

module.exports = (client) => {
  const me = {
    new: {
      newUrsis: [],
    },
    enroll: {},
    lookup: {},
  };

  me.new.fillForm = (done) => {
    const callback = done || noop;
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
      .moveToObject('#study_id')
      .selectByValue('#study_id', 2319) // NITEST
      .alertDismiss((err) => {
        if (err) {
          /* eslint-disable no-console */
          console.warn('Study Enrollment limit OK - < 90% full');
          /* eslint-enable no-console */
        }
      })
      .waitForVis('#site_id', 8000)
      .moveToObject('#site_id')
      .selectByValue('#site_id', 7)
      .moveToObject('#first_name_at_birth', (err) => {
        if (err) { // not an RDoC study
          return;
        }

        return client // eslint-disable-line consistent-return
          .setValue('#first_name_at_birth', 'testFirstNameAtBirth')
          .setValue('#middle_name_at_birth', 'testMiddleNameAtBirth')
          .setValue('#last_name_at_birth', 'testLastNameAtBirth')
          .click('#physical_sex_at_birth_f')
          .setValue('#city_born_in', 'testCityBornIn');
      })
      .setValue('#consent_date', '02/22/2015')
      .click('[name=agreestosharedata]') // selects the first matched radio (Yes)
      .click('[name=agrees_to_future_studies]') // selects the first matched radio (Yes)
      .call(callback);
  };

  me.new.submit = (done) => {
    const callback = done || noop;
    return client
      .moveToObject('#submit_new_subject')
      .click('#submit_new_subject')
      .waitForPaginationComplete()
      .pause(100)
      .isExisting('[value="Add >"]', (err, isExisting) => {
        if (!isExisting) {
          throw new Error('Submit new subject did not detect that it made it to the verify page.');
        }
      })
      .call(callback);
  };

  me.new.verify = (done) => {
    const callback = done || noop;
    return client
      .pause(200)
      .moveToObject('[value="Add >"]')
      .click('[value="Add >"]')
      .waitForPaginationComplete()
      .call(callback);
  };

  /* eslint-disable no-underscore-dangle */
  me.new._handleSubjectMatchesClick = (done) => {
  /* eslint-enable no-underscore-dangle */
    const callback = done || noop;
    return client
      .pause(200)
      .moveToObject('#verify_add_new_subject')
      .click('#verify_add_new_subject')
      .pause(10)
      .call(callback);
  };

  me.new.handleSubjectMatchesAddNew = (done) => {
    const callback = done || noop;
    return me.new._handleSubjectMatchesClick() // eslint-disable-line no-underscore-dangle
      .isVisible('#confirm_new_participant_modal', (err, isVisible) => {
        if (isVisible) {
          // test that you can close and reopen
          client
            .click('#confirm_new_subject_declined')
            .isVisible('#confirm_new_subject_declined', (error, visible) => {
              if (visible) {
                throw new Error('#confirm_new_subject_declined should not be visible');
              }
            })
            .moveToObject('#verify_add_new_subject')
            .click('#verify_add_new_subject')
            .pause(50)
            .click('#confirm_new_subject_confirmed');
        }
      })
      .waitForPaginationComplete()
      .pause(200)
      .isExisting('#new_ursi', (err, isExisting) => {
        if (!isExisting) {
          throw new Error('Submit verify subject did not detect that it made it to new URSI page.');
        }
      })
      .getText('#new_ursi', (err, text) => {
        const targetText = (text || '').trim();

        if (!targetText || targetText.charAt(0) !== 'M') {
          throw new Error('Unable to retrieve new URSI value.');
        }

        me.new.newUrsis.push(targetText);
      })
      .call(callback);
  };

  me.enroll.prepExisting = (ursi, done) => {
    if (!ursi) {
      throw new Error('URSI to enroll must be provided');
    }

    const callback = done || noop;

    return client
      .click('[name="ursi"]')
      .setValue('input[name="ursi"]', ursi)
      .selectByValue('[name="study_id"]', 3580)
      .call(callback);
  };

  me.enroll.submitExisting = (done) => {
    const callback = done || noop;

    return client
      .pause(1000)
      .moveToObject('#enroll_subject_submit')
      .click('#enroll_subject_submit')
      .waitForPaginationComplete()
      // .scroll('.confirmMsg')
      .call(callback);
  };

  me.lookup.existing = (ursi, done) => {
    if (!ursi) {
      throw new Error('subject.lookup.existing expects an ursi');
    }

    const callback = done || noop;

    return client
      .pause(100)
      .setValue('input[name=ursi]', ursi)
      .click('[value="Continue >"]')
      .waitForPaginationComplete()
      .call(callback);
  };

  return me;
};
