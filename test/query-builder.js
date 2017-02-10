/**
 * Test Query builder.
 */

'use strict';

const _ = require('lodash');
const config = require('config');
const client = require('./lib/client').client;
const nav = require('./lib/nav/navigation')(client, config);
const micis = require('./lib/auth/micis')(client);
const should = require('should');

const sampleStudyId = '(MRN) VCALHOUN: [99-998] NITEST';
const sampleUrsis = ['M87120826', 'M87128533', 'M87100451', 'M87159685',
  'M87181629', 'M53742922', 'M53790706', 'M53771006', 'M53739226',
  'M53749098', 'M53708287', 'M53711867', 'M87168375'];

/**
 * Set up a query.
 *
 * This manages fields in the "Select subjects" form section.
 *
 * @param  {function} callback
 * @param  {object}   options
 * @return {object}
 */
function setupQuery(options, callback) {
  const defaults = {
    studyId: sampleStudyId,
    subjectTagType: '',
    subjectTags: [],
    subjectType: '',
    ursis: [],
  };
  let localCallback;
  let localOptions;

  /**
   * Sometimes the `options` argument is the callback.
   *
   * @todo  Figure out a better lodash-y way to handle.
   */
  if (options instanceof Function) {
    localCallback = options;
    localOptions = {};
  } else if (!(callback instanceof Function)) {
    localCallback = _.noop;
  }

  localOptions = _.extend(defaults, localOptions);

  if (
    localOptions.ursis.length ||
    (localOptions.subjectTags.length && localOptions.subjectTagType)
  ) {
    /**
     * Click "Subjects appear in list" checkbox. This results in 2
     * sub-options: direct URSI entry or "Subject Tags" selection.
     */
    client
      .scroll(0, 0)
      .click('#optListOfSubjects')
      .waitForVis('#ursiListDiv');

    if (localOptions.ursis.length) {
      /** Option 1: direct URSI entry */
      client
        .click('#subject_list_type_ursi')
        .setValue('#subjectListInput', localOptions.ursis.join(' '));
    } else {
      /** Option 2: subject tags */
      client
        .click('#subject_list_type_tag')
        .waitForVisible('#subject_list_tag_details')
        .selectByVisibleText(
          '#subject_list_tag_study_id',
          localOptions.studyId
        )
        .selectByVisibleText(
          '#subject_list_tag_id',
          localOptions.subjectTagType
        )
        .setValue('#subjectListInput', localOptions.subjectTags.join(' '));
    }

    /** Click out of the text field to trigger the URSI query */
    client.click('#ursiListDiv fieldset');
  } else if (localOptions.subjectType) {
    /**
     * Click "Subjects by subject type", select a study and subject type.
     */
    client
      .click('#subjectTypeCheckbox')
      .selectByVisibleText(
        '#subjectTypeStudySelectBox',
        localOptions.studyId
      )
      .waitForVis('#selectTypeDiv')
      .selectByVisibleText(
        '#subjectTypeSelectBox',
        localOptions.subjectType
      );
  } else {
    /**
     * Click "Subjects are enrolled in a study" and enroll in
     */
    client
      .click('#optAllSubjectsInStudy')
      .selectByVisibleText(
        '#studySelectBox',
        localOptions.studyId
      );
  }

  return client
    .waitForPaginationComplete()
    .waitForText('#windowPreview')
    .getText('#windowPreview', (err, res) => {
      if (err) {
        throw err;
      }

      /**
       * Make sure there's at least one URSI in the "Preview of
       * selected" pane.
       */
      should(res).match(/^M\d+/g);
    })
    .call(localCallback);
}

/**
 * Add field(s) to query data.
 *
 * @param {Object} options
 * @param {string} options.button
 * @param {string} options.select
 * @param {string} options.table
 * @param {string[]} options.values
 * @return {undefined}
 */
function addFieldsToQuery(options) {
  options.values.forEach((value, i) => {
    client
      .selectByVisibleText(options.select, value)
      .click(options.button)
      /**
       * The first `tr` is always used as a heading. Start on the next.
       */
      .waitForExist(
        `${options.table} tr:nth-of-type(${i + 2})`,
        10000
      )

      /** Test to ensure value is in table */
      .getText(
        `${options.table} tr:nth-of-type(${i + 2})`,
        (err /* , res */) => {
          if (err) {
            throw err;
          }
          // should(res).match(new RegExp(value));
        }
      );
  });
}

/**
 * Set up demographic data in the "Data Criteria" form section.
 */
