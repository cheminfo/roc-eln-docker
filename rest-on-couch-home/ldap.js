'use strict';

module.exports = undefined;
// Remove previous line and uncomment the following to enable LDAP authentication.
/*module.exports = {
  server: {
    url: 'ldaps://ldap.example.com',
    searchBase: 'c=ch',
    searchFilter: 'uid={{username}}',
  },
  getUserInfo: async function (user) {
    function pickUserData(user) {
      return {
        uid: user.uid[0],
        group: user.uid[1].replace(/^.*@/, ''),
      };
    }
    // Will be string when data userInfo/_me api called
    if (typeof user === 'string') {
      // ldapSearch function is preconfigured with the ldap auth options (binding credentials, domain)
      // They can all be overriden
      const user = await ldapSearch({ filter: `mail:${user}` });
      return pickUserData(user);
    }
    // Will be object when called in authentication workflow
    else {
      return pickUserData(user);
    }
  },
  getPublicUserInfo(user) {
    return {
      displayName: user.displayName,
    };
  },
};*/
