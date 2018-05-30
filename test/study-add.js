'use strict';

/* globals browser */

/**
 * Test creating a new study.
 *
 * Steps:
 *
 *   1. Navigate to New Study form (MICIS > Studies > Add a Study)
 *   1. Fill out with some sample data
 *   2. Click through to view the saved values
 *   3. Verify values match entered data.
 */

const _ = require('lodash');
const moment = require('moment');
const config = require('config');
const nav = require('./lib/nav/navigation')(browser, config);
const micis = require('./lib/auth/micis')(browser);


/**
 * Set up sample data. This should be unique every time the test is run through
 * the use of random numbers.
 */
const sampleSlug = _.random(1e6, 1e7 - 1);
const sampleData = {
  label: `test_${sampleSlug}`,
  title: `Test Study: ${sampleSlug}`,
  archiveDirectory: `test_dir_${sampleSlug}`,
  pi: 'Calhoun, Vince',
  coInvestigator: 'Turner, Jessica',
  sideId: 'Mind Research Network',
  email: 'coins-notifier@mrn.org',
  irbNumber: `${_.random(10, 99)}-${_.random(100, 999)}`,
  internalStudyNumber: `${_.random(10, 99)}-${_.random(100, 999)}`,
  approvalDate: moment().format('MM/DD/YYYY'),
  expirationDate: moment().add(365, 'days').format('MM/DD/YYYY'),
  maxEnrollment: _.random(100, 999),
  studySharing: 'No',
  sponsor: _.random(100, 999),
  grantNumber: _.random(100, 999),
  urlReference: 'http://www.mrn.org',
  urlDescription: _.random(1e9, 1e10 - 1),
  status: 'Active',
  defaultRadiologist: 'Charles Pluto',
  primaryResearchArea: 'Creativity',
  secondaryResearchArea: 'PTSD',
  description: _.random(1e9, 1e10 - 1),
  cssUrl: 'http://www.mrn.org/_ui/css/style.css',
};

