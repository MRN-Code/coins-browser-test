"use strict";

// mouse mouse to menu items
module.exports = function(client, config) {
    var me = {};

    me.hoverMenuItem = function(dest, done) {
        debugger;
        return client.moveToObject(dest, done);
    };

    me.subjects = function(dest, done) {
        debugger;
        return client
            .call(me.hoverMenuItem('#nav_anchor_SUBJECTS'), done);
    };

    me.subjects.addNew = function(done) {
        return client
            .call(me.subjects)
            .call(me.hoverMenuItem('#nav_anchor_Enter_a_New_Subject'), done);
    };

    return me;
};
