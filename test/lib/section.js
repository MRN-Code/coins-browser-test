

/**
 * available section options object properties:
 *   label: {string}
 *   desc: {string}
 *   saLabel: {string}
 *   saDesc: {string}
 *   saQuestionsPerPage: {string}
 *   tableType: {undefined}
 *   multiInstGrid: {undefined}
 *   likertGrid: {undefined}
 *   noGrid: {undefined}
 * The last four are mutually exclusive (only one may be specified). If more than one is specified, the last one specified will be used.
 */
// test deps

const should = require('should');
const _ = require('lodash');

const getFormField = function (key) {
  const exceptions = {};
  const actions = {
    noGrid: 'click',
    likertGrid: 'click',
    tableType: 'click',
    multiInstGrid: 'click',
    _default: 'setValue',
  };
  return {
    id: exceptions[key] || _.snakeCase(key),
    selector: `#${exceptions[key] || _.snakeCase(key)}`,
    action: actions[key] || actions._default,
  };
};

// exports
module.exports = function (client, config) {
  const me = {};
  const formSelector = '#instrument_add_edit_new_section';

  me.openSectionEditor = function (done) {
    const selector = 'div.simLink[title="Edit Section Sort Order"]';
    return client.click(selector)
            .waitForPaginationComplete()
            .pause(1000)
            .isVisible(formSelector, done);
  };
  me.create = function (options, done) {
    const setValues = function () {
      _.forEach(options, (option, key) => {
        const field = getFormField(key);
        client[field.action](field.selector, option);
      });
      return client;
    };
    return client
            .call(setValues)
            .click('#addSectionIcon')
            .waitForPaginationComplete()
            .waitForVis(formSelector, 4000, done);
  };
  me.closeSectionEditor = function (done) {
    return client.click('.tclose')
            .waitForPaginationComplete(done);
  };

  return me;
};
