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
  publicTemplateValue: 1779, // All CoRR Data (From 2014-05-08)
  statisticsValue: ['1301', '4136', '1', '1418'],
};

const dxNewRequest = {
  publicTemplateLabel: 'Public Templates',
  publicTemplateValue: 1779, // All CoRR Data (From 2014-05-08)
  statisticsValue: ['1301', '4136', '1', '1418'],
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
    siteID: _.random(56, 98),
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
       { cobre06: 'Coordinator' },
      ],
    },
  },
};

const userEdit = {
  sampleData: {
    name: `UserEdit ${moment().unix()}`,
    username: 'u1558127291',
    password: `coins${moment().unix()}`,
    emailAddress: `${moment().unix()}@mrn.org`,
    receiveCOINSNotificationEmails: false,
    accountExpirationDate: moment().add(2, 'year').format('MM/DD/YYYY'),
    passwordExpirationDate: moment().add(1, 'year').format('MM/DD/YYYY'),
    site: 'Mind Research Network',
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
         { cobre06: 'Coordinator' },
      ],
    },
    studyPermissions2: {
      remove: [
         { cobre06: 'Coordinator' },
      ],
      add: [
         { MCIC: 'Coordinator' },
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
    fundingSource: 'Vince, Calhoun',
    studyID: 2319,
  },
};

const creditsAdd = {
  sampleData: {
    piId: 'Calhoun, Vince',
    defaultChargeCodeName: 'INTMRI01',
    defaultChargeCodeValue: '224',
    effectiveDate: moment().format('MM/DD/YYYY'),
    numCredits: 1,
  },
};

const paymentAdd = {
  studyID: '2319',
  participant: {
    payeeType: 'Participant',
    payeeName: 'Icare Test',
    paymentDate: moment().format('MM/DD/YYYY'),
    paymentRate: 'Hourly',
    hours: '2.32',
    hourlyRate: '8.5',
    paymentType: 'Check',
    paymentMethod: 'Mailed',
    extra: {
      supllies: '1.0',
      food: '2.0',
    },
    w9Provided: 'No',
    payer: 'Test Payer',
    notes: 'Test payment note',
  },
  alternate: {
    payeeType: 'Alternate',
    payeeLastName: 'Alternate',
    payeeFirstName: 'Test',
    payeeBirthMonth: '7 - July',
    payeeBirthDay: '1',
    payeeAddressLine1: ' Test Address Line 1',
    payeeCity: 'Test City',
    payeeState: 'New Mexico',
    payeeZip: '87000',
    payeeCountry: 'United States',
    payeeDetails: 'Test payee details',
    paymentDate: moment().format('MM/DD/YYYY'),
    paymentRate: 'Flat',
    AmountPaid: '8.32',
    paymentType: 'Check',
    paymentMethod: 'Mailed',
    extra: {
      supllies: '1.0',
      food: '2.0',
    },
    w9Provided: 'No',
    payer: 'Test Payer',
    notes: 'Test payment note',
  },
};

const scanAdd = {
  ursi: 'M87138333',
  studyID: 2319,
  scanDateTime: moment().format('MM/DD/YYYY hh:mmA'),
  visit: 'visit1',
  scanner: 'MIC SMS SON 1.5T',
  sessionID: `Study${moment().format('YYYYMMDD')}at${moment().format('hhmmss')}`,
  notes: 'Test session note',
  queueForRadRead: true,
  seriesConditions: {
    1: ['MID Pilot', 'Completed - No Problems', 'Test series note'],
    2: ['Migraine 2', 'Completed - Problems', 'Test series note problems'],
  },
};

module.exports = {
  studyVisit,
  subjectLookUp,
  subjectTags,
  studyDetails,
  dxClone,
  dxNewRequest,
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
  paymentAdd,
  scanAdd,
};
