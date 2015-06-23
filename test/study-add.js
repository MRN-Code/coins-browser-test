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

'use strict';

var _ = require('lodash');
var moment = require('moment');
var config = require('config');
var client = require('./lib/client').client;
var nav = require('./lib/nav/navigation')(client, config);
var micis = require('./lib/auth/micis')(client);
var should = require('should');

/**
 * Set up sample data. This should be unique every time the test is run through
 * the use of random numbers.
 */
var sampleSlug = _.random(1e6, 1e7 - 1);
var sampleData = {
    label: 'test_' + sampleSlug,
    title: 'Test Study: ' + sampleSlug,
    archiveDirectory: 'test_dir_' + sampleSlug,
    pi: 'Calhoun, Vince',
    coInvestigator: 'Turner, Jessica',
    sideId: 'Mind Research Network',
    email: 'coins-notifier@mrn.org',
    irbNumber: _.random(10, 99) + '-' + _.random(100, 999),
    internalStudyNumber: _.random(10, 99) + '-' + _.random(100, 999),
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
    cssUrl: 'http://www.mrn.org/_ui/css/style.css'
};

describe('Add a new study', function () {
    this.timeout(config.defaultTimeout);

    before('initialize', function (done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }

            nav.micisMenu
                .clickNested('Add New Study')
                .call(done);
        });
    });

    /**
     * Confirm the form exists (step #1).
     */
    it('should show a new study form', function (done) {
        client
            .element('form#frmAdd', function (err) {
                if (err) {
                    throw err;
                }
            })
            .call(done);
    });

    /**
     * Fill out the form using `sampleData` (step #2).
     */
    it('should accept new study values', function (done) {
        client
            .setValue('input[name=label]', sampleData.label)
            .setValue('input[name=hrrc_title]', sampleData.title)
            .setValue('input[name=study_dir_name]', sampleData.archiveDirectory)
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
            .setValue('input[name=study_css_url]', sampleData.cssUrl)
            .call(done);
    });

    /**
     * Click through to save the new study (step #3).
     */
    it('should save new study', function (done) {
        client
            .moveToObject('input[name=DoAdd]')
            .click('input[name=DoAdd]')
            .waitForPaginationComplete()
            .waitForExist('.confirmMsg', 1500)
            .getText('.confirmMsg', function (err, res) {
                if (err) {
                    throw err;
                }

                /**
                 * A 'study saved' view is served with a confirmation message.
                 * Check the message's text to make sure it contains the
                 * sample data's label value.
                 */
                var pattern = new RegExp(sampleData.label + ' successfully added', 'i');
                res.should.match(pattern);
            })
            .click('=View Study Details')
            .waitForPaginationComplete()
            .call(done);
    });

    /**
     * Verify the new study's values were saved (step #4).
     */
    it('should display correct study values', function (done) {
        /**
         * Associate the form's labels to the data they should match.
         *
         * The view study page contains a very large table with all the study's
         * saved data. This data structure matches the table's labels (`label`)
         * to the text values they should match (`match`).
         */
        var labelMatches = [{
            label: 'Study Name',
            match: sampleData.label
        }, {
            label: 'IRB Title (formal title)',
            match: sampleData.title
        }, {
            label: 'Study Archive Directory',
            match: sampleData.archiveDirectory
        }, {
            label: 'Principal Investigator',
            match: sampleData.pi.split(', ').reverse().join(' ')
        }, {
            label: 'Co-Investigator',
            match: sampleData.coInvestigator.split(', ').reverse().join(' ')
        }, {
            label: 'Site',
            match: sampleData.sideId
        }, {
            label: 'IRB Number',
            match: sampleData.irbNumber
        }, {
            label: 'Internal Study Number',
            match: sampleData.internalStudyNumber
        }, {
            label: 'IRB Consent Date',
            match: sampleData.approvalDate
        }, {
            label: 'Expiration date',
            match: sampleData.expirationDate
        }, {
            label: 'Approved number of Participants',
            match: sampleData.maxEnrollment
        }, {
            label: 'Allows URSI Sharing',
            match: sampleData.studySharing
        }, {
            label: 'Sponsor',
            match: sampleData.sponsor
        }, {
            label: 'Grant Number',
            match: sampleData.grantNumber
        }, {
            label: 'URL Reference',
            match: sampleData.urlReference
        }, {
            label: 'URL Description',
            match: sampleData.urlDescription
        }, {
            label: 'Status',
            match: sampleData.status
        }, {
            label: 'Default Radiologist:',
            match: sampleData.defaultRadiologist
        }, {
            label: 'Primary Research Area',
            match: sampleData.primaryResearchArea
        }, {
            label: 'Secondary Research Area',
            match: sampleData.secondaryResearchArea
        }, {
            label: 'Comments/Notes',
            match: sampleData.description
        }, {
            label: 'Study CSS URL',
            match: sampleData.cssUrl
        }];

        /**
         * Wait for the study data table to show up.
         *
         * @{@link  http://webdriver.io/api/utility/waitForExist.html}
         */
        client.waitForExist('.box-container > table:nth-of-type(2)', 1500, false, function (err) {
            if (err) {
                throw err;
            }

            /**
             * Iterate over the table's labels and ensure their values are
             * correct.
             */
            labelMatches.forEach(function (item) {
                client.getText(
                    '//tr/td[text()="' + item.label + '"]/following-sibling::td[1]',
                    function (err, res) {
                        if (err) {
                            throw err;
                        }

                        res.should.match(new RegExp(item.match, 'i'));
                    }
                );
            });
        }).call(done);
    });
});
