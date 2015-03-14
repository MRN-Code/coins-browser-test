"use strict";

var menuMap = [
    {
        text: "INSTRUMENTS",
        children: [
            {text: "List Instruments"},
            {text: "Create Instrument"},
            {text: "Show All Instruments All Studies"},
            {text: "Share Instruments"},
            {text: "Export Instruments"}
        ]
    }
];

module.exports = function(client, config) {
    return require('./menu.js')(client, config, menuMap);
};
