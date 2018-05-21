'use strict';

const _ = require('lodash');
const should = require('should');

const getFormField = (key) => {
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
    _default: 'setValue', // eslint-disable-line no-underscore-dangle
  };

  const generateSelector = () => {
    /* eslint-disable no-underscore-dangle */
    const selector = selectors[key] || selectors._default;
    /* eslint-enable no-underscore-dangle */
    const selectorId = exceptions[key] || _.snakeCase(key);
    return selector.replace('<replace>', selectorId);
  };
  return {
    id: exceptions[key] || _.snakeCase(key),
    selector: generateSelector(),
    /* eslint-disable no-underscore-dangle */
    action: actions[key] || actions._default,
    /* eslint-enable no-underscore-dangle */
  };
};

module.exports = (client) => {
  const me = {};

  me.openQuestionCreator = () => {
    const selector = '#asmtAddQuestion';
    return client
      .element(selector)
      .scroll()
      .click(selector)
      .waitForPaginationComplete();
  };

  me.verifyQuestionInInstrument = questionId => client
    .isVisible(`#questionList_${questionId}`);

  me.verifyQuestionNotInInstrument = (questionId) => {
    const isVisible = client.isExisting(`#questionList_${questionId}`);
    if (isVisible) {
      throw new Error(`Expected question ${questionId} to NOT exist`);
    }
    return client;
  };

  me.hoverEdit = (questionId) => {
    const hoverSelector = `#questionList_${questionId} .editQuestionButton`;
    return client.element(hoverSelector).scroll();
  };

  me.duplicate = (fromId, toId) => {
    const clickSelector = `#questionList_${fromId} .duplicateQuestionButton`;
    me.hoverEdit(fromId)
      .click(clickSelector)
      .pause(1500);
    client.setValue('input[name=question_id]', toId)
      .click('.tcontent')
      .pause(1500);
    client.click('input[value=Duplicate]')
      .pause(1500);
    return client.alertAccept()
      .waitForPaginationComplete();
  };

  me.delete = (questionId) => {
    const clickSelector = `#questionList_${questionId} .deleteQuestionButton`;

    return me.hoverEdit(questionId)
      .click(clickSelector)
      .pause(10000)
      .click('input[value=Delete]')
      .waitForPaginationComplete();
  };

  me.create = (options) => {
    _.forEach(options, (option, key) => {
      const field = getFormField(key);
      client[field.action](field.selector, option);
    });

    return client
      .element('[name=submitButton]')
      .scroll()
      .click('[name=submitButton]')
      .waitForPaginationComplete();
  };

  me.goBackToSection = () => client.click('.tclose')
    .waitForPaginationComplete();

  return me;
};
