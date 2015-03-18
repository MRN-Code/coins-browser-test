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

"use strict";
module.exports = function(client, config, menuMap) {
    var me = {};

    // put menuMap in public scope
    me.menuMap = menuMap;

    me.findLink = function(text) {
        var findTextRecursive = function(obj) {
            var children;
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

    me.clickNested = function(text, done) {
        // Get top level menu item
        var parent = me.findLink(text)[0];
        // Ensure that top level menu item can be located
        if (!parent) {
            throw new Error('could not locate menu item with text `' + text + '`.  Was it added to the menu map file?');
        }

        // hover over top level menu item before clicking on child
        return client.moveToObject('=' + parent.text, 10, 10)
            .click('=' + text)
            .waitForPaginationComplete(done);
    };

    return me;
};
