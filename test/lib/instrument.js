'use strict';

// test deps
const _ = require('lodash');

function getStrict(obj, key) {
  if (obj[key] === undefined) {
    throw new Error(`Expected option \`${key}\` to be set`);
  }
  return obj[key];
}

function getFormField(key) {
  const exceptions = {
    saLabel: 'salabel',
  };
  const actions = {
    hideSaPrevious: 'selectByValue',
    saHideSkippedQuestions: 'selectByValue',
    lock: 'selectByValue',
    _default: 'setValue',
  };
  return {
    name: exceptions[key] || _.snakeCase(key),
    action: actions[key] || actions._default, // eslint-disable-line no-underscore-dangle
  };
}

// exports
module.exports = (client) => {
  const me = {
    instrumentId: undefined,
  };

  me.filterList = (query) => {
    const selector = '#instrument_grid_filter input[type=search]';
    return client.setValue(selector, query);
  };

  me.setInstrumentIdFromPage = () => {
    const selector = '[name=instrument_id]';
    const val = client.getValue(selector);
    val.should.be.ok;// eslint-disable-line no-unused-expressions
    me.instrumentId = val;
    return client;
  };

  me.toggleLockFromList = (instrumentId) => {
    const selector = `[data-instrument_id="${instrumentId}"] input.locked-unlocked`;
    const expectedStateMap = {
      lock: 'unlock',
      unlock: 'lock',
    };
    const lockState = client.getValue(selector);
    lockState.should.be.ok; // eslint-disable-line no-unused-expressions
    const expectedState = expectedStateMap[lockState];
    client
      .click(selector)
      .waitForPaginationComplete();
    const val = client.getValue(selector);
    val.should.be.eql(expectedState);
    return client;
  };

  me.gotoEditFromList = (instrumentId) => {
    const selector = `[data-instrument_id="${instrumentId}"] a.pvedit`;
    return client.click(selector)
      .waitForPaginationComplete();
  };

  me.gotoSection = (sectionLabel) => {
    const xPathNavSelector = '//*[@id="asmtPageNav"]';
    const xPathSelector = `${xPathNavSelector}//li[normalize-space(.) = "${sectionLabel}"]`;

    return client.element(xPathNavSelector).scroll()
      .click(xPathSelector)
      .element('#page-container')
      .scroll();
  };


  me.create = options => client
    .setValue('input[name=label]', getStrict(options, 'label'))
    .setValue('input[name=salabel]', getStrict(options, 'saLabel'))
    .setValue('input[name=description]', getStrict(options, 'description'))
    .setValue('input[name=cr_notice]', getStrict(options, 'crNotice'))
    .setValue('input[name=version]', getStrict(options, 'version'))
    .setValue('input[name=max_per_segment]', getStrict(options, 'maxPerSegment'))
    .setValue('input[name=skip_question_text]', getStrict(options, 'skipQuestionText'))
    .click('button[id=add_instrument]')
    .waitForPaginationComplete();

  me.edit = (options) => {
    _.forEach(options, (option, key) => {
      const field = getFormField(key);
      client[field.action](`[name=${field.name}]`, option);
    });

    return client
      .click('button[id=update_instrument]')
      .waitForPaginationComplete();
  };

  me.fromHtml = (callback) => {
    const options = {};
    const callbackWrapper = () => callback(options);
    options.label = client.getValue('input[name=label]');
    options.saLabel = client.getValue('input[name=salabel]');
    options.description = client.getValue('input[name=description]');
    options.crNotice = client.getValue('input[name=cr_notice]');
    options.version = client.getValue('input[name=version]');
    options.maxPerSegment = client.getValue('input[name=max_per_segment]');
    options.skipQuestionText = client.getValue('input[name=skip_question_text]');
    options.hideSaPrevious = client.getValue('select[name=hide_sa_previous]');
    options.saHideSkippedQuestions = client.getValue('select[name=sa_hide_skipped_questions]');
    const lock = client.getValue('select[name=lock]');
    if (lock) {
      options.lock = lock;
    } else {
      // the lock select element is not printed if the instrument is locked
      options.lock = '1';
    }
    callbackWrapper();
  };

  return me;
};
