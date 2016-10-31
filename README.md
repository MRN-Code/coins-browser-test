# coins-browser-test
Front End Automated Page Script Tests for COINS.  **mocha**-wrapped-**webdriverio**-wrapped-**selenium** unit tests!

# Setup

### Developer
1. Clone repo to your local machine, as you will be running the test server on your own machine.
1. `cd coins-browser-test`
1. Install repo dependencies, `npm i`
1. Ensure mocha is installed, `npm i -g mocha` _(Note: you'll need mocha@2.x.x)_
1. Download the standalone server:
    * `wget https://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar --no-check-certificate`
    * OR: `curl -O https://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar`
    * Note: 2.44 does **not** work with phantomjs.  Use 2.43 instead.
1. Move `config/default.json.example` to `config/default.json`.  Update all fields to match your configuration.

#### Chrome Driver

If you stick with the example configuration, you’ll need Selenium’s Chrome Webdriver. Download it [via the official downloads page](https://sites.google.com/a/chromium.org/chromedriver/downloads) and place it in the project root.

### Server
1. Currently, you must run your own selenium server locally.  A COINS specific selenium host is in work, running multiple browsers.

# Usage - Running Tests
1. Ensure the repo is always up-to-date to get the latest tests
1. Start the selenium server, `npm start` (or `java -jar selenium-server-standalone-2.43.1.jar`)
1. Run your tests
    1. `mocha --recursive --bail --reporter spec`, or
    1. `mocha --reporter yourFavoriteReporter path/to/test`, or
    1. `mocha path/to/test.js path/to/other/test.js`

<img src="https://raw.githubusercontent.com/MRN-Code/coins-selenium/master/img/test_example_output.png" height="200"  >

# Usage - re-using the web browser client

In most cases, we will want to run all of our tests in a single browser instance.
For example, we will want to start a browser, login to COINS, then navigate to ASMT, then select a study, then create an instrument, etc...

In order to modularize the client creation process, `test/lib/client.js` was created.
Simply require `./lib/client.js` into each of your test scripts.
A promise is exported along with the client, which allows us to wait until the client is ready before kicking off our tests.
Example:
```js
//get client
var Config = require('config');
var Client = require('./lib/client.js');
var client = Client.client;

// get browser actions: note that the client is passed as a param
var Auth = require('./lib/auth/micis.js')(client, Config);

// create test case
describe('micis logon', function() {
    this.timeout(timeoutDur);

    before('initialize', function(done) {
        // wait for client to be ready before testing
        Client.clientReady.then(done);
    });

    it('should logon', function(done) {
        Auth.logon(done);
    });
});
```

# Usage - Navigating within COINS
COINS is a single page app of sorts, and utilizes its own home-grown pagination system.
As a result, selenium and webdriverio **do not have any idea when a new page is finished loading, and ready to ispect/interact with**.
To work around this, we have added a helper function called **waitForPaginationComplete**, which will wait until COINS has loaded the next page.

To use **waitForPaginationComplete** simply include util/client.js, which will add the function to the webdriverio client.
To use **waitForPaginationComplete** without client.js, do the following:

```js
var Webdriverio = require('webdriverio');
var PaginationUtils = require('./../util/pagination.js'); // assumes this is run from test/ dir
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

var client = Webdriverio.remote(options);
PaginationUtils(client);
```

## Going to ASMT:
Either require `test/navigateToAsmt.js` in your mocha test, or use the `test/lib/nav/navigate.js` library:

```js
require('./lib/nav/navigation.js');
it ('should go to asmt and select study_id 1234', function(done) {
    nav.gotoAsmt();
    nav.selectAsmtStudy(1234, done);
});
```

## Clicking on menu links:
Use either micisMenu.js or asmtMenu.js in `test/lib/nav/`. The `menuMap` in each of these files still needs to be built up, but I will leave it up to us to build it up as needed, rather than building them all at once.  Example:

```js
    nav.asmtMenu.clickNested('Create Instrument', done);
```

# Usage - Designing Tests
1. There are two components to a test:
    1. Browser actions defined in `test/lib`
    1. Mocha test suites that use the browser actions (defined in `test/*`)
1. Place tests and actions in dominant categorical subdirectory folders inside the `test` and `test/lib` dirs, respectively.
    1. Browser actions:
        1. Write your browser functionality in js files within `test/lib/[category]`.
        1. Each file should export a function with the following signature:
        ` module.exports = function(client, config) { `
        1. That function should return an object whose properties are functions to perform granular actions.
    1. Tests:
        1. Write your tests in js files within `test/`
        1. Each file should create a client (see above), require the Config,
        1. Additionally, each test should define at least one testsuite that sets a timeout and a `before` action that ensures the client is initialized:
        ```js
        describe('micis logon', function() {
            this.timeout(timeoutDur);

            before('initialize', function(done) {
                // wait for client to be ready before testing
                Client.clientReady.then(done);
            });
            ...
        });
        ```
# Examples
See `test/logon.js` and `test/lib/auth/micis.js` for a simple example.

Write your tests as **mocha unit tests**, with the actual browser driver functionality attached to `module.exports`.  Refer the [webdriverio](http://webdriver.io/) docs for the selenium-browser driving API.

# ToDo
1. Put selenium server on lintcoin

