'use strict';

module.exports = (client) => {
  const me = {
    new: {
      newUrsis: [],
    },
    enroll: {},
    lookup: {},
  };

  me.new.fillForm = () => {
    client
      .setValue('input[name=FirstName]', 'testFirstName')
      .setValue('input[name=MiddleName]', 'testMiddleName')
      .setValue('input[name=LastName]', 'testLastName')
      .setValue('input[name=Suffix]', 'testSuffix')
      .setValue('input[name=BirthDate]', '10/10/2010')
      .click('#GenderF')
      .setValue('input[name=Line1]', 'testAddressLine1')
      .setValue('input[name=Line2]', 'testAddressLine2')
      .setValue('input[name=City]', 'testCity')
      .selectByVisibleText('select[name=State]', 'AL - Alabama')
      .setValue('input[name=Zip]', 12345)
      .selectByVisibleText('select[name=Country]', 'United States')
      .setValue('#phone1_area_code', 123)
      .setValue('#phone2_area_code', 321)
      .setValue('#phone1_phone_num', 4567890)
      .setValue('#phone1_extension', 1111)
      .setValue('#phone2_extension', 2222)
      .setValue('#Notes', 'testNotes')
      .setValue('#email_address', 'testEmail@mrn.org')
      .selectByValue('#subject_tag_id', 1) // U.S. SSN
      .setValue('#value', 1112223333) // subject tag value
      .click('#context_site') // subject tag context === site
      .moveToObject('#study_id')
      .selectByValue('#study_id', 2319); // NITEST
      /* @todo: if (client.alertText()) {
      client.alertDismiss();
      }*/
    client.waitForVis('#site_id', 8000);
    client.moveToObject('#site_id')
      .selectByValue('#site_id', 7)
      .selectByVisibleText('select[name=ethnicity]', 'Unknown')
      .click('#racCat1')
      .click('#racCat2')
      .click('#racCat3')
      .click('#racCat4')
      .click('#racCat5')
      .moveToObject('#first_name_at_birth')
      // not an RDoC study
      // eslint-disable-line consistent-return
      .setValue('#first_name_at_birth', 'testFirstNameAtBirth')
      .setValue('#middle_name_at_birth', 'testMiddleNameAtBirth')
      .setValue('#last_name_at_birth', 'testLastNameAtBirth')
      .click('#physical_sex_at_birth_f')
      .setValue('#city_born_in', 'testCityBornIn')
      .setValue('#consent_date', '02/22/2015')
      .click('[name=agreestosharedata]') // selects the first matched radio (Yes)
      .click('[name=agrees_to_future_studies]'); // selects the first matched radio (Yes)
  };
  me.new.submit = () => {
    client.pause(1000);
    client.scroll('#submit_new_subject')
      .click('#submit_new_subject')
      .waitForPaginationComplete()
      .pause(100);
    const isExisting = client.isExisting('[value="Add >"]');
    if (!isExisting) {
      throw new Error('Submit new subject did not detect that it made it to the verify page.');
    }
  };

  me.new.verify = () => {
    client.pause(200);
    client.moveToObject('[value="Add >"]')
      .click('[value="Add >"]')
      .waitForPaginationComplete();
  };

  /* eslint-disable no-underscore-dangle */
  me.new._handleSubjectMatchesClick = () => {
    client
      .element('#verify_add_new_subject').scroll();
    //  .pause(1000);
    client
      .click('#verify_add_new_subject')
      .pause(10);
  };

  me.new.handleSubjectMatchesAddNew = () => {
    me.new._handleSubjectMatchesClick();
    const isVisible = client.isVisible('#confirm_new_participant_modal');
    if (isVisible) {
      // test that you can close and reopen
      client
        .click('#confirm_new_subject_declined');
      const isVisible2 = client.isVisible('#confirm_new_subject_declined');
      if (isVisible2) {
        throw new Error('#confirm_new_subject_declined should not be visible');
      }
      client.moveToObject('#verify_add_new_subject')
        .click('#verify_add_new_subject')
        .pause(50);
      client.click('#confirm_new_subject_confirmed');
    }
    client.waitForPaginationComplete();
    client.pause(200);
    const isExisting = client.isExisting('#new_ursi');
    if (!isExisting) {
      throw new Error('Submit verify subject did not detect that it made it to new URSI page.');
    }
    const textParam = client.getText('#new_ursi');
    const text = (textParam || '').trim();
    if (!text || text.charAt(0) !== 'M') {
      throw new Error('Unable to retrieve new URSI value.');
    }
    me.new.newUrsis.push(text);
  };
  /* eslint-enable no-underscore-dangle */
  me.new.handleSubjectMatchesExisting = () => {
    client
      .scroll(0, 0)
      .setValue('.coins-datatable-wrapper input[type=search]', 'testaddressline1')
      .click('//*[@id="datatable-container"]/tbody/tr[1]/td[8]/a')
      .pause(500);

    // Create/Re-use
    if (Date.now() % 2 === 0) {
      client.click('input[type=button][value=\'Reuse URSI\']');
    } else {
      client.click('input[type=button][value=\'Create New URSI\']');
    }

    client.pause(1000);
    client.click('input[type=button][value=Continue]');
  };

  me.enroll.submitExisting = () => {
    client.pause(1000);
    client.moveToObject('#enroll_subject_submit')
      .click('#enroll_subject_submit')
      .waitForPaginationComplete();
    // .scroll('.confirmMsg')
  };

  me.lookup.existing = (ursi) => {
    if (!ursi) {
      throw new Error('subject.lookup.existing expects an ursi');
    }
    client.pause(100);
    return client
      .setValue('input[name=ursi]', ursi)
      .click('[value="Continue >"]')
      .waitForPaginationComplete();
  };

  return me;
};
