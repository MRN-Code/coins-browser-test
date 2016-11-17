/**
 * menu.js shall not be called directly.  xxxMenu.js files shall require this file
 * to extend each particular menu's functionality
 *
 * e.g.
 * ```js
 * module.exports = function(client, config) {
 *     return require('./menu.js')(client, config, menuMap);
 * };
 */


const _ = require('lodash');

module.exports = function (client, config, menuMap) {
  const me = {};

    // put menuMap in public scope
  me.menuMap = menuMap;

  me.findLink = function (text) {
    const findTextRecursive = function (obj) {
      let children;
      if (obj.text === text) {
        return true;
      }
      if (obj.children) {
        return obj.children.some(findTextRecursive);
      }
      return false;
    };
    return menuMap.filter(findTextRecursive);
  };

  me.clickNested = function (text, done) {
    done = done || _.noop;

        // Get top level menu item
    const parent = me.findLink(text)[0];
        // Ensure that top level menu item can be located
    if (!parent) {
      throw new Error(`could not locate menu item with text \`${text}\`.  Was it added to the menu map file?`);
    }

        // hover over top level menu item before clicking on child
    return client
            .moveToObject(`=${parent.text}`, 10, 10)
            .click(`=${parent.text}`)
            .click(`=${text}`)
            .waitForPaginationComplete()
            .click('.site-header') // Close the menu by clicking the banner
            .call(done);
  };

  return me;
};
