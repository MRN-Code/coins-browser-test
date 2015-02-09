'use strict';
// test deps
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;

var nav = require('./lib/nav/navigation.js')(client, config);
var instrument = require('./lib/instrument.js')(client, config);
var section = require('./lib/section.js')(client, config);
var question = require('./lib/question.js')(client, config);

var instOptions = {
    label: "selenium test instrument label",
    saLabel: "selenium test instrument SA label",
    description: "selenium test instrument description",
    crNotice: "selenium test instrument copyright notice",
    version: "1.0",
    maxPerSegment: "100",
    skipQuestionText: "selenium test instrument skip question text",
    hideSaPrevious: "0",
    saHideSkippedQuestions: "0",
    lock: "0"
};

var editInstOptions = {
    label: "selenium test instrument label edit",
    saLabel: "selenium test instrument SA label edit",
    description: "selenium test instrument description edit",
    crNotice: "selenium test instrument copyright notice edit",
    version: "2.0",
    maxPerSegment: "10",
    skipQuestionText: "selenium test instrument skip question text edit",
    hideSaPrevious: "1",
    saHideSkippedQuestions: "1",
    lock: "1"
};

var testQuestionIdSeed = 'SELENIUM11';

var sectionLabelSeeds = [
"selenium 1q/page section",
"selenium 3q/page section",
"selenium 3q/page Likert section",
"selenium 4q/page TABLE section",
"selenium 4q/page SXS section",
"selenium 1q/page sacraficial section",
"selenium 1q/page sacraficial section with questions"
]

var timeoutDur = 90000;

//include pre-requisite tests
require('./logon.js');
require('./navigateToAsmt.js');

