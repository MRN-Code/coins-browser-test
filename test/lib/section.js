'use strict';

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
 *
 * The last four are mutually exclusive (only one may be specified). If more
 * than one is specified, the last one specified will be used.
 */

const _ = require('lodash');

const getFormField = (key) => {
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
    action: actions[key] || actions._default, // eslint-disable-line no-underscore-dangle
  };
};

module.exports = (client) => {
  const me = {};
  const formSelector = '#instrument_add_edit_new_section';

  me.openSectionEditor = () => {
    const selector = 'div.simLink[title="Edit Section Sort Order"]';
    client.click(selector)
      .waitForPaginationComplete()
      .pause(1000);
    return client.isVisible(formSelector);
  };

  me.create = (options) => {
    _.forEach(options, (option, key) => {
      const field = getFormField(key);
      client[field.action](field.selector, option);
    });

    client
      .click('#add_section_button_wrapper > input')
      .waitForPaginationComplete()
      .waitForVis(formSelector, 4000);
    return client;
  };

  me.closeSectionEditor = () => client.click('.tclose')
    .waitForPaginationComplete();

  return me;
};
