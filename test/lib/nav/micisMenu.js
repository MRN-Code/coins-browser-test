"use strict";

var menuMap = [
    {
        text: "Subjects",
        children: [
            {text: "Enter a New Subject"},
            {text: 'Enroll an Existing Subject'},
            {text: "Merge Subjects"},
            {text: "Look Up a Subject"},
            {text: "Import Participants"}
        ]
    },
    {
        text: 'Studies',
        children: [
            {text: 'List Studies'},
            {text: 'Add New Study'}
        ]
    },
    {
        text: "Data Exchange",
        children: [
            {text: "Browse Available Data"}
        ]
    }
];

module.exports = function(client, config) {
    return require('./menu.js')(client, config, menuMap);
};
