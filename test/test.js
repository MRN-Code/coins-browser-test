'use strict';
var config = require('config');
var should = require('should');

var client = require('./lib/client.js').client;
var auth = require('./lib/auth/micis.js')(client, config);

// TODO delete - tests shouldnt be driving us around..
var nav = require('./lib/navigation.js')(client, config);

var timeoutDur = 25000;

client.clientReady.then(function() {
    auth.logon(function() {
        // nav.goto.menu.subjects.addNew();
    });
});
