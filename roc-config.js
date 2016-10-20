'use strict';

module.exports = {
  allowedOrigins: ['http://server.example.com'],
  sessionDomain: 'server.example.com',
  keys: ['changeThisForARandomKey'],

  // CouchDB credentials
  username: "rest-on-couch",
  password: "restoncouch77",

  proxyPrefix: '/',
  publicAddress: 'http://server.example.com',
  auth: {
    ldap: {
      server: {
        url: 'ldaps://ldap.epfl.ch',
        searchBase: 'c=ch',
        searchFilter: 'uid={{username}}'
      },
      getUserInfo: function(user) {
        return {
          uid: user.uid[0],
          group: user.uid[1].replace(/^.*@/, '')
        };
      }
    },
    couchdb: {
      showLogin: false
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
