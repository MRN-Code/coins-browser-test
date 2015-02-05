"use strict";

// mouse mouse to menu items
module.exports = function(client, config) {
    var me = {};

    me.hoverMenuItem = function(dest, done) {
        return client.moveToObject('#nav_anchor_' + dest, done);
    };

    me.subjects = function(dest, done) {
        return client
            .waitForPaginationComplete()
            .call(me.hoverMenuItem('SUBJECTS'), done);
    };

    me.subjects.addNew = function(done) {
        return client
            .call(me.subjects)
            .call(me.hoverMenuItem('Enter_a_New_Subject'), done);
    };

    return me;
};
