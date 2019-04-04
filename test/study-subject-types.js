'use strict';

/* global coinsUtils browser*/

/**
 * Study subject types.
 *
 * Test editing subject types on a study-wide level. Step-by-step directions:
 *
 * 1. Log in to MICIS
 * 2. Go to “Studies” > ”List Studies”
 * 3. Search for “NITEST” and select it
 * 4. Click the “Edit Subject Types” button
 * 5. Click the “Edit” button next to the “MK” subject type in the table
 * 6. Change the type’s name and description
 * 7. Click the “Continue >” button
 * 8. Confirm success message
 * 9. Go back to NITEST’s “Edit Subject Types” page
 * 10. Confirm name change in table.
 * 11. Undo edit???
 */

const micis = require('./lib/auth/micis.js')(browser);
const study = require('./lib/study.js')(browser);

const sampleData = browser.options.testData.studySubjectTypes;

/**
 * Target subject type label.
 *
 * This is the subject type 'label' that will be targetted and modified in this
 * test.
 *
 * @const {string}
 */

/**
 * Test subject type values.
 *
 * @type {Object}
 */
const testSubjectType = {
  label: Math.random().toString(),
  description: Math.random().toString(),
};

/**
 * Get subject type edit link selector.
 *
 * @param {string} text
 * @returns {string} XPath selector
 */
function getEditLinkSelector(text) {
  return `//td[text()="${text}"]/../td/a`;
}

/**
 * Find notify item.
 *
 * @param {string} label
 * @returns {(string|undefined)}
 */
function findNotifyItem(label) { // eslint-disable-line consistent-return
  var notifyItem; // eslint-disable-line no-var

  if (
    'notify' in coinsUtils &&
    'queue' in coinsUtils.notify &&
    Array.isArray(coinsUtils.notify.queue)
  ) {
    notifyItem = coinsUtils.notify.queue.find(item => item.body.indexOf(label) > -1);

    if (notifyItem) {
      return notifyItem.body;
    }
  }
}

describe('Edit study subject type', () => {
  /**
   * Description control selector for the 'edit subject type' form.
   *
   * @const {string}
   */
  const descriptionSelector = 'textarea[name=description]';

  /**
   * Label (name) control selector for the 'edit subject type' form.
   *
   * @const {string}
   */
  const labelSelector = 'input[name=label]';

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    study
      .goToView(sampleData.study)
      .waitForPaginationComplete();
  });

  it('should navigate to types list', () => {
    browser
      .click('input[value="Edit Subject Types"]')
      .waitForPaginationComplete();
  });

  it('should edit a subject type', () => {
    const linkSelector = getEditLinkSelector(sampleData.targetSubjectTypeLabel);

    const res = browser
      .click(linkSelector)
      .waitForPaginationComplete()
      .setValue(labelSelector, testSubjectType.label)
      .setValue(descriptionSelector, testSubjectType.description)
      .click('input[type=button][name=DoUpdate]')
      .waitForPaginationComplete()
      .execute(findNotifyItem, testSubjectType.label);
    const text = res.value;
    text.should.match(new RegExp(testSubjectType.label));
  });

  it(
    'should reflect changes in list and form', () => {
      const linkSelector = getEditLinkSelector(testSubjectType.label);

      const text = study
        .goToView(sampleData.study)
        .waitForPaginationComplete()
        .click('input[value="Edit Subject Types"]')
        .waitForPaginationComplete()
        .getText('.box-container .coins-datatable');
      text.should.match(new RegExp(testSubjectType.label));
      const value = browser
        .click(linkSelector)
        .waitForPaginationComplete()
        .getValue(labelSelector);
      value.should.be.equal(testSubjectType.label);
      const description = browser.getValue(descriptionSelector);
      description.should.be.equal(testSubjectType.description);
    }
  );

  it('should reset subject type', () => {
    const res = browser
      .setValue(labelSelector, sampleData.targetSubjectTypeLabel)
      .setValue(descriptionSelector, sampleData.targetSubjectTypeLabel)
      .click('input[type=button][name=DoUpdate]')
      .waitForPaginationComplete()
      .execute(findNotifyItem, sampleData.targetSubjectTypeLabel);
    const text = res.value;
    text.should.match(new RegExp(sampleData.targetSubjectTypeLabel));
  });
});
