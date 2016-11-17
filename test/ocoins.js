'use strict';

const config = require('config');
const should = require('should');

const client = require('./lib/client.js').client;
const nav = require('./lib/nav/navigation.js')(client, config);

const micis = require('./lib/auth/micis.js')(client);
const ocoins = require('./lib/ocoins.js')(client);

describe('ocoins', () => {
  this.timeout(config.defaultTimeout);

  before('initialize', (done) => {
    client.clientReady.then(() => {
      if (!micis.loggedOn) { micis.logon(); }
      nav.gotoOcoins();
      ocoins.configure.purgeDbs();
      client.call(done);
    });
  });

  describe('caching', () => {
    it('caches app assets in the AppCache', (done) => {
      client.waitForCondition(() => { // eslint-disable-line consistent-return
        /* eslint-disable no-undef */
        const cacheStatus = document.querySelector('#ocoins-appcache-status');
        /* eslint-enable no-undef */
        if (cacheStatus) {
          return cacheStatus.innerText === 'OK';
        }
      }, null, 40000)
            .call(done);
    });

    it('caches non-asset data, studies & instruments, in browser storage (data entry)', (done) => {
      ocoins.configure.cacheStudy('RioArribaCo', 'data-entry'); // tiny study w/ just 1 instrument
      ocoins.configure.deleteStudy('RioArribaCo');
      client.call(done);
    });

    it('caches non-asset data, studies & instruments, in browser storage (self assess)', (done) => {
      ocoins.configure.cacheStudy('RioArribaCo', 'self-assess'); // tiny study w/ just 1 instrument
      ocoins.configure.deleteStudy('RioArribaCo');
      client.call(done);
    });

    it('can launch ocoins with configured studies', (done) => {
      ocoins.configure.cacheStudy('RioArribaCo'); // tiny study w/ just 1 instrument
      ocoins.configure.openOcoins();
      client.call(done);
    });
  });
});
