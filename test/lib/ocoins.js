

const _ = require('lodash');
const noop = function () {};
const url = require('url');

module.exports = function (client, config) {
  const nav = require('./nav/navigation.js')(client, config);

  const me = {
    configure: {},
    app: {},
  };

  me.configure.cacheStudy = function (studyName, mode) {
    mode = mode || 'data-entry';
    me.configure.filterByName(studyName);
    client.pause(100);
    me.configure.clickCacheFirstRow();
    if (mode === 'data-entry') {
      me.configure.clickCacheDataEntry();
    } else if (mode === 'self-assess') {
      me.configure.clickCacheSelfAssess();
    } else {
      throw new TypeError(`${'cacheStudy only supports `data-entry` and ' +
                '`self-assess` cache modes.  Received: '}${toString(mode)}`);
    }
    me.configure.filterByName('');
  };

  me.configure.clickCacheFirstRow = function () {
    const path = '//table[@id=\'ocoins_study_config_table\']/tbody/tr/td/button';
    return client
            .moveToObject(path)
            .click(path)
            .waitForExist('#study_cache_details_container', 10000);
  };

  me.configure.deleteFirstRow = function () {
    const path = '//button[./*[contains(., \'Delete\')]]';
    return client
            .moveToObject(path)
            .click(path)
            .click('//div[contains(@class, \'ui-dialog\')]/button[contains(., \'Delete\')]')
            .pause(1100) // wait for fade to finish
            .waitForVis('#ocoins_study_config_table_wrapper', 20000);
  };

  me.configure.clickCacheDataEntry = function () {
    const path = '//button[./*[contains(., \'Data Entry\')]]';
    return me.configure.clickCacheModeButton(path);
  };

  me.configure.clickCacheSelfAssess = function () {
    const path = '//button[./*[contains(., \'Self Asses\')]]';
    return me.configure.clickCacheModeButton(path);
  };

  me.configure.clickCacheModeButton = function (path) {
    return client
            .moveToObject(path)
            .waitForEnabled(path, 10000)
            .click(path)
            .waitForExist('//button[./*[contains(., \'Delete\')]]', 60000);
  };

  me.configure.deleteStudy = function (studyName) {
    me.configure.filterByName('RioArribaCo');
    me.configure.deleteFirstRow();
    me.configure.filterByName('');
  };

    /**
     * Filters the jq-dt studies list by provided nime
     * @param  {string} name
     * @return {WebdriverIO} client
     */
  me.configure.filterByName = function (name) {
    const path = '#ocoins_study_config_table_filter input[type=search]';
    return client
            .waitForVis(path)
            .moveToObject(path)
            .setValue(path, name);
  };

  me.configure.openOcoins = function () {
    const linkPath = '//div[@id="ocoins_study_config_container"]/*/a[contains(., "offline entry")]';
    const config = require('config');
    const nav = require('./nav/navigation.js')(client);
    nav.disableNavigationAlert();
    client.url(url.format({
      protocol: 'https',
      host: config.origin,
      pathname: 'oCoins/app',
    }));
    return me.app.waitForBootstrapped();
  };
    /**
     * Purges all ocoins dbs, regardless of what mode they are stored in
     * on the client (WebSQL, indexeddb, localstorage, etc)
     * @return {WebdriverIO} client
     */
  me.configure.purgeDbs = function () {
    return client.waitForCondition(() => {
            // delete oCoins dbs.  when completed on subsequent polling
            // call, this fn returns true, and removes global state
      if (!window.OCoinsDBClient || window.__purgingOcoinsDbs) {
        return;
      } else if (window.__purgedOcoinsDbs) {
        delete window.__purgedOcoinsDbs;
        return true;
      }

      dbc = new window.OCoinsDBClient();
      window.__purgingOcoinsDbs = dbc.clear(true).then(() => {
        delete window.__purgingOcoinsDbs;
        window.__purgedOcoinsDbs = true;
        coinsUtils.notify.push({
          body: 'dbs cleared',
          className: 'info',
          alt: true,
        });
      });
    }, null, 10000);
  };


  me.app.waitForBootstrapped = function () {
        // return client.waitForCondition(function() {
        //     return angular.element(document).scope();
        // }, null, { timeout: 5000 });
    return client.pause(3000);
  };

  return me;
};
