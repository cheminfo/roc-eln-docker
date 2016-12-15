'use strict';

module.exports = {
  // Change this to the base address of your server
  allowedOrigins: ['http://server.example.com'],
  // Same as above, without http://
  sessionDomain: 'server.example.com',
  // put a 32 character random string
  keys: ['changeThisForARandomKey'],
  logLevel: 'FATAL',
  
  administrators: ['admin@cheminfo.org'],

  url: 'http://couchdb:5984', // do not change
  username: "rest-on-couch", // do not change
  password: "password", // put the same password as in docker-compose.yml

  port: 3000, // do not change
  // if your application is behind a reverse proxy, add the prefix here (but keep /roc/ at the end)
  // example: app is available at http://server.example.com/my/app. proxyPrefix must be '/my/app/roc/'
  proxyPrefix: '/roc/',
  // main address from allowedOrigins
  publicAddress: 'http://server.example.com/',
  auth: {
    /* uncomment and configure for ldap login
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
    */
    /* uncomment and configure for google login
    google: {
      clientID: "mylongclientid.apps.googleusercontent.com",
      clientSecret: "myclientsecret"
    },
    */
    // do not change
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
