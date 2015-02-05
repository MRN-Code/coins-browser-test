'use strict';
var config = require('config');
var should = require('should');

var client = require('../lib/client.js').client;
var auth = require('../lib/auth/micis.js')(client, config);
var logon = require('../logon.js');

// TODO delete - tests shouldnt be driving us around..
var nav = require('../lib/navigation.js')(client, config);

var timeoutDur = 25000;

describe('subject', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        client.clientReady.then(done);
    });

    it('should be add-able', function(done) {
        nav.goto.menu.subjects.addNew.end(done);
    });

});
