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

  me.hoverHome = done => client
    .moveToObject('a.primary-nav-menu-button')
    .click('=Menu', done);

  me.gotoAsmt = done => client
    .call(me.hoverHome)
    .click('=ASMT')
    .waitForPaginationComplete(done);

  me.gotoOcoins = done => client
    .url(`https://${config.origin}/micis/index.php?subsite=ocoins_beta`)
    .waitForPaginationComplete(done);

  me.goToQueryBuilder = done => client
    .scroll(0, 0)
    .call(me.hoverHome)
    .click('=Query Builder')
    .waitForPaginationComplete(done);

  me.selectAsmtStudy = (studyId, done) => client
    .waitForPaginationComplete()
    .selectByValue('#asmt_study_id', studyId)
    .waitForPaginationComplete(done);

  return me;
};
