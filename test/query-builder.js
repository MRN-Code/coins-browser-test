/**
 * Test Query builder.
 */
'use strict';

var _ = require('lodash');
var config = require('config');
var client = require('./lib/client').client;
var nav = require('./lib/nav/navigation')(client, config);
var micis = require('./lib/auth/micis')(client);
var should = require('should');

var sampleStudyId = '(MRN) VCALHOUN: [99-998] NITEST';
var sampleUrsis = ['M87120826', 'M87128533', 'M87100451', 'M87159685',
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
var setupQuery = function (options, callback) {
    var defaults = {
        studyId: sampleStudyId,
        subjectTagType: '',
        subjectTags: [],
        subjectType: '',
        ursis: []
    };

    /**
     * Sometimes the `options` argument is the callback.
     *
     * @todo  Figure out a better lodash-y way to handle.
     */
    if (options instanceof Function) {
        callback = options;
        options = {};
    } else if (!(callback instanceof Function)) {
        callback = _.noop;
    }

    options = _.extend(defaults, options);

    if (
        options.ursis.length ||
        (options.subjectTags.length && options.subjectTagType)
    ) {
        /**
         * Click "Subjects appear in list" checkbox. This results in 2
         * sub-options: direct URSI entry or "Subject Tags" selection.
         */
        client
            .scroll(0, 0)
            .click('#optListOfSubjects')
            .waitForVis('#ursiListDiv');

        if (options.ursis.length) {
            /** Option 1: direct URSI entry */
            client
                .click('#subject_list_type_ursi')
                .setValue('#subjectListInput', options.ursis.join(' '));
        } else {
            /** Option 2: subject tags */
            client
                .click('#subject_list_type_tag')
                .waitForVisible('#subject_list_tag_details')
                .selectByVisibleText(
                    '#subject_list_tag_study_id',
                    options.studyId
                )
                .selectByVisibleText(
                    '#subject_list_tag_id',
                    options.subjectTagType
                )
                .setValue('#subjectListInput', options.subjectTags.join(' '));
        }

        /** Click out of the text field to trigger the URSI query */
        client.click('#ursiListDiv fieldset');
    } else if (options.subjectType) {
        /**
         * Click "Subjects by subject type", select a study and subject type.
         */
        client
            .click('#subjectTypeCheckbox')
            .selectByVisibleText(
                '#subjectTypeStudySelectBox',
                options.studyId
            )
            .waitForVis('#selectTypeDiv')
            .selectByVisibleText(
                '#subjectTypeSelectBox',
                options.subjectType
            );
    } else {
        /**
         * Click "Subjects are enrolled in a study" and enroll in
         */
        client
            .click('#optAllSubjectsInStudy')
            .selectByVisibleText(
                '#studySelectBox',
                options.studyId
            );
    }

    return client
        .waitForPaginationComplete()
        .waitForText('#windowPreview')
        .getText('#windowPreview', function (err, res) {
            if (err) {
                throw err;
            }

            /**
             * Make sure there's at least one URSI in the "Preview of
             * selected" pane.
             */
            should(res).match(/^M\d+/g);
        })
        .call(callback);
};

/**
 * Add field(s) to query data.
 *
 * @param  {object}    options
 * @return {undefined}
 */
var addFieldsToQuery = function (options) {
    /** Test to ensure value is in table */
    var testTableRow = function (err, res) {
        if (err) {
            throw err;
        }

        should(res).match(new RegExp(options.values[i]));
    };

    for (var i = 0, il = options.values.length; i < il; i++) {
        client
            .selectByVisibleText(options.select, options.values[i])
            .click(options.button)
            /**
             * The first `tr` is always used as a heading. Start on the next.
             */
            .waitForExist(
                options.table + ' tr:nth-of-type(' + (i + 2) + ')',
                10000
            )
            .getText(
                options.table + ' tr:nth-of-type(' + (i + 2) + ')',
                testTableRow
            );
    }
};

/**
 * Set up demographic data in the "Data Criteria" form section.
 */
var setupDemograpicData = function (callback) {
    callback = callback instanceof Function ? callback : _.noop;

    return client
        .moveToObject('#optDemoDataOutput')
        .click('#optDemoDataOutput')
        .waitForVis('#demoDataDiv')
        .selectByVisibleText(
            'select[name="selDemoStudy"]',
            sampleStudyId,
            function (err) {
                if (err) {
                    throw err;
                }

                addFieldsToQuery({
                    select: 'select[name="selDemoField"]',
                    button: '#btnDemoAddList',
                    table: '#outputDemoRows',
                    values: ['Gender', 'Subject Type']
                });
            }
        )
        .call(callback);
};

var setupAssessmentData = function (callback) {
    callback = callback instanceof Function ? callback : _.noop;

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
            1500,
            function (err) {
                if (err) {
                    throw err;
                }

                addFieldsToQuery({
                    select: 'select[name=selField]',
                    button: '#btnAddList',
                    values: ['All Fields'],
                    table: '#outputRows'
                });
            }
        )
        .call(callback);
};

