'use strict';
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);
var subject = require('./lib/subject.js')(client, config);

require('./logon.js');
describe('subject', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        client.clientReady.then(done);
    });

    it('should be add-able', function(done) {
        nav.micisMenu
            .clickNested('Enter a New Subject');
        // assert proper defaults are set
        // fill form
        subject.newSubject.fillForm(done);
        // test good and bogus values pre submit
        // submit
    });

});
