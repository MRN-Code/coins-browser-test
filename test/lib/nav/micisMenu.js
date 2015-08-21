"use strict";

var menuMap = [
    {
        text: "Subjects",
        children: [
            {text: "Enter a New Subject"},
            {text: 'Enroll an Existing Subject'},
            {text: "Merge Subjects"},
            {text: "Look Up a Subject"}
        ]
    },
    {
        text: 'Studies',
        children: [
            {text: 'List Studies'},
            {text: 'Add New Study'}
        ]
    }
];

module.exports = function(client, config) {
    return require('./menu.js')(client, config, menuMap);
};
