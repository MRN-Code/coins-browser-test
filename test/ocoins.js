'use strict';

/* globals browser */

const nav = require('./lib/nav/navigation.js')(browser);
const micis = require('./lib/auth/micis.js')(browser);
const ocoins = require('./lib/ocoins.js')(browser);

describe('ocoins', function ocoinsTest() {
  this.timeout(600000);

  before('initialize', () => {
    if (!micis.loggedOn) {
      micis.logon();
    }
    nav.gotoOcoins();
    ocoins.configure.purgeDbs();
  });

  describe('caching', () => {
    it('caches app assets in the AppCache', () => {
      browser.waitForCondition(() => { // eslint-disable-line consistent-return
        /* eslint-disable no-undef */
        const cacheStatus = document.querySelector('#ocoins-appcache-status');
        /* eslint-enable no-undef */
        if (cacheStatus) {
          return cacheStatus.innerText === 'OK';
        }
      }, null, {
        timeout: 40000,
      });
    });

    it('caches non-asset data, studies & instruments, in browser storage (data entry)', () => {
      ocoins.configure.cacheStudy('RioArribaCo', 'data-entry'); // tiny study w/ just 1 instrument
      ocoins.configure.deleteStudy('RioArribaCo');
    });

    it('caches non-asset data, studies & instruments, in browser storage (self assess)', () => {
      ocoins.configure.cacheStudy('RioArribaCo', 'self-assess'); // tiny study w/ just 1 instrument
      ocoins.configure.deleteStudy('RioArribaCo');
    });

    it('can launch ocoins with configured studies', () => {
      ocoins.configure.cacheStudy('RioArribaCo'); // tiny study w/ just 1 instrument
      ocoins.configure.openOcoins();
    });
  });
});
