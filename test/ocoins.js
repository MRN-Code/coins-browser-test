'use strict';
var _ = require('lodash');
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var nav = require('./lib/nav/navigation.js')(client, config);

var micis = require('./lib/auth/micis.js')(client);
var ocoins = require('./lib/ocoins.js')(client);

describe('ocoins', function() {
    this.timeout(config.defaultTimeout);

    before('initialize', function(done) {
        client.clientReady.then(function boot() {
            if (!micis.loggedOn) { micis.logon(); }
            nav.gotoOcoins();
            ocoins.configure.purgeDbs();
            client.call(done);
        });
    });

    describe('caching', function() {

        it('caches app assets in the AppCache', function(done) {
            client.waitForCondition(function testOcoinsAssetsCached() {
                var cacheStatus = document.querySelector('#ocoins-appcache-status');
                if (cacheStatus) {
                    return cacheStatus.innerText === 'OK';
                }
            }, null, 40000)
            .call(done);
        });

        it('caches non-asset data, studies & instruments, in browser storage (data entry)', function(done) {
            ocoins.configure.cacheStudy('RioArribaCo', 'data-entry'); // tiny study w/ just 1 instrument
            ocoins.configure.deleteStudy('RioArribaCo');
            client.call(done);
        });

        it('caches non-asset data, studies & instruments, in browser storage (self assess)', function(done) {
            ocoins.configure.cacheStudy('RioArribaCo', 'self-assess'); // tiny study w/ just 1 instrument
            ocoins.configure.deleteStudy('RioArribaCo');
            client.call(done);
        });

        it('can launch ocoins with configured studies', function(done) {
            ocoins.configure.cacheStudy('RioArribaCo'); // tiny study w/ just 1 instrument
            ocoins.configure.openOcoins();
            client.call(done);
        });

    });

});
