'use strict';

const asmtMenu = require('./asmtMenu.js');
const micisMenu = require('./micisMenu.js');

module.exports = (client, config) => {
  const me = {};

  // disable COINS navigation alerts when changing pages
  /* global window */
  me.disableNavigationAlert = () => client.execute(() => {
    if (window.preventExitPopup === undefined) {
      /* eslint-disable no-alert */
      window.alert('EXPECTED `preventExitPopup` set in pagination.js');
      /* eslint-enable no-alert */
    }
    window.preventExitPopup = true;
  });

  me.micisMenu = micisMenu(client, config);
  me.asmtMenu = asmtMenu(client, config);

  me.hoverHome = () => {
    client.waitForVisible('a.primary-nav-menu-button');
    return client
    .element('a.primary-nav-menu-button')
    .scroll()
    .click('=Menu');
  };

  me.gotoAsmt = () => {
    me
      .hoverHome()
      .click('=ASMT')
      .waitForPaginationComplete();
  };

  me.gotoOcoins = () => client
    .url(`https://${config.origin}/micis/index.php?subsite=ocoins_beta`)
    .waitForPaginationComplete();

  me.goToQueryBuilder = () => {
    client
      .scroll(0, 0);
    me.hoverHome()
      .click('=Query Builder')
      .waitForPaginationComplete();
  };

  me.selectAsmtStudy = (studyId) => {
    client
      .waitForPaginationComplete();
    client
      .selectByValue('#asmt_study_id', studyId)
      .waitForPaginationComplete();
  };
  return me;
};
