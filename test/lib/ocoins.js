'use strict';

const navigation = require('./nav/navigation.js');
const url = require('url');

module.exports = (client) => {
  const nav = navigation(client);

  const me = {
    configure: {},
    app: {},
  };

  me.configure.cacheStudy = (studyName, mode = 'data-entry') => {
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

  me.configure.clickCacheFirstRow = () => {
    const path = '//table[@id=\'ocoins_study_config_table\']/tbody/tr/td/button';
    client
      .element(path)
      .scroll()
      .click(path)
      .waitForExist('#study_cache_details_container', 10000);
  };

  me.configure.deleteFirstRow = () => {
    const path = '//button[./*[contains(., \'Delete\')]]';
    client
      .element(path)
      .scroll()
      .click(path)
      .click('//div[contains(@class, \'ui-dialog\')]/button[contains(., \'Delete\')]')
      .pause(1100); // wait for fade to finish
    client.waitForVis('#ocoins_study_config_table_wrapper', 20000);
  };

  me.configure.clickCacheDataEntry = () => {
    const path = '//button[./*[contains(., \'Data Entry\')]]';
    return me.configure.clickCacheModeButton(path);
  };

  me.configure.clickCacheSelfAssess = () => {
    const path = '//button[./*[contains(., \'Self Asses\')]]';
    return me.configure.clickCacheModeButton(path);
  };

  me.configure.clickCacheModeButton = (path) => {
    client
      .element(path)
      .scroll()
      .waitForEnabled(path, 10000);
    client
      .click(path)
      .waitForExist('//button[./*[contains(., \'Delete\')]]', 60000);
  };
  me.configure.deleteStudy = () => {
    me.configure.filterByName('RioArribaCo');
    me.configure.deleteFirstRow();
    me.configure.filterByName('');
  };

  /**
   * Filters the jq-dt studies list by provided nime
   * @param  {string} name
   * @return {WebdriverIO} client
   */
  me.configure.filterByName = (name) => {
    const path = '#ocoins_study_config_table_filter input[type=search]';
    client.waitForVis(path);
    return client
      .element(path)
      .scroll()
      .setValue(path, name);
  };

  me.configure.openOcoins = () => {
    nav.disableNavigationAlert();
    client.url(url.format({
      protocol: 'https',
      host: client.options.baseUrl,
      pathname: 'oCoins/app',
    }));
    return me.app.waitForBootstrapped();
  };

  /**
   * Purges all ocoins dbs, regardless of what mode they are stored in
   * on the client (WebSQL, indexeddb, localstorage, etc)
   * @return {WebdriverIO} client
   */
  me.configure.purgeDbs = () => client.waitForCondition(() => {
    /* eslint-disable no-underscore-dangle */
    /* global window, coinsUtils, dbc:true */
    // delete oCoins dbs.  when completed on subsequent polling
    // call, this fn returns true, and removes global state
    if (!window.OCoinsDBClient || window.__purgingOcoinsDbs) {
      return;
    } else if (window.__purgedOcoinsDbs) {
      delete window.__purgedOcoinsDbs;

      return true; // eslint-disable-line consistent-return
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
    /* eslint-enable no-underscore-dangle */
  }, null, {
    timeout: 10000,
  });

  me.app.waitForBootstrapped = () => client.pause(3000);

  return me;
};
