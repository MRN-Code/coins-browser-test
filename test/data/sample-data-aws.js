'use strict';

const randomNumber = require('lodash/random');
const _ = require('lodash');
const moment = require('moment');


const studyVisit = {
  study: 'Study2',
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
    firstName: 'Autotest',
    lastName: 'User',
    email: 'testuser@mrn.org',
  },
};

const subjectTags = {
  study: 'Study1',
  sampleUrsi: 'M00133989',
  sampleTags: [{
    type: 'Family ID',
    value: `test_${Date.now()}`,
  }, {
    type: 'U.S. SSN (PHI)',
    value: randomNumber(1e8, 1e9 - 1), // Random 9-digit number
  }],
};

const studyDetails = {
  study: 'Study1',
};

const dxClone = {
  publicTemplateLabel: 'Submitted Requests',
  publicTemplateValue: 31,
  statisticsValue: ['0', '14', '1', '10'],
};

const studySubjectTypes = {
  study: 'Study2',
  targetSubjectTypeLabel: 'Patient',
};
const subjectEditType = {
  study: 'Study2',
  sampleUrsi: 'M00124075',
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
    pi: 'One, Investigator',
    coInvestigator: 'One, Investigator',
    sideId: 'University 1',
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
    defaultRadiologist: 'Radiologist One',
    primaryResearchArea: 'None',
    secondaryResearchArea: 'None',
    description: _.random(1e9, 1e10 - 1),
    cssUrl: 'http://www.mrn.org/_ui/css/style.css',
  },
};

const fileImport = {
  studyID: 1,
};

const subjectAdd = {
  ursiPrefix: 'M001',
};
const subjectEnroll = {
  studyID: 1,
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
    site: 'University 1',
    siteAdministrator: false,
    appPermissions: {
      remove: [],
      add: [
       { MICIS: 'Coordinator' },
       { MICIS: 'everybody' },
       { Assessments: 'Coordinator' },
      ],
    },
    studyPermissions: {
      remove: [],
      add: [
         { Study3: 'Coordinator' },
      ],
    },
  },
};

const userEdit = {
  sampleData: {
    name: `UserEdit ${moment().unix()}`,
    username: '1554310643',
    password: `coins${moment().unix()}`,
    emailAddress: `${moment().unix()}@mrn.org`,
    receiveCOINSNotificationEmails: false,
    accountExpirationDate: moment().add(2, 'year').format('MM/DD/YYYY'),
    passwordExpirationDate: moment().add(1, 'year').format('MM/DD/YYYY'),
    site: 'University 2',
    siteAdministrator: true,
    appPermissions1: {
      remove: [],
      add: [
        { MICIS: 'Coordinator' },
        { MICIS: 'everybody' },
        { Assessments: 'Coordinator' },
      ],
    },
    appPermissions2: {
      remove: [
        { MICIS: 'Coordinator' },
        { Assessments: 'Coordinator' },
      ],
      add: [
        { MICIS: 'Radiologist' },
        { MICIS: 'everybody' },
      ],
    },
    studyPermissions1: {
      remove: [],
      add: [
         { Study2: 'Coordinator' },
      ],
    },
    studyPermissions2: {
      remove: [
         { Study2: 'Coordinator' },
      ],
      add: [
         { Study3: 'Coordinator' },
      ],
    },
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

const scanAdd = {
  sampleData: {
    ursi: 'Three, Investigator',
    study: '',
    scanDateTime: moment().format('MM/DD/YYYY hh:mm:ss'),
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
  userEdit,
  chargeCode,
  creditsAdd,
  scanAdd,
};
