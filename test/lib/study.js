"use strict";
var _ = require('lodash');
var noop = function(){};

module.exports = function(client, config) {
    var nav = require('./nav/navigation.js')(client, config);

    var me = {
        list: {},
        view: {}
    };

    me.goToView = function(name) {
        nav.micisMenu
            .clickNested('List Studies');
        return me.list.selectByName(name);
    };

    /**
     * Simulates navigating through the list studies page and clicking
     * the study that verbatim matches the provided name
     * @param  {string} name
     * @return {WebdriverIO} client
     */
    me.list.selectByName = function(name) {
        return client
            .moveToObject('#study_list_filter input[type=search]')
            .click('#study_list_filter input[type=search]')
            .setValue('#study_list_filter input[type=search]', name)
            .waitForText('=' + name)
            .click('=' + name)
            .waitForPaginationComplete();
    };

    me.view.subjects = function() {
        return client
            .click('[data-hook=view-subjects-btn]')
            .waitForPaginationComplete();
    };

    me.view.subjectDetails = function(ursi) {
        return client
            .click('//*[contains(text(), "' + ursi + '")]//..//*[contains(text(), "View")]')
            .waitForPaginationComplete();
    };

    me.view.subjectDetails.addTag = function(text, type, context) {
        client
            .click('=Subject Tags')
            .waitForPaginationComplete();
        return client.selectByVisibleText('#addextFrm select[name=subject_tag_id]', type)
            .setValue('#addextFrm [name=value]', text)
            .click('#addextFrm #context_' + context)
            .click('#addextFrm [name="doAdd"]')
            .waitForPaginationComplete();
    };

    me.view.visits = {
        /**
         * Fill out a study's visit form.
         *
         * This method works for both 'create' and 'edit' visit forms. The only
         * thing that changes is the `form`'s `id`.
         *
         * @param  {Object} options Contains `data` and `mode` properties.
         *   `data` contains input data for the form. `mode` holds the input
         *   type of the form, either `add` for adding a new visit or `update`
         *   for updating a visit. Example:
         *
         *       {
         *           data: {
         *               label: 'Test Label 2',
         *               timeFromBaseline: 2,
         *               timeUnit: 'Month'
         *           },
         *           mode: 'update'
         *       }
         *
         * @return {Object}         Instance of `client`
         */
        fillOutForm: function (options) {
            if (!options.data) {
                throw new Error('Study visit form needs data');
            }

            var formId = (options.mode === 'update') ? '#frmUpdate' : '#frmAdd';
            var data = options.data;

            client.moveToObject(formId);
            client.setValue('#addStudyVisitLabel', data.label);
            client.setValue(formId + ' input[name=time_from_baseline]' , data.timeFromBaseline);
            client.selectByVisibleText(formId + ' select[name=time_unit]', data.timeUnit);

            if (options.mode === 'add') {
                client.setValue(formId + ' input[name=segment_interval]', data.segmentInterval);
            }

            return client;
        },
        submitForm: function () {
            var buttonSelector = '#addStudyVisitSubmitBtn';
            return client
                .moveToObject(buttonSelector)
                .click(buttonSelector, function (err) {
                    if (err) {
                        throw err;
                    }
                });
        },
        navigateToEditPage: function (segmentInterval) {
            var selector = '//tr/td[. = "' + segmentInterval;
            selector += '"]/following-sibling::td/a';

            return client
                .scroll(selector, 0, -60, function (err) {
                    if (err) {
                        throw err;
                    }
                })
                .click(selector, function (err) {
                    if (err) {
                        throw err;
                    }
                });
        },
        /**
         * See if the visits table contains a row.
         *
         * @param  {array}   row
         * @return {boolean}
         */
        visitTableContainsRow: function (row, cb) {
            var compareRow = row.join('').replace(/\s/g, '').toLowerCase();

            return client
                /**
                 * The client needs to be on the 'Edit Study Visits' page.
                 * Implementation should be handled outside this method.
                 *
                 * Ensure the visits table's population by checking for
                 * `tbody tr` in the selector.
                 */
                .waitFor('.box-container > table tbody tr', 4000)
                .getText('.box-container > table', function (err, res) {
                    if (err) {
                        throw err;
                    } else if (!res) {
                        throw new Error('Study visits table doesn\'t contain any visits.');
                    }

                    var rowExists = res
                        .toLowerCase()
                        .replace(/edit|[^\S\n]/g, '') // Remove 'Edit' button text and whitespace
                        .split(/\n/)
                        .some(function (row) {
                            return row.indexOf(compareRow) !== -1;
                        });

                    cb(rowExists);
                });
        }
    };

    return me;

};
