'use strict';

const genbankParser = require('genbank-parser');

module.exports = {
  kind: 'sample',
  source: [], // add optional mounted directories with the spectra
  getID(filename, contents) {
    const terms = filename.split('_');
    if (terms.length < 2) {
      throw new Error('Invalid filename');
    }
    const user = terms[0].toLowerCase();
    const [project, batch] = terms[1].split('-');
    if (batch) {
      return [user, project, batch];
    } else {
      return [user, project];
    }
  },
  getOwner(filename) {
    // return the main owner of the entry
    const userLookupTable = require('./userLookup');
    const userInitials = filename.split('_')[0].toLowerCase();
    const user = userLookupTable[userInitials];
    if (user && user.owner) {
      const groups = user.groups || [];
      return [user.owner, 'dnaRead', 'dnaWrite', ...groups];
    } else {
      throw new Error(`Unknown user ${userInitials}`);
    }
  },
  parse(filename, contents) {
    contents = contents.toString('utf-8');
    const reference = filename.replace('.gb', '');
    const toReturn = {
      jpath: 'biology.dna',
      content_type: 'chemical/x-genbank',
      reference: reference
    };

    if (/\.gb$/i.test(filename)) {
      // parse genbank
      const parsed = genbankParser(contents);
      toReturn.data = {
        seq: parsed
      };
      toReturn.field = 'genbank';
    } else {
      throw new Error('unexpected file extension: ' + filename);
    }
    return toReturn;
  }
};