function setupDemograpicData(callback = _.noop) {
  return client
    .moveToObject('#optDemoDataOutput')
    .click('#optDemoDataOutput')
    .waitForVis('#demoDataDiv')
    .selectByVisibleText(
      'select[name="selDemoStudy"]',
      sampleStudyId,
      (err) => {
        if (err) {
          throw err;
        }

        addFieldsToQuery({
          select: 'select[name="selDemoField"]',
          button: '#btnDemoAddList',
          table: '#outputDemoRows',
          values: ['Gender', 'Subject Type'],
        });
      }
    )
    .call(callback);
}

function setupAssessmentData(callback = _.noop) {
  return client
    .moveToObject('#optAsmtDataOutput')
    .click('#optAsmtDataOutput')
    .waitForVis('#asmtDataDiv')
    .selectByVisibleText(
      '#asmtDataDiv select[name=selStudy]',
      sampleStudyId
    )
    .waitForExist(
      '#asmtDataDiv select[name=selInstrument] option[value="simple test"]',
      10000
    )
    .selectByVisibleText(
      '#asmtDataDiv select[name=selInstrument]',
      'simple test'
    )
    .waitForExist(
      'select[name=selField] option:nth-child(2)',
      5000,
      (err) => {
        if (err) {
          throw err;
        }

        addFieldsToQuery({
          select: 'select[name=selField]',
          button: '#btnAddList',
          values: ['All Fields'],
          table: '#outputRows',
        });
      }
    )
    .call(callback);
}

function setupScanData(callback = _.noop) {
  return client
    .moveToObject('#optScanDataOutput')
    .click('#optScanDataOutput')
    .waitForVis('#scanDataDiv')
    .selectByVisibleText(
      'select[name=selScanStudy]',
      '(MRN) JBUSTILLO: [08-049] FIRST'
    )
    /** Wait for the `select` to be populated with the study's protocols. */
    .waitForExist(
      'select[name=selProtocol] option[value=mprage_5e]',
      15000,
      (err) => {
        if (err) {
          throw err;
        }

        addFieldsToQuery({
          select: 'select[name=selProtocol]',
          button: '#btnDataAddProtList',
          values: ['mprage_5e', 'mprage_5e_rms'],
          table: '#queryOutputProtRows',
        });
      }
    )
    .call(callback);
}

/**
 * Preview and export.
 */
function previewAndExport(options, callback) {
  let localCallback;
  let localOptions;

  if (_.isFunction(options)) {
    localCallback = options;
    localOptions = {};
  } else if (!_.isFunction(callback)) {
    localCallback = _.noop;
  }

  const defaults = {
    delimiter: 'comma',
    isAssessment: false,
    isLegacy: false,
  };
  let delimiterSelector;

  localOptions = _.extend(defaults, localOptions);

  client
    .click('#btnPreview')
    /**
     * Hi.
     *
     * There's some twisted DOM state logic that prevents the page from
     * being used while running Selenium tests. The modal UI, enclosed in
     * `div.tmask` and `div.tbox` appears to be the culprit. Removing them
     * entirely completely fixes the problem.
     */
    .executeAsync((done) => {
      /* eslint-disable no-undef */
      [].forEach.call(window.document.querySelectorAll('.tmask, .tbox'), (node) => {
        // console.log(node);
        node.parentElement.removeChild(node);
      });
      /* eslint-enable no-undef */
      done();
    })
    .waitForText('#resultsarea', 10000)
    .getText('#step3 .frmHeaderText', (err, res) => {
      if (err) {
        throw err;
      } else if (res.trim() === 'Preview Finished') {
        /** It's assessment data. Results are output
         * differently, check appropriately.
         */
        client.getText('#resultsarea', (err2, res2) => {
          if (err2) {
            throw err;
          }

          should(res2).match(/Number of Assessment Records Found: \d+/);
        });
      } else {
        /**
         * It's regular data. Check for matches in `.frmHeaderText` and
         * the table.
         */
        should(res).match(/Results: \d+/);

        /**
         * Confirm the results area's rows has content. The first row
         * serves as table headers, so results should be > 2.
         */
        client.elements('#resultsarea tr', (err2, res2) => {
          if (err2) {
            throw err2;
          }

          should(res2.value.length).be.above(1);
        });
      }
    })
    .scroll(0, 0)
    .click('input[name=btnExport]')
    .scroll(0, 0);

  if (localOptions.isLegacy) {
    client
      .click('#safeExportButtons input[value*="Legacy Export"]')
      .waitForVis('#delimiters')
      .scroll(0, 0);
  }

  const exportButtonSelector = (localOptions.isAssessment && !localOptions.isLegacy) ?
    '#safeExportDashboard input[type=button]' :
    '#frmDnlLink input[name=btnExport]';
  delimiterSelector = (localOptions.isAssessment && !localOptions.isLegacy) ?
    '#safeDelimiters' :
    '#delimiters';
  delimiterSelector += localOptions.delimiter === 'tab' ?
    ' input[value*="\\t"]' :
    ' input[value=","]';

  /** @todo Test download. Switch MIME-type to `text` */

  return client
    .click(delimiterSelector)
    /**
     * This adds an `output_plain_text` parameter to the request, which
     * causes the download generator to instead return a plain text
     * response instead of a download-able CSV.
     */
    .executeAsync((done) => {
      /* eslint-disable no-undef */
      const form = document.getElementById('frmDnlLink');
      const input = document.createElement('input');
      /* eslint-enable no-undef */
      input.type = 'hidden';
      input.name = 'output_plain_text';
      input.value = 1;
      form.appendChild(input);
      done();
    })
   .click(exportButtonSelector)
   /**
    * @todo  The page should display plain text with a MIME type of
    *        `text/plain`. WebdriverIO needs to wait for this to be
    *        displayed. Webkit/Blink displays plain text inside a
    *        `pre` element in the body. This is extremely brittle and
    *        should be fixed, possibly using the `waitUntil()` method
    *        available in WebdriverIO 3.0.
    */
   .waitForExist('body > pre', 15000)
   .getText('body', (err, res) => {
     if (err) {
       throw err;
     }

     /**
      * The text should have some content and multiple lines.
      *
      * @todo  Write a better acceptance test for the CSV dump.
      */
     /* eslint-disable no-unused-expressions */
     should(res.trim()).be.ok;
     should(res.split('\n').length).be.above(1);
     /* eslint-enable no-unused-expressions */
   })
  .call(localCallback);
}

