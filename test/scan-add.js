'use strict';

/* globals browser */

/**
 * Test Add Scan Session.
 *
 * Steps:
 *
 *   1. Navigate to Add Scan form (MICIS > Studies > Add Scan Session)
 *   1. Fill out with some sample data
 *   2. Click through to view the saved values
 *   3. Verify values match entered data.
 */

const nav = require('./lib/nav/navigation')(browser);
const micis = require('./lib/auth/micis')(browser);

const sampleData = browser.options.testData.scanAdd.sampleData;

describe('Add Scan Session', () => {
  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.micisMenu.clickNested('Add Scan Session');
  });
  /**
   * Confirm the form exists (step #1).
   */
  it('should show a new scan form', () => {
    browser.element('form#frmAdd').should.be.ok;// eslint-disable-line no-unused-expressions
  });
  /**
   * Fill out the form using `sampleData` (step #2).
   */
  it('should accept new scan values', () => {
    browser
      .setValue('#frmAdd input[name=ursi]', sampleData.ursi)
      .setValue('#frmAdd input[name=scan_date]', sampleData.scanDateTime)
      .setValue('#frmAdd input[name=study_dir_name]', sampleData.archiveDirectory)
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
  it('should save the scan', () => {

  });

  /**
   * Verify the new study's values were saved (step #4).
   */
  it('should display correct scan values', () => {

  });
});
