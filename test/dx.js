// Test for Data Exchange

var config = require('config');
var client = require('./lib/client').client;
var nav    = require('./lib/nav/navigation')(client, config);
var micis  = require('./lib/auth/micis')(client);
var should = require('should');


describe('Test data exchange functionality', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) {
                micis.logon();
            }

            client.call(done);
        });
    });

    it('should be accessible', function(done) {
        nav.micisMenu
            .clickNested('Browse Available Data')
            .call(done);
    });

    it('should load templates', function(done) {
        client
            .elements("#requestMenu option", function(error, response) {
                response.value.length.should.be.greaterThan(1);
            });

        client.call(done);
    });

    it('should load four modalities', function(done) {
        client.pause(1000);
        client.getText('.statisticsLabel label', function(error, response) {
            var modalities = [];
            response.forEach(function(text) { modalities.push(text); });            
            ['MR', 'Assessments', 'Studies', 'Subjects'].forEach(function(modality) {
                modalities.should.containEql(modality);
            });
        });

        client.call(done);
    });
});