var setupScanData = function (callback) {
    callback = callback instanceof Function ? callback : _.noop;

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
            function (err) {
                if (err) {
                    throw err;
                }

                addFieldsToQuery({
                    select: 'select[name=selProtocol]',
                    button: '#btnDataAddProtList',
                    values: ['mprage_5e', 'mprage_5e_rms'],
                    table: '#queryOutputProtRows'
                });
            }
        )
        .call(callback);
};

/**
 * Preview and export.
 */
var previewAndExport = function (options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    } else if (!_.isFunction(callback)) {
        callback = _.noop;
    }

    var defaults = {
        delimiter: 'comma',
        isAssessment: false,
        isLegacy: false
    };
    var delimiterSelector;
    var exportButtonSelector;

    options = _.extend(defaults, options);

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
        .executeAsync(function (done) {
            [].forEach.call(window.document.querySelectorAll('.tmask, .tbox'), function (node) {
                // console.log(node);
                node.parentElement.removeChild(node);
            });
            done();
        })
        .waitForText('#resultsarea', 10000)
        .getText('#step3 .frmHeaderText', function (err, res) {
            if (err) {
                throw err;
            } else if (res.trim() === 'Preview Finished') {
                /** It's assessment data. Results are output
                 * differently, check appropriately.
                 */
                client.getText('#resultsarea', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).match(/Number of Assessment Records Found: \d+/);
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
                client.elements('#resultsarea tr', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res.value.length).be.above(1);
                });
            }
        })
        .scroll(0, 0)
        .click('input[name=btnExport]')
        .scroll(0, 0);

        if (options.isLegacy) {
            client
                .click('#safeExportButtons input[value*="Legacy Export"]')
                .waitForVis('#delimiters')
                .scroll(0, 0);
        }

        exportButtonSelector = (options.isAssessment && !options.isLegacy) ?
            '#safeExportDashboard input[type=button]' :
            '#frmDnlLink input[name=btnExport]';
        delimiterSelector = (options.isAssessment && !options.isLegacy) ?
            '#safeDelimiters' :
            '#delimiters';
        delimiterSelector += options.delimiter === 'tab' ?
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
            .executeAsync(function (done) {
                var form = document.getElementById('frmDnlLink');
                var input = document.createElement('input');
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
           .getText('body', function (err, res) {
               if (err) {
                   throw err;
               }

               /**
                * The text should have some content and multiple lines.
                *
                * @todo  Write a better acceptance test for the CSV dump.
                */
               should(res.trim()).be.ok;
               should(res.split('\n').length).be.above(1);
           })
            .call(callback);
};

var goBack = function (callback) {
    callback = _.isFunction(callback) ? callback : _.noop;

    return client
        .back()
        .waitForExist('#optListOfSubjects', 10000)
        .waitForVisible('#optListOfSubjects', 10000)
        .call(callback);
};

describe('Query Builder', function () {
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }

            nav.goToQueryBuilder(done);
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
    describe('Demographic Data', function () {
        /**
         * Direct URSIs
         */
        describe('export via direct URSIs', function () {
            it('should set up', _.partialRight(setupQuery, {
                ursis: sampleUrsis
            }));
            it('should setup demo data', setupDemograpicData);
            it('should preview and export', previewAndExport);
        });

        /**
         * By subject tag
         */
        describe('export via subject tag', function () {
            before(goBack);

            it('should set up', _.partial(setupQuery, {
                subjectTagType: 'Temporary Subject ID',
                subjectTags: ['6001']
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
    describe('Assessment Data', function () {
        /**
         * Standard export
         */
        describe('export via standard export', function () {
            before(goBack);

            it('should set up', setupQuery);
            it('should setup assessment data', setupAssessmentData);
            it('should preview and export', _.partialRight(previewAndExport, {
                isAssessment: true
            }));
        });

        /**
         * Legacy export
         */
        describe('export via legacy export', function () {
            before(goBack);

            it('should set up', setupQuery);
            it('should setup assessment data', setupAssessmentData);
            it('should preview and export', _.partialRight(previewAndExport, {
                delimiter: 'tab',
                isAssessment: true,
                isLegacy: true
            }));
        });
    });

    /**
     * Test output of scan data.
     */
    describe('Scan Data', function () {
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
            subjectType: 'First Episode Patient'
        }));
        it('should setup scan data', setupScanData);
        it('should preview and export', previewAndExport);
    });

    describe('CRUD', function () {
        before(goBack);

        var sampleQueryName = 'test_' + Date.now();
        var sampleQueryNameUpdate = sampleQueryName + '_update';

        it('should save a query', function (done) {
            setupQuery();
            setupDemograpicData();

            /** Set up and save a new query. */
            client
                .setValue('#queryLabel', sampleQueryName)
                .click('input[type=button][value=Save]')
                .waitForVis('#query_act_pop', 2000)
                .click('#query_act_pop input[type=button]')
                .getText('#savedQueries', function (err, res) {
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
                .isSelected('#optAllSubjectsInStudy', function (err, isSelected) {
                    should(isSelected).be.ok;
                })
                .getText('#ursiStudyDiv select option:checked', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).match(new RegExp(_.escapeRegExp(sampleStudyId)));
                })
                .isSelected('#optDemoDataOutput', function (err, isSelected) {
                    should(isSelected).be.ok;
                })
                .getText('#outputDemoRows table', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).match(/Gender/);
                    should(res).match(/Subject Type/);
                })
                .getText('#outputDemoStudies', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).match(new RegExp(_.escapeRegExp(sampleStudyId)));
                })
                .getText('#savedQueries option:checked', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).match(new RegExp(sampleQueryName));
                })
                .call(done);
        });

        /** Update the query's name. Unfortunately, other aspects of the query can't be updated. */
        it('should rename a saved query', function (done) {
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
                .getText('#savedQueries', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    /**
                     * The text, `res`, represents the `select`'s `option`s. It
                     * comes in as a newline-separated string. Ensure it *does*
                     * contain the updated query name and *does not* contain the
                     * old name.
                     */
                    should(res).not.match(new RegExp('^' + sampleQueryName + '$', 'm'));
                    should(res).match(new RegExp('^' + sampleQueryNameUpdate + '$', 'm'));
                })
                .call(done);
        });

        it('should delete a saved query', function (done) {
            client
                .waitForExist('//select[@id="savedQueries"]/option[text()="' + sampleQueryNameUpdate + '"]', 1000)
                .selectByVisibleText('#savedQueries', sampleQueryNameUpdate)
                .click('input[name=loadQuery][value="Delete Query"]')
                .pause(250)
                .alertAccept()
                .waitForPaginationComplete();

            /** Reload the page and make sure the saved query doesn't exist in the `select`. */
            nav.goToQueryBuilder()
                .getText('#savedQueries', function (err, res) {
                    if (err) {
                        throw err;
                    }

                    should(res).not.match(new RegExp(sampleQueryNameUpdate));
                })
                .call(done);
        });
    });
});
