'use strict';
// test deps
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;

var nav = require('./lib/nav/navigation.js')(client, config);
var instrument = require('./lib/instrument.js')(client, config);

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

var timeoutDur = 25000;

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
        client.end(done);
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
    it('should create a section');
    it('should create another section');
    it('should create a likert section');
    it('should create a table section');
    it('should create a side by side section');
    it('should create a sacraficial section');
    it('should create a sacraficial section with questions');
    it('should add questions to first section');
    it('should add questions to second section');
    it('should add questions to likert section');
    it('should add table to table section');
    it('should add questions to side by side section');
    it('should delete sacraficial section');
    it('should delete sacraficial section with questions: reassign quesitons');
});
