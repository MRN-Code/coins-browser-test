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
  {
    text: 'Billing',
    children: [
            { text: 'List Charge Codes' },
            { text: 'Add Credits' },
            { text: 'View Discrepancies' },
            { text: 'Canceled Scan Billing' },
            { text: 'Billing Report' },
    ],
  },
  {
    text: 'Admin',
    children: [
            { text: 'Sites' },
            { text: 'Users' },
    ],
  },
];

module.exports = client => menu(client, menuMap);