/**
 * Hide the Zendesk widget.
 *
 * This code is executed client-side via Webdriver.io's `execute`. {@link
 * http://webdriver.io/api/protocol/execute.html}
 */
function hideZendeskWidget() {
  /* eslint-disable no-undef */
  const zendeskWidget = document.getElementById('launcher');
  /* eslint-enable no-undef */

  if (zendeskWidget) {
    zendeskWidget.hidden = true;
  }
}

function goBack(callback) {
  client
    .back()
    .waitForExist('#optListOfSubjects', 10000)
    .waitForVisible('#optListOfSubjects', 10000)
    .execute(hideZendeskWidget);

  return client.call(_.isFunction(callback) ? callback : _.noop);
}

describe('Query Builder', function queryBuilder() {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) {
        micis.logon();
      }

      nav.goToQueryBuilder(() => {
        client.execute(hideZendeskWidget);
        client.call(done);
      });
    });
  });

    /**
     * Test output of demographic data.
     *
     * Subject selection via:
     *
     *   * Direct URSIs
     *   * A subject tag
     *
     * For each subject selection, sample demographic data with:
     *
     *   * "Gender" label
     *   * "Subject Type" label
     */
  describe('Demographic Data', () => {
        /**
         * Direct URSIs
         */
    describe('export via direct URSIs', () => {
      it('should set up', _.partialRight(setupQuery, {
        ursis: sampleUrsis,
      }));
      it('should setup demo data', setupDemograpicData);
      it('should preview and export', previewAndExport);
    });

        /**
         * By subject tag
         */
    describe('export via subject tag', () => {
      before(goBack);

      it('should set up', _.partial(setupQuery, {
        subjectTagType: 'Temporary Subject ID',
        subjectTags: ['6001'],
      }));
      it('should setup demographic data', setupDemograpicData);
      it('should preview and export', previewAndExport);
    });
  });

    /**
     * Test output of assessment data.
     *
     * Steps:
     *
     *   1. Choose "NITEST" (the helper function's default) for subject
     *      selection.
     *   2. Choose "NITEST" for the particular assessment data
     *   3. Leave assessment defaults (double entry, no date filters, all
     *      instruments and all visits)
     *   4. Select "All Fields" under "Fields" dropdown
     *
     * Two output modes must be tested:
     *
     *   * Select comma, leave other stuff. Click “Begin export”
     *   * Click legacy export, reselect comma, Click Export
     */
  describe('Assessment Data', () => {
        /**
         * Standard export
         */
    describe('export via standard export', () => {
      before(goBack);

      it('should set up', setupQuery);
      it('should setup assessment data', setupAssessmentData);
      it('should preview and export', _.partialRight(previewAndExport, {
        isAssessment: true,
      }));
    });

        /**
         * Legacy export
         */
    describe('export via legacy export', () => {
      before(goBack);

      it('should set up', setupQuery);
      it('should setup assessment data', setupAssessmentData);
      it('should preview and export', _.partialRight(previewAndExport, {
        delimiter: 'tab',
        isAssessment: true,
        isLegacy: true,
      }));
    });
  });

    /**
     * Test output of scan data.
     */
  describe('Scan Data', () => {
    before(goBack);

        /**
         * Use a different subject selection:
         *
         *   1. Choose "Subjects By Type:"
         *   2. Choose "JBUSTILLO's 'First'" study
         *   3. Choose "First Episode Patient" subject type
         */
    it('should set up', _.partialRight(setupQuery, {
      studyId: '(MRN) JBUSTILLO: [08-049] FIRST',
      subjectType: 'First Episode Patient',
    }));
    it('should setup scan data', setupScanData);
    it('should preview and export', previewAndExport);
  });

  describe('CRUD', () => {
    before(goBack);

    let sampleQueryName = `test_${Date.now()}`;
    const sampleQueryNameUpdate = `${sampleQueryName}_update`;

    it('should save a query', (done) => {
      setupQuery();
      setupDemograpicData();

            /** Set up and save a new query. */
      client
                .setValue('#queryLabel', sampleQueryName)
                .click('input[type=button][value=Save]')
                .waitForVis('#query_act_pop', 2000)
                .click('#query_act_pop input[type=button]') // TODO: Not working???
                .getText('#savedQueries', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).match(new RegExp(sampleQueryName));
                });

            /** Reload the page to get a fresh thing */
      nav.goToQueryBuilder();

            /**
             * Load up the query. Ensure the form fields have the right values.
             */
      client
                .selectByVisibleText('#savedQueries', sampleQueryName)
                .click('input[type=button][name=loadQuery]')
                .waitForPaginationComplete()
                /** Make sure all the saved data is set */
                .pause(2000) // ?
                .scroll(0, 0)
                .isSelected('#optAllSubjectsInStudy', (err, isSelected) => {
                  should(isSelected).be.ok; // eslint-disable-line no-unused-expressions
                })
                .getText('#ursiStudyDiv select option:checked', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).match(new RegExp(_.escapeRegExp(sampleStudyId)));
                })
                .isSelected('#optDemoDataOutput', (err, isSelected) => {
                  should(isSelected).be.ok; // eslint-disable-line no-unused-expressions
                })
                .getText('#outputDemoRows table', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).match(/Gender/);
                  should(res).match(/Subject Type/);
                })
                .getText('#outputDemoStudies', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).match(new RegExp(_.escapeRegExp(sampleStudyId)));
                })
                .getText('#savedQueries option:checked', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).match(new RegExp(sampleQueryName));
                })
                .call(done);
    });

        /** Update the query's name. Unfortunately, other aspects of the query can't be updated. */
    it('should rename a saved query', (done) => {
            /** Change the sample query name for the update */
      sampleQueryName += '_update';

      client
                .click('input[name=loadQuery][value="Rename Query"]')
                .pause(250)
                .alertText(sampleQueryNameUpdate)
                .alertAccept()
                .call(done);

      nav
                .goToQueryBuilder()
                .getText('#savedQueries', (err, res) => {
                  if (err) {
                    throw err;
                  }

                    /**
                     * The text, `res`, represents the `select`'s `option`s. It
                     * comes in as a newline-separated string. Ensure it *does*
                     * contain the updated query name and *does not* contain the
                     * old name.
                     */
                  should(res).not.match(new RegExp(`^${sampleQueryName}$`, 'm'));
                  should(res).match(new RegExp(`^${sampleQueryNameUpdate}$`, 'm'));
                })
                .call(done);
    });

    it('should delete a saved query', (done) => {
      client
                .waitForExist(`//select[@id="savedQueries"]/option[text()="${sampleQueryNameUpdate}"]`, 1000)
                .selectByVisibleText('#savedQueries', sampleQueryNameUpdate)
                .click('input[name=loadQuery][value="Delete Query"]')
                .pause(250)
                .alertAccept()
                .waitForPaginationComplete();

            /** Reload the page and make sure the saved query doesn't exist in the `select`. */
      nav.goToQueryBuilder()
                .getText('#savedQueries', (err, res) => {
                  if (err) {
                    throw err;
                  }

                  should(res).not.match(new RegExp(sampleQueryNameUpdate));
                })
                .call(done);
    });
  });
});