describe('instrument', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        client.clientReady.then(done);
    });

    after('close client', function(done) {
       // client.end(done);
       done();
    });

    it('should load create instrument form', function(done) {
        nav.asmtMenu.clickNested('Create Instrument', done);
    });

    it('should create a new instrument', function(done) {
        instrument.create(instOptions, done)
    });

    it('should load the new instrument', function(done) {
        var validate = function(err, instObj) {
            instOptions.should.be.eql(instObj);
            done();
        };
        instrument.fromHtml(validate);
    });

    it('should allow the new instrument to be edited', function(done) {
        instrument.edit(editInstOptions, done);
    });

    it('should load the edited instrument properties', function(done) {
        var validate = function(err, instObj) {
            editInstOptions.should.be.eql(instObj);
            done();
        };
        instrument.fromHtml(validate);
    });
    it('should print the instrument_id in a hidden field', function(done) {
        instrument.setInstrumentIdFromPage(done);
    });
    it('should navigate to instrument list', function(done) {
        nav.asmtMenu.clickNested('List Instruments', done);
    });
    it('should locate the newly created instrument', function(done) {
        instrument.filterList(instrument.instrumentId, done);
    });
    it('should unlock the instrument', function(done) {
        instrument.toggleLockFromList(instrument.instrumentId, done);
    });
    it('should open instrument editor from list', function(done) {
        instrument.gotoEditFromList(instrument.instrumentId, done);
    });
    it('should open the section editor', function(done) {
        section.openSectionEditor(done);
    });
    it('should create a section', function(done) {
        var seed = sectionLabelSeeds[0];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '1'
        }
        section.create(options, done);
    });
    it('should create another section', function(done) {
        var seed = sectionLabelSeeds[1];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '3'
        }
        section.create(options, done);
    });
    it('should create a likert section', function(done) {
        var seed = sectionLabelSeeds[2];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '3',
            likertGrid: undefined
        }
        section.create(options, done);
    });
    it('should create a table section', function(done) {
        var seed = sectionLabelSeeds[3];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '4',
            tableType: undefined
        }
        section.create(options, done);
    });
    it('should create a side by side section', function(done) {
        var seed = sectionLabelSeeds[4];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '4',
            multiInstGrid: undefined
        }
        section.create(options, done);
    });
    it('should create a sacraficial section', function(done) {
        var seed = sectionLabelSeeds[5];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '1'
        }
        section.create(options, done);
    });
    it('should create a sacraficial section with questions', function(done) {
        var seed = sectionLabelSeeds[6];
        var options = {
            label: seed + ' label',
            desc: seed + ' desc',
            saLabel: seed + ' SA label',
            saDesc: seed + ' SA desc',
            saQuestionsPerPage: '1'
        }
        section.create(options, done);
    });
    it('should close the section editor', function(done) {
        section.closeSectionEditor(done);
    });
    it('should open the question creation form', function(done) {
        question.openQuestionCreator(done);
    });
    it('should add a question to first section', function(done) {
        var options = {
            questionId: testQuestionIdSeed + '_01',
            label: 'selenium text question label',
            saLabel: 'selenium text question SA label',
            sectionId: sectionLabelSeeds[0] + ' label',
            maxInstances: 1,
            description: 'selenium text question description'
        };
        question.create(options, done);
    });
    it('the newly added question should exist', function(done) {
        question.verifyQuestionInInstrument(testQuestionIdSeed + '_01', done);
    });
    it('should duplicate the question', function(done) {
        question.duplicate(testQuestionIdSeed + '_01', testQuestionIdSeed + '_02', done);
    });
    it('the newly duplicated question should exist', function(done) {
        question.verifyQuestionInInstrument(testQuestionIdSeed + '_02', done);
    });
    it('should delete a question', function(done) {
        question.delete(testQuestionIdSeed + '_02', done);
    });
    it('the newly deleted question should not exist', function(done) {
        var questionId = testQuestionIdSeed + '_02';
        question.verifyQuestionNotInInstrument(questionId, done);
    });
    describe('add multiple questions to first section', function() {
        var questions = [
            {
                questionId: testQuestionIdSeed + '_02',
                label: 'selenium text question label',
                saLabel: 'selenium text question SA label',
                sectionId: sectionLabelSeeds[0] + ' label',
                maxInstances: 1,
                description: 'selenium text question description'
            },
            {
                questionId: testQuestionIdSeed + '_03',
                label: 'selenium text question label',
                saLabel: 'selenium text question SA label',
                sectionId: sectionLabelSeeds[0] + ' label',
                maxInstances: 1,
                description: 'selenium text question description'
            }
        ];
        it('should add more questions to the first section', function(done) {
            questions.forEach(function(options) {
                question.openQuestionCreator()
                    .call(function() {question.create(options);})
            });
            client.call(done);
        });
        it('the newly created questions should exist', function(done) {
            questions.forEach(function(options) {
                question.verifyQuestionInInstrument(options.questionId);
            });
            client.call(done);
        });
    });
    describe('add multiple questions to first section', function() {
        var questions = [
            {
                questionId: testQuestionIdSeed + '_04',
                label: 'selenium text question label',
                saLabel: 'selenium text question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium text question description'
            },
            {
                questionId: testQuestionIdSeed + '_05',
                label: 'selenium text question label',
                saLabel: 'selenium text question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium text question description'
            },
            {
                questionId: testQuestionIdSeed + '_06',
                label: 'selenium text question label',
                saLabel: 'selenium text question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium text question description'
            },
            {
                questionId: testQuestionIdSeed + '_07',
                label: 'selenium canned response question label',
                saLabel: 'selenium canned response question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium canned response question description',
                cannedTypeToggle: undefined,
                addQuestionResponseLabel1: 'Ja',
                addQuestionResponseDesc1: 'German for yes',
                addQuestionResponseValue1: 1,
                addQuestionResponseLabel2: 'Nein',
                addQuestionResponseDesc2: 'German for no',
                addQuestionResponseValue2: 0
            },
            {
                questionId: testQuestionIdSeed + '_08',
                label: 'selenium canned response question label',
                saLabel: 'selenium canned response question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium canned response question description',
                cannedTypeToggle: undefined,
                previousResponses: undefined
            },
            {
                questionId: testQuestionIdSeed + '_09',
                label: 'selenium canned response question label',
                saLabel: 'selenium canned response question SA label',
                sectionId: sectionLabelSeeds[1] + ' label',
                maxInstances: 1,
                description: 'selenium canned response question description',
                cannedTypeToggle: undefined,
                previousResponses: true
            }
        ];
        it('should navigate to the second section', function(done) {
            instrument.gotoSection(sectionLabelSeeds[1] + ' label', done);
        });
        it('should add more questions to the second section', function(done) {
            questions.forEach(function(options) {
                question.openQuestionCreator()
                    .call(function() {question.create(options);})
            });
            client.call(done);
        });
        it('the newly created questions should exist', function(done) {
            questions.forEach(function(options) {
                question.verifyQuestionInInstrument(options.questionId);
            });
            client.call(done);
        });
    });
    it('should add questions to likert section');
    it('should add table to table section');
    it('should add questions to side by side section');
    it('should delete sacraficial section');
    it('should delete sacraficial section with questions: reassign quesitons');
});
