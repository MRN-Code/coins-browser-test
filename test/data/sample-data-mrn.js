'use strict';

const randomNumber = require('lodash/random');
const _ = require('lodash');
const moment = require('moment');

const studyVisit = {
  study: 'NITEST',
  sampleVisitData: {
    label: 'Test Label 1',
    timeFromBaseline: 1,
    timeUnit: 'Week',
    segmentInterval: `test_${(new Date()).getTime()}`,
  },
  editVisitData: {
    label: 'Test Label 2',
    timeFromBaseline: 2,
    timeUnit: 'Month',
  },
};

const subjectLookUp = {
  testUser: {
    firstName: 'Icare',
    lastName: 'Test',
    email: 'icaretestursi@mrn.org',
  },
};

const subjectTags = {
  study: 'NITEST',
  sampleUrsi: 'M87161657',
  sampleTags: [{
    type: 'Temporary Subject ID',
    value: `test_${Date.now()}`,
  }, {
    type: 'U.S. SSN',
    value: randomNumber(1e8, 1e9 - 1), // Random 9-digit number
  }],
};

const studyDetails = {
  study: 'NITEST',
};

const dxClone = {
  publicTemplateLabel: 'Public Templates',
  publicTemplateValue: 460,
  statisticsValue: ['2253', '1112', '1', '1112'],
};

const studySubjectTypes = {
  study: 'NITEST',
  targetSubjectTypeLabel: 'Testing',
};

const subjectEditType = {
  study: 'NITEST',
  sampleUrsi: 'M87161657',
  sampleNote: `Test: ${Date.now()}`,
};

/**
 * Set up sample data. This should be unique every time the test is run through
 * the use of random numbers.
 */
const sampleSlug = _.random(1e6, 1e7 - 1);
const studyAdd = {
  sampleData: {
    label: `test_${sampleSlug}`,
    title: `Test Study: ${sampleSlug}`,
    archiveDirectory: `test_dir_${sampleSlug}`,
    pi: 'Calhoun, Vince',
    coInvestigator: 'Turner, Jessica',
    sideId: 'Mind Research Network',
    email: 'coins-notifier@mrn.org',
    irbNumber: `${_.random(10, 99)}-${_.random(100, 999)}`,
    internalStudyNumber: `${_.random(10, 99)}-${_.random(100, 999)}`,
    approvalDate: moment().format('MM/DD/YYYY'),
    expirationDate: moment().add(365, 'days').format('MM/DD/YYYY'),
    maxEnrollment: _.random(100, 999),
    studySharing: 'No',
    sponsor: _.random(100, 999),
    grantNumber: _.random(100, 999),
    urlReference: 'http://www.mrn.org',
    urlDescription: _.random(1e9, 1e10 - 1),
    status: 'Active',
    defaultRadiologist: 'Charles Pluto',
    primaryResearchArea: 'Creativity',
    secondaryResearchArea: 'PTSD',
    description: _.random(1e9, 1e10 - 1),
    cssUrl: 'http://www.mrn.org/_ui/css/style.css',
  },
};

const fileImport = {
  studyID: 2319,
};
const subjectAdd = {
  ursiPrefix: 'M871',
};
const subjectEnroll = {
  studyID: 7640,
};

const siteAdd = {
  sampleData: {
    label: 'University 00',
    description: 'University 00',
    URSIPrefix: `M${_.random(100, 999)}`,
    userLabel: 'CITI Training',
    expirationDateChecked: true,
    siteID: _.random(10, 99),
  },
};

const userAdd = {
  sampleData: {
    name: 'Autotest User',
    username: `u${moment().unix()}`,
    password: 'coins4life',
    emailAddress: `${moment().unix()}@mrn.org`,
    receiveCOINSNotificationEmails: true,
    accountExpirationDate: moment().add(2, 'year').format('MM/DD/YYYY'),
    passwordExpirationDate: moment().add(1, 'year').format('MM/DD/YYYY'),
    site: 'Mind Research Network',
    siteAdministrator: false,
    appPermissions: [
         { MICIS: 'Coordinator' },
         { MICIS: 'everybody' },
         { Assessments: 'Coordinator' },
    ],
    studyPermissions: [
         { Study3: 'Coordinator' },
    ],
  },
};
const chargeCode = {
  sampleData: {
    chargeCode: `00-00${_.random(1000, 9999)}`,
    projectNumber: 300,
    startDate: moment().format('MM/DD/YYYY'),
    endDate: moment().add(30, 'days').format('MM/DD/YYYY'),
    onlyAllowScanCreditBilling: false,
    fundingSource: 'Three, Investigator',
    studyID: 1,
  },
};

const creditsAdd = {
  sampleData: {
    piId: 'Three, Investigator',
    defaultChargeCode: '00-000003',
    effectiveDate: moment().format('MM/DD/YYYY'),
    numCredits: 1,
  },
};

module.exports = {
  studyVisit,
  subjectLookUp,
  subjectTags,
  studyDetails,
  dxClone,
  studySubjectTypes,
  subjectEditType,
  studyAdd,
  fileImport,
  subjectAdd,
  subjectEnroll,
  siteAdd,
  userAdd,
  chargeCode,
  creditsAdd,
};
