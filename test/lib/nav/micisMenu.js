"use strict";

var menuMap = [
    {
        text: "SUBJECTS",
        children: [
            {text: "Enter a New Subject"},
            {text: 'Enroll an Existing Subject'},
            {text: "Merge Subjects"},
            {text: "Look Up a Subject"}
        ]
    }
];

module.exports = function(client, config) {
    return require('./menu.js')(client, config, menuMap);
};
