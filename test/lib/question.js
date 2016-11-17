

/**
 */
// test deps
const should = require('should');
const _ = require('lodash');

const getFormField = function (key) {
  const exceptions = {
    questionId: 'question_ID',
    maxInstances: 'maxInstances',
    cannedTypeToggle: 'cannedTypeToggle',
    addQuestionResponseLabel1: 'addQuestionResponseLabel1',
    addQuestionResponseDesc1: 'addQuestionResponseDesc1',
    addQuestionResponseValue1: 'addQuestionResponseValue1',
    addQuestionResponseLabel2: 'addQuestionResponseLabel2',
    addQuestionResponseDesc2: 'addQuestionResponseDesc2',
    addQuestionResponseValue2: 'addQuestionResponseValue2',
    previousResponses: 'Previous',
  };
  const selectors = {
    cannedTypeToggle: '#<replace>',
    previousResponses: '[value=<replace>]',
    _default: '[name=<replace>]',
  };
  const actions = {
    previousResponses: 'click',
    sectionId: 'selectByVisibleText',
    cannedTypeToggle: 'click',
    _default: 'setValue',
  };
  const generateSelector = function () {
    const selector = selectors[key] || selectors._default;
    const selectorId = exceptions[key] || _.snakeCase(key);
    return selector.replace('<replace>', selectorId);
  };
  return {
    id: exceptions[key] || _.snakeCase(key),
    selector: generateSelector(),
    action: actions[key] || actions._default,
  };
};

// exports
module.exports = function (client, config) {
  const me = {};

  me.openQuestionCreator = function (done) {
    const selector = '#asmtAddQuestion';
    return client
            .scroll(selector, 0, -100)
            .click(selector)
            .waitForPaginationComplete(done);
  };
  me.verifyQuestionInInstrument = function (questionId, done) {
    return client.isVisible(`#questionList_${questionId}`, done);
  };
  me.verifyQuestionNotInInstrument = function (questionId, done) {
    const opposite = function (err, isVisible) {
      if (isVisible) {
        throw new Error(`Expected question ${questionId}to NOT exist`);
      } else if (isVisible === false) {
        done();
      }
      if (err) {
        throw err;
      }
    };
    return client.isExisting(`#questionList_${questionId}`, opposite);
  };
  me.hoverEdit = function (questionId, done) {
    const hoverSelector = `#questionList_${questionId} .editQuestionButton`;
    return client.moveToObject(hoverSelector, done);
  };
  me.duplicate = function (fromId, toId, done) {
    const clickSelector = `#questionList_${fromId} .duplicateQuestionButton`;
    return me.hoverEdit(fromId)
            .click(clickSelector)
            .pause(1500)
            .setValue('input[name=question_id]', toId)
            .click('.tcontent')
            .pause(1500)
            .click('input[value=Duplicate]')
            .pause(1500)
            .alertAccept()
            .waitForPaginationComplete(done);
  };
  me.delete = function (questionId, done) {
    const clickSelector = `#questionList_${questionId} .deleteQuestionButton`;

    return me.hoverEdit(questionId)
            .click(clickSelector)
            .pause(10000)
            .click('input[value=Delete]')
            .waitForPaginationComplete(done);
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
            .scroll('[name=submitButton]', 0, -100)
            .click('[name=submitButton]')
            .waitForPaginationComplete(done);
  };
  me.goBackToSection = function (done) {
    return client.click('.tclose')
            .waitForPaginationComplete(done);
  };

  return me;
};