describe('Add a new study', function studyAdd() {
  this.timeout(config.defaultTimeout);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Add New Study');
  });
  /**
   * Confirm the form exists (step #1).
   */
  it('should show a new study form', () => {
    browser.element('form#frmAdd').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  /**
   * Fill out the form using `sampleData` (step #2).
   */
  it('should accept new study values', () => {
    browser
      .setValue('input[name=label]', sampleData.label)
      .setValue('input[name=hrrc_title]', sampleData.title)
      .setValue('input[name=study_dir_name]', sampleData.archiveDirectory)
      .click('//*[@id="frmAdd"]/table[1]/tbody/tr[6]/td[2]/input')
      .click('//*[@id="frmAdd"]/table[1]/tbody/tr[7]/td[2]/input')
      .selectByVisibleText('select[name=pi_id]', sampleData.pi)
      .selectByVisibleText('select[name=co_pi_id]', sampleData.coInvestigator)
      .selectByVisibleText('select[name=site_id]', sampleData.sideId)
      .setValue('input[name=rad_review_emails]', sampleData.email)
      .setValue('input[name=irb_number]', sampleData.irbNumber)
      .setValue('input[name=hrrc_num]', sampleData.internalStudyNumber)
      .setValue('input[name=hrrc_consent_date]', sampleData.approvalDate)
      .setValue('input[name=expiration_date]', sampleData.expirationDate)
      .setValue('input[name=max_enrollment]', sampleData.maxEnrollment)
      .selectByVisibleText('select[name=reuse_ursi]', sampleData.studySharing)
      .setValue('input[name=exp_warn_emails]', sampleData.email)
      .setValue('input[name=share_inst_emails]', sampleData.email)
      .setValue('input[name=sponsor]', sampleData.sponsor)
      .setValue('input[name=grant_number]', sampleData.grantNumber)
      .setValue('input[name=url_reference]', sampleData.urlReference)
      .setValue('input[name=url_description]', sampleData.urlDescription)
      .selectByVisibleText('select[name=status_id]', sampleData.status)
      .selectByVisibleText('select[name=default_radiologist]', sampleData.defaultRadiologist)
      .selectByVisibleText('select[name=PrimaryResearchStudyArea_id]', sampleData.primaryResearchArea)
      .selectByVisibleText('select[name=SecondaryResearchStudyArea_id]', sampleData.secondaryResearchArea)
      .setValue('textarea[name=description]', sampleData.description)
      .setValue('input[name=study_css_url]', sampleData.cssUrl);
  });

  /**
   * Click through to save the new study (step #3).
   */
  it('should save new study', () => {
    browser
      .element('input[name=DoAdd]')
      .scroll()
      .click('input[name=DoAdd]')
      .waitForPaginationComplete()
      .waitForExist('.confirmMsg', 1500);
    const res = browser.getText('.confirmMsg');
    /**
     * A 'study saved' view is served with a confirmation message.
     * Check the message's text to make sure it contains the
     * sample data's label value.
     */
    const pattern = new RegExp(`${sampleData.label} successfully added`, 'i');
    res.should.match(pattern);

    browser.click('=View Study Details')
      .waitForPaginationComplete();
  });

  /**
   * Verify the new study's values were saved (step #4).
   */
  it('should display correct study values', () => {
    /**
     * Associate the form's labels to the data they should match.
     *
     * The view study page contains a very large table with all the study's
     * saved data. This data structure matches the table's labels (`label`)
     * to the text values they should match (`match`).
     */
    const labelMatches = [{
      label: 'Study Name:',
      match: sampleData.label,
    }, {
      label: 'IRB Study Title (formal title):',
      match: sampleData.title,
    }, {
      label: 'Study Archive Directory:',
      match: sampleData.archiveDirectory,
    }, {
      label: 'Principal Investigator:',
      match: sampleData.pi.split(', ').reverse().join(' '),
    }, {
      label: 'Co-Investigator:',
      match: sampleData.coInvestigator.split(', ').reverse().join(' '),
    }, {
      label: 'Site:',
      match: sampleData.sideId,
    }, {
      label: 'IRB Number:',
      match: sampleData.irbNumber,
    }, {
      label: 'Internal Study Number:',
      match: sampleData.internalStudyNumber,
    }, {
      label: 'IRB Consent Date:',
      match: sampleData.approvalDate,
    }, {
      label: 'Expiration Date:',
      match: sampleData.expirationDate,
    }, {
      label: 'Approved Number of Participants:',
      match: sampleData.maxEnrollment,
    }, {
      label: 'Allows URSI Sharing:',
      match: sampleData.studySharing,
    }, {
      label: 'Sponsor:',
      match: sampleData.sponsor,
    }, {
      label: 'Grant Number:',
      match: sampleData.grantNumber,
    }, {
      label: 'URL Reference:',
      match: sampleData.urlReference,
    }, {
      label: 'URL Description:',
      match: sampleData.urlDescription,
    }, {
      label: 'Status:',
      match: sampleData.status,
    }, {
      label: 'Default Radiologist:',
      match: sampleData.defaultRadiologist,
    }, {
      label: 'Primary Research Area:',
      match: sampleData.primaryResearchArea,
    }, {
      label: 'Secondary Research Area:',
      match: sampleData.secondaryResearchArea,
    }, {
      label: 'Comments/Notes:',
      match: sampleData.description,
    }, {
      label: 'Study CSS URL:',
      match: sampleData.cssUrl,
    }];

    /**
     * Wait for the study data table to show up.
     *
     * @{@link  http://webdriver.io/api/utility/waitForExist.html}
     */
    browser.waitForExist('.box-container > table:nth-of-type(2)', 1500, false);
    /**
     * Iterate over the table's labels and ensure their values are
     * correct.
     */
    labelMatches.forEach((item) => {
      const res = browser.getText(`//tr/td[text()="${item.label}"]/following-sibling::td[1]`);
      res.should.match(new RegExp(item.match, 'i'));
    });
  });
});
