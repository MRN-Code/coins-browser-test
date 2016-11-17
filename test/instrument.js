

// test deps
const config = require('config');
const should = require('should');
const randomstring = require('randomstring');

const client = require('./lib/client.js').client;

const nav = require('./lib/nav/navigation.js')(client, config);
const instrument = require('./lib/instrument.js')(client, config);
const section = require('./lib/section.js')(client, config);
const question = require('./lib/question.js')(client, config);


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

describe('instrument', () => {
  this.timeout(timeoutDur);

  before('initialize', (done) => {
        // wait for client to be ready before testing
    client.clientReady.then(done);
  });

  after('close client', (done) => {
       // client.end(done);
    done();
  });

  it('should load create instrument form', (done) => {
    nav.asmtMenu.clickNested('Create Instrument', done);
  });

  it('should create a new instrument', (done) => {
    instrument.create(instOptions, done);
  });

  it('should load the new instrument', (done) => {
    const validate = (err, instObj) => {
      instOptions.should.be.eql(instObj);
      done();
    };
    instrument.fromHtml(validate);
  });

  it('should allow the new instrument to be edited', (done) => {
    instrument.edit(editInstOptions, done);
  });

  it('should load the edited instrument properties', (done) => {
    const validate = (err, instObj) => {
      editInstOptions.should.be.eql(instObj);
      done();
    };
    instrument.fromHtml(validate);
  });
  it('should print the instrument_id in a hidden field', (done) => {
    instrument.setInstrumentIdFromPage(done);
  });
  it('should navigate to instrument list', (done) => {
    nav.asmtMenu.clickNested('List Instruments', done);
  });
  it('should locate the newly created instrument', (done) => {
    instrument.filterList(instrument.instrumentId, done);
  });
  it('should unlock the instrument', (done) => {
    instrument.toggleLockFromList(instrument.instrumentId, done);
  });
  it('should open instrument editor from list', (done) => {
    instrument.gotoEditFromList(instrument.instrumentId, done);
  });
  it('should open the section editor', (done) => {
    section.openSectionEditor(done);
  });
  it('should create a section', (done) => {
    const seed = sectionLabelSeeds[0];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options, done);
  });
  it('should create another section', (done) => {
    const seed = sectionLabelSeeds[1];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '3',
    };
    section.create(options, done);
  });
  it('should create a likert section', (done) => {
    const seed = sectionLabelSeeds[2];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '3',
      likertGrid: undefined,
    };
    section.create(options, done);
  });
  it('should create a table section', (done) => {
    const seed = sectionLabelSeeds[3];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '4',
      tableType: undefined,
    };
    section.create(options, done);
  });
  it('should create a side by side section', (done) => {
    const seed = sectionLabelSeeds[4];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '4',
      multiInstGrid: undefined,
    };
    section.create(options, done);
  });
  it('should create a sacraficial section', (done) => {
    const seed = sectionLabelSeeds[5];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options, done);
  });
  it('should create a sacraficial section with questions', (done) => {
    const seed = sectionLabelSeeds[6];
    const options = {
      label: `${seed} label`,
      desc: `${seed} desc`,
      saLabel: `${seed} SA label`,
      saDesc: `${seed} SA desc`,
      saQuestionsPerPage: '1',
    };
    section.create(options, done);
  });
  it('should close the section editor', (done) => {
    section.closeSectionEditor(done);
  });
  it('should open the question creation form', (done) => {
    question.openQuestionCreator(done);
  });
  it('should add a question to first section', (done) => {
    const options = {
      questionId: `${testQuestionIdSeed}_01`,
      label: 'selenium text question label',
      saLabel: 'selenium text question SA label',
      sectionId: `${sectionLabelSeeds[0]} label`,
      maxInstances: 1,
      description: 'selenium text question description',
    };
    question.create(options, done);
  });
  it('the newly added question should exist', (done) => {
    question.verifyQuestionInInstrument(`${testQuestionIdSeed}_01`, done);
  });
  it('should duplicate the question', (done) => {
    question.duplicate(`${testQuestionIdSeed}_01`, `${testQuestionIdSeed}_02`, done);
  });
  it('the newly duplicated question should exist', (done) => {
    question.verifyQuestionInInstrument(`${testQuestionIdSeed}_02`, done);
  });
  it('should delete a question', (done) => {
    question.delete(`${testQuestionIdSeed}_02`, done);
  });
  it('the newly deleted question should not exist', (done) => {
    const questionId = `${testQuestionIdSeed}_02`;
    question.verifyQuestionNotInInstrument(questionId, done);
  });
  describe('add multiple questions to first section', () => {
    const questions = [
      {
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
    it('should add more questions to the first section', (done) => {
      questions.forEach((options) => {
        question.openQuestionCreator()
                    .call(() => { question.create(options); });
      });
      client.call(done);
    });
    it('the newly created questions should exist', (done) => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
      client.call(done);
    });
  });
  describe('add multiple questions to second section', () => {
    const questions = [
      {
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
    it('should navigate to the second section', (done) => {
      instrument.gotoSection(`${sectionLabelSeeds[1]} label`, done);
    });
    it('should add more questions to the second section', (done) => {
      questions.forEach((options) => {
        question.openQuestionCreator()
                    .call(() => { question.create(options); });
      });
      client.call(done);
    });
    it('the newly created questions should exist', (done) => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
      client.call(done);
    });
  });
  describe('add multiple questions to likert section', () => {
    const questions = [
      {
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
    it('should navigate to the third section', (done) => {
      instrument.gotoSection(`${sectionLabelSeeds[2]} label`, done);
    });
    it('should add questions to the third section', (done) => {
      questions.forEach((options) => {
        question.openQuestionCreator()
                    .call(() => { question.create(options); });
      });
      client.call(done);
    });
    it('the newly created questions should exist', (done) => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
      client.call(done);
    });
    it('should duplicate the question', (done) => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_11`, done);
    });
    it('the newly duplicated question should exist', (done) => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_11`, done);
    });
    it('should duplicate the question', (done) => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_12`, done);
    });
    it('the newly duplicated question should exist', (done) => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_12`, done);
    });
    it('should duplicate the question', (done) => {
      question.duplicate(`${testQuestionIdSeed}_10`, `${testQuestionIdSeed}_13`, done);
    });
    it('the newly duplicated question should exist', (done) => {
      question.verifyQuestionInInstrument(`${testQuestionIdSeed}_13`, done);
    });
  });
  describe('add questions to side by side section', () => {
    const questions = [
      {
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
    it('should navigate to the fifth section', (done) => {
      instrument.gotoSection(`${sectionLabelSeeds[4]} label`, done);
    });
    it('should add questions to the fifth section', (done) => {
      questions.forEach((options) => {
        question.openQuestionCreator()
                    .call(() => { question.create(options); });
      });
      client.call(done);
    });
    it('the newly created questions should exist', (done) => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
      client.call(done);
    });
  });
  describe('add a question to the sacraficial section', () => {
    const questions = [
      {
        questionId: `${testQuestionIdSeed}_20`,
        label: 'selenium sxs text question label',
        saLabel: 'selenium sxs text question SA label',
        sectionId: `${sectionLabelSeeds[6]} label`,
        maxInstances: 1,
        description: 'selenium sxs text question description',
      },
    ];
    it('should navigate to the sacraficial section', (done) => {
      instrument.gotoSection(`${sectionLabelSeeds[6]} label`, done);
    });
    it('should add questions to the sacraficial section', (done) => {
      questions.forEach((options) => {
        question.openQuestionCreator()
                    .call(() => { question.create(options); });
      });
      client.call(done);
    });
    it('the newly created questions should exist', (done) => {
      questions.forEach((options) => {
        question.verifyQuestionInInstrument(options.questionId);
      });
      client.call(done);
    });
  });
  it('should delete sacraficial section');
  it('should delete sacraficial section with questions: reassign quesitons');
});
