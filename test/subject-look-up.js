'use strict';

/**
 * Test the 'Look Up a Subject' feature.
 */

var config = require('config');
var client = require('./lib/client.js').client;
var micis = require('./lib/auth/micis.js')(client);
var nav = require('./lib/nav/navigation.js')(client, config);
var should = require('should');

describe('subject look up', function () {
    this.timeout(config.defaultTimeout);
   
    before('initialize', function (done) {
        client.clientReady.then(function () {
            if (!micis.loggedOn) {
                micis.logon();
            }
            
            nav.micisMenu.clickNested('Look Up a Subject').call(done);
        });
    });
    
    /** Test the 'email' field's search functionality */
    it('should show results for email lookup', function (done) {
        /** Known test user on NITEST study */
        var testUser = {
            firstName: 'Icare',
            lastName: 'Test',
            email: 'icaretestursi@mrn.org'
        };
        
        client
            .setValue('#email', testUser.email)
            .click('#frmFindSubject .ui-button-success')
            .waitForPaginationComplete()
            .waitFor('.box-container .objbox', 4000)
            .getText('.objbox > table tr:nth-child(2)', function (err, text) {
                if (err) {
                    throw err;
                }
                
                should(
                    text.indexOf(testUser.firstName) !== -1 &&
                    text.indexOf(testUser.lastName) !== -1
                ).be.ok;
            })
            .call(done);        
    });
});
