"use strict";

var menuMap = [
    {
        text: "Data Entry",
        children: [
            {text: "New Assessment"},
            {text: "Resume Entry"}
        ]
    },
    {
        text: "Manage",
        children: [
            {text: "Search Assessments"},
            {text: "View Orphans"},
            {text: "View Conflicts"},
            {text: "Dual Entry Conflict Statistics"},
            {text: "Backfill by ID"}
        ]
    },
    {
        text: "Self-Assess",
        children: [
            {text: "Manage Subject Queues"},
            {text: "Review Submissions"},
            {text: "Go To Self Assessment"},
            {text: "Self Assessment Time Log"}
        ]
    },
    {
        text: "Instruments",
        children: [
            {text: "List Instruments"},
            {text: "Create Instrument"},
            {text: "Show All Instruments All Studies"},
            {text: "Share Instruments"},
            {text: "Export Instruments"}
        ]
    },
    {
        text: "Admin",
        children: [
            {text: "List Raters"},
            {text: "Add Rater"},
            {text: "Import Assessments"},
            {text: "Import Instruments"},
            {text: "Edit Incomplete/Missions Reasons"},
            {text: "Import Assessment Document"},
            {text: "Duplicate Instrument"}
        ]
    }
];

module.exports = function(client, config) {
    return require('./menu.js')(client, config, menuMap);
};
