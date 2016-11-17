

// test deps
const should = require('should');
const _ = require('lodash');

const getStrict = function (obj, key) {
  if (obj[key] === undefined) {
    throw new Error(`Expected option \`${key}\` to be set`);
  }
  return obj[key];
};

const getFormField = function (key) {
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
    action: actions[key] || actions._default,
  };
};

// exports
module.exports = function (client, config) {
  const me = { instrumentId: undefined };

  me.filterList = function (query, done) {
    const selector = '#instrument_grid_filter input[type=search]';
    return client.setValue(selector, query, done);
  };

  me.setInstrumentIdFromPage = function (done) {
    const selector = '[name=instrument_id]';
    return client.getValue(selector, (err, val) => {
      if (err) {
        throw err;
      }
      me.instrumentId = val;
      done();
    });
  };

  me.toggleLockFromList = function (instrumentId, done) {
    const selector = `[data-instrument_id="${instrumentId}"] input.locked-unlocked`;
    let lockState,
      expectedState;
    const expectedStateMap = {
      lock: 'unlock',
      unlock: 'lock',
    };
    const setLockState = function (err, val) {
      if (!err) {
        lockState = val;
        expectedState = expectedStateMap[val];
      } else {
        throw err;
      }
    };
    return client.getValue(selector, setLockState)
            .click(selector)
            .waitForPaginationComplete()
            .getValue(selector, (err, val) => {
              if (err) {
                throw err;
              }
              val.should.be.eql(expectedState);
              done();
            });
  };

  me.gotoEditFromList = function (instrumentId, done) {
    const selector = `[data-instrument_id="${instrumentId}"] a.pvedit`;
    return client.click(selector)
            .waitForPaginationComplete(done);
  };

  me.gotoSection = function (sectionLabel, done) {
    const navSelector = '#asmtPageNav';
    const xPathNavSelector = '//*[@id="asmtPageNav"]';
    const xPathSelector = `${xPathNavSelector}//li[normalize-space(.) = "${sectionLabel}"]`;

    return client.moveToObject(xPathNavSelector, 80, 10)
            .click(xPathSelector)
            .moveToObject('#page-container', 0, 0, done);
  };


  me.create = function (options, done) {
    return client
            .setValue('input[name=label]', getStrict(options, 'label'))
            .setValue('input[name=salabel]', getStrict(options, 'saLabel'))
            .setValue('input[name=description]', getStrict(options, 'description'))
            .setValue('input[name=cr_notice]', getStrict(options, 'crNotice'))
            .setValue('input[name=version]', getStrict(options, 'version'))
            .setValue('input[name=max_per_segment]', getStrict(options, 'maxPerSegment'))
            .setValue('input[name=skip_question_text]', getStrict(options, 'skipQuestionText'))
            .click('button[id=add_instrument]')
            .waitForPaginationComplete(done);
  };

  me.edit = function (options, done) {
    _.forEach(options, (option, key) => {
      const field = getFormField(key);
      client[field.action](`[name=${field.name}]`, option);
    });

    return client
            .click('button[id=update_instrument]')
            .waitForPaginationComplete(done);
  };

  me.fromHtml = function (callback) {
    const options = {};
    const callbackWrapper = function () {
      callback(null, options);
    };
    client
            .getValue('input[name=label]', (err, val) => { options.label = val; })
            .getValue('input[name=salabel]', (err, val) => { options.saLabel = val; })
            .getValue('input[name=description]', (err, val) => { options.description = val; })
            .getValue('input[name=cr_notice]', (err, val) => { options.crNotice = val; })
            .getValue('input[name=version]', (err, val) => { options.version = val; })
            .getValue('input[name=max_per_segment]', (err, val) => { options.maxPerSegment = val; })
            .getValue('input[name=skip_question_text]', (err, val) => { options.skipQuestionText = val; })
            .getValue('select[name=hide_sa_previous]', (err, val) => { options.hideSaPrevious = val; })
            .getValue('select[name=sa_hide_skipped_questions]', (err, val) => { options.saHideSkippedQuestions = val; })
            .getValue('select[name=lock]', (err, val) => {
              if (err) {
                    // the lock select element is not printed if the instrument is locked
                options.lock = '1';
              } else {
                options.lock = val;
              }
            })
            .call(callbackWrapper);
  };

  return me;
};
