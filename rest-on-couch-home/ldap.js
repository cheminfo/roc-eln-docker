'use strict';

module.exports = undefined;
// Remove previous line and uncomment the following to enable LDAP authentication.
/*module.exports = {
  server: {
    url: 'ldaps://ldap.example.com',
    searchBase: 'c=ch',
    searchFilter: 'uid={{username}}'
  },
  getUserInfo: function(user) {
    return {
      uid: user.uid[0],
      group: user.uid[1].replace(/^.*@/, '')
    };
  }
};*/
