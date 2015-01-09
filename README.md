# coins-selenium
Front End Automated Page Script Tests for COINS.  **mocha**-wrapped-**webdriverio**-wrapped-**selenium** unit tests!

# Setup

1. Clone repo to your local machine, as you will be running the test server on your own machine.
1. `cd coins-selenium`
1. Install repo dependencies, `npm i`
1. Ensure mocha is install, `npm i -g mocha`
1. Download the standalone server, `wget http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar --no-check-certificate`
1. Move `config/default.json.example` to `config/default.json`.  Update all fields to match your configuration.

# Usage - Running Tests
1. Ensure the repo is always up-to-date to get the latest tests
1. Start the selenium server, `java -jar selenium-server-standalone-2.44.0.jar`
1. Run your tests
    1. `mocha --recursive --bail --reporter spec`, or
    1. `mocha --reporter yourFavoriteReporter path/to/test`

<img src="https://raw.githubusercontent.com/MRN-Code/coins-selenium/master/img/test_example_output.png" height="200"  >


# Usage - Designing Tests
1. Place tests in dominant categorical subdirectory folders inside the `test` dir.
1. Write your tests as **mocha unit tests**, with the actual browser driver functionality attached to `module.exports`.  Refer the [webdriverio](http://webdriver.io/) docs for the selenium-browser driving API.
    1. This pattern allows each file to be run as a unit test, and to permit `require`ing browser actions *without* executing them in depedenent tests.  **It is not required** that pure browser actions have associated unit tests.
    1. Consider the usage of `me` in the below example.  These files will commonly have 3+ nested scopes.  `self` or `_this` shall be used inside the mocha test blocks, but export-level references shall refer to the `me` for consistency. 

```js
"use strict";
// test deps
var config = require('config');
var should = require('should');

// webdriver deps
var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

// exports
var me = {};
module.exports = me;

// test
var timeoutDur = 15000;
describe('micis logon', function() {
    var block = this;
    this.timeout(timeoutDur);
    var client = {};

    before(function(done){
        client = webdriverio.remote(options);
        client.init(done);
    });

    it('should logon', function(done) {
        me
            .logon(client)
            .end(done);
    });

    it('should set auth cookies'); // define pending tests, i.e. need to be written or are being ignored
});

// Expose driver logic.  Pass your own client instance in!
me.logon = function(client) {
    return client
        .url('https://' + config.origin + '/micis/index.php')
        .setValue('#loginPopupUsername', config.auth.un)
        .setValue('#loginPopupPassword', config.auth.pw)
        .click('#submitBtn')
        .waitFor('#page-container', timeoutDur);
};
```

# ToDo
1. Put selenium server on lintcoin

