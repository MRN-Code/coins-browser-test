'use strict';

/* globals browser */

// test deps
const randomstring = require('randomstring');

const nav = require('./lib/nav/navigation.js')(browser);
const instrument = require('./lib/instrument.js')(browser);
const section = require('./lib/section.js')(browser);
const question = require('./lib/question.js')(browser);


const instOptions = {
  label: 'selenium test instrument label',
  saLabel: 'selenium test instrument SA label',
  description: 'selenium test instrument description',
  crNotice: 'selenium test instrument copyright notice',
  version: '1.0',
  maxPerSegment: '100',
  skipQuestionText: 'selenium test instrument skip question text',
  hideSaPrevious: '0',
  saHideSkippedQuestions: '0',
  lock: '0',
};

const editInstOptions = {
  label: 'selenium test instrument label edit',
  saLabel: 'selenium test instrument SA label edit',
  description: 'selenium test instrument description edit',
  crNotice: 'selenium test instrument copyright notice edit',
  version: '2.0',
  maxPerSegment: '10',
  skipQuestionText: 'selenium test instrument skip question text edit',
  hideSaPrevious: '1',
  saHideSkippedQuestions: '1',
  lock: '1',
};

const testQuestionIdSeed = `SELENIUM${randomstring.generate(7)}`;

const sectionLabelSeeds = [
  'selenium 1q/page section',
  'selenium 3q/page section',
  'selenium 3q/page Likert section',
  'selenium 4q/page TABLE section',
  'selenium 4q/page SXS section',
  'selenium 1q/page sacraficial section',
  'selenium 1q/page sacraficial section with questions',
];

const timeoutDur = 90000;

// include pre-requisite tests
require('./logon.js');
require('./navigateToAsmt.js');

