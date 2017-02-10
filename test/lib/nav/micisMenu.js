'use strict';

const menu = require('./menu.js');

const menuMap = [
  {
    text: 'Subjects',
    children: [
            { text: 'Enter a New Subject' },
            { text: 'Enroll an Existing Subject' },
            { text: 'Merge Subjects' },
            { text: 'Look Up a Subject' },
            { text: 'Import Participants' },
    ],
  },
  {
    text: 'Studies',
    children: [
            { text: 'List Studies' },
            { text: 'Add New Study' },
    ],
  },
  {
    text: 'Data Exchange',
    children: [
            { text: 'Browse Available Data' },
    ],
  },
];

module.exports = (client, config) => menu(client, config, menuMap);

