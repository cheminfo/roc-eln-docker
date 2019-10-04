'use strict';

// const ldapConfig = require('./ldap');

const keys = process.env.REST_ON_COUCH_APP_KEYS;
if (keys === '') {
  throw new Error(
    'There must be at least one app key defined in REST_ON_COUCH_APP_KEYS'
  );
}
const appKeys = keys.split(',');

const origins = process.env.REST_ON_COUCH_ORIGINS;
if (origins === '') {
  throw new Error(
    'There must be at least one origin defined in REST_ON_COUCH_ORIGINS'
  );
}
const allowedOrigins = origins.split(',');

const adminUsers = process.env.REST_ON_COUCH_ADMIN_USERS;
let administrators = ['admin@cheminfo.org'];
if (adminUsers !== '') {
  administrators.push(...adminUsers.split(','));
}

const proxyPrefix = process.env.REST_ON_COUCH_PROXY_PATH || '';

module.exports = {
  allowedOrigins, // ['https://server1.example.com', 'https://server2.example.com', ...]
  keys: appKeys, // ['key1', 'key2', ...]
  administrators, // ['admin1@example.com', 'admin2@example.com', ...]
  port: 3000,
  url: 'http://couchdb:5984',
  username: 'rest-on-couch',
  password: process.env.COUCHDB_ROC_SERVER_PASSWORD,
  logLevel: 'FATAL',
  proxyPrefix: proxyPrefix + '/roc/',
  publicAddress: allowedOrigins[0],
  auth: {
//    ldap: ldapConfig,
//    google: {
//      clientID: "CLIENT_ID.apps.googleusercontent.com",
//      clientSecret: "THE_SECRET"
//    },
    // do not disable couchdb login. You can enable "showLogin" if necessary
    couchdb: {
      showLogin: true,
      title: "Login with a Cheminfo account"
    }
  },

  // Default database rights
  // Any logged in user can create documents. Only owners can read and write their own documents
  rights: {
    read: [],
    write: [],
    create: ['anyuser']
  }
};