describe('instrument', function instrumenTest() {
  this.timeout(timeoutDur);

  it('should load create instrument form', () => {
    nav.asmtMenu.clickNested('Create Instrument');
  });

  it('should create a new instrument', () => {
    instrument.create(instOptions);
  });

  it('should load the new instrument', () => {
    const validate = (instObj) => {
      instOptions.should.be.eql(instObj);
    };
    instrument.fromHtml(validate);
  });

  it('should allow the new instrument to be edited', () => {
    instrument.edit(editInstOptions);
  });

  it('should load the edited instrument properties', () => {
    const validate = (instObj) => {
      editInstOptions.should.be.eql(instObj);
    };
    instrument.fromHtml(validate);
  });
  it('should print the instrument_id in a hidden field', () => {
    instrument.setInstrumentIdFromPage();
  });
  it('should navigate to instrument list', () => {
    nav.asmtMenu.clickNested('List Instruments');
  });
  it('should locate the newly created instrument', () => {
    instrument.filterList(instrument.instrumentId);
  });
  it('should unlock the instrument', () => {
    instrument.toggleLockFromList(instrument.instrumentId);
  });
  it('should open instrument editor from list', () => {
    instrument.gotoEditFromList(instrument.instrumentId);
  });
  it('should open the section editor', () => {
    section.openSectionEditor();
  });
  it('should create a section', () => {
    const seed = sectionLabelSeeds[0];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options);
  });
  it('should create another section', () => {
    const seed = sectionLabelSeeds[1];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '3',
    };
    section.create(options);
  });
  it('should create a likert section', () => {
    const seed = sectionLabelSeeds[2];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '3',
      likertGrid: undefined,
    };
    section.create(options);
  });
  it('should create a table section', () => {
    const seed = sectionLabelSeeds[3];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '4',
      tableType: undefined,
    };
    section.create(options);
  });
  it('should create a side by side section', () => {
    const seed = sectionLabelSeeds[4];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '4',
      multiInstGrid: undefined,
    };
    section.create(options);
  });
  it('should create a sacraficial section', () => {
    const seed = sectionLabelSeeds[5];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options);
  });
  it('should create a sacraficial section with questions', () => {
    const seed = sectionLabelSeeds[6];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options);
  });
  it('should close the section editor', () => {
    section.closeSectionEditor();
  });
  it('should open the question creation form', () => {
    question.openQuestionCreator();
  });
  it('should add a question to first section', () => {
    const options = {
      questionId: `${testQuestionIdSeed}_01`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[0]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    };
    question.create(options);
  });
  it('the newly added question should exist', () => {
    question.verifyQuestionInInstrument(`${testQuestionIdSeed}_01`);
  });
  it('should duplicate the question', () => {
    question.duplicate(`${testQuestionIdSeed}_01`, `${testQuestionIdSeed}_02`);
  });
  it('the newly duplicated question should exist', () => {
    question.verifyQuestionInInstrument(`${testQuestionIdSeed}_02`);
  });
  it('should delete a question', () => {
    question.delete(`${testQuestionIdSeed}_02`);
  });
  it('the newly deleted question should not exist', () => {
    const questionId = `${testQuestionIdSeed}_02`;
    question.verifyQuestionNotInInstrument(questionId);
  });
  describe('add multiple questions to first section', () => {
    const questions = [{
      questionId: `${testQuestionIdSeed}_02`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[0]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_03`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[0]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    },
    ];
    it('should add more questions to the first section', () => {
      questions.forEach((options) => {
        question.openQuestionCreator();
        question.create(options);
      });
    });
    it('the newly created questions should exist', () => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
    });
  });
  describe('add multiple questions to second section', () => {
    const questions = [{
      questionId: `${testQuestionIdSeed}_04`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_05`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_06`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_07`,
      label: 'selenium canned response question label',
      saLabel: 'selenium canned response question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium canned response question description',
      cannedTypeToggle: undefined,
      addQuestionResponseLabel1: 'Ja',
      addQuestionResponseDesc1: 'German for yes',
      addQuestionResponseValue1: 1,
      addQuestionResponseLabel2: 'Nein',
      addQuestionResponseDesc2: 'German for no',
      addQuestionResponseValue2: 0,
    },
    {
      questionId: `${testQuestionIdSeed}_08`,
      label: 'selenium canned response question label',
      saLabel: 'selenium canned response question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium canned response question description',
      cannedTypeToggle: undefined,
      previousResponses: undefined,
    },
    {
      questionId: `${testQuestionIdSeed}_09`,
      label: 'selenium canned response question label',
      saLabel: 'selenium canned response question SA label',
      sectionId: `${sectionLabelSeeds[1]} label`,
      maxInstances: 1,
      description: 'selenium canned response question description',
      cannedTypeToggle: undefined,
      previousResponses: true,
    },
    ];
    it('should navigate to the second section', () => {
      instrument.gotoSection(`${sectionLabelSeeds[1]} label`);
    });
    it('should add more questions to the second section', () => {
      questions.forEach((options) => {
        question.openQuestionCreator();
        question.create(options);
      });
    });
    it('the newly created questions should exist', () => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
    });
  });
  describe('add multiple questions to likert section', () => {
    const questions = [{
      questionId: `${testQuestionIdSeed}_10`,
      label: 'selenium canned response question label',
      saLabel: 'selenium canned response question SA label',
      sectionId: `${sectionLabelSeeds[2]} label`,
      maxInstances: 1,
      description: 'selenium canned response question description',
      cannedTypeToggle: undefined,
      addQuestionResponseLabel1: 'Ja',
      addQuestionResponseDesc1: 'German for yes',
      addQuestionResponseValue1: 1,
      addQuestionResponseLabel2: 'Nein',
      addQuestionResponseDesc2: 'German for no',
      addQuestionResponseValue2: 0,
    },
    ];
    it('should navigate to the third section', () => {
      instrument.gotoSection(`${sectionLabelSeeds[2]} label`);
    });
    it('should add questions to the third section', () => {
      questions.forEach((options) => {
        question.openQuestionCreator();
        question.create(options);
      });
    });
    it('the newly created questions should exist', () => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
    });
    it('should duplicate the question', () => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_11`);
    });
    it('the newly duplicated question should exist', () => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_11`);
    });
    it('should duplicate the question', () => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_12`);
    });
    it('the newly duplicated question should exist', () => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_12`);
    });
    it('should duplicate the question', () => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_13`);
    });
    it('the newly duplicated question should exist', () => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_13`);
    });
  });
  describe('add questions to side by side section', () => {
    const questions = [{
      questionId: `${testQuestionIdSeed}_14`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_15`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_16`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_17`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_18`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    {
      questionId: `${testQuestionIdSeed}_19`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[4]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },

    ];
    it('should navigate to the fifth section', () => {
      instrument.gotoSection(`${sectionLabelSeeds[4]} label`);
    });
    it('should add questions to the fifth section', () => {
      questions.forEach((options) => {
        question.openQuestionCreator();
        question.create(options);
      });
    });
    it('the newly created questions should exist', () => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
    });
  });
  describe('add a question to the sacraficial section', () => {
    const questions = [{
      questionId: `${testQuestionIdSeed}_20`,
      label: 'selenium sxs text question label',
      saLabel: 'selenium sxs text question SA label',
      sectionId: `${sectionLabelSeeds[6]} label`,
      maxInstances: 1,
      description: 'selenium sxs text question description',
    },
    ];
    it('should navigate to the sacraficial section', () => {
      instrument.gotoSection(`${sectionLabelSeeds[6]} label`);
    });
    it('should add questions to the sacraficial section', () => {
      questions.forEach((options) => {
        question.openQuestionCreator();
        question.create(options);
      });
    });
    it('the newly created questions should exist', () => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
    });
  });
  it('should delete sacraficial section');
  it('should delete sacraficial section with questions: reassign quesitons');
});
