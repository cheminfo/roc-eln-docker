'use strict';

const nmrMetadata = require('nmr-metadata');

module.exports = {
    kind: 'sample',
    source: [], // add optional mounted directories with the spectra
    getID(filename, contents) {
        // return the id of the entry
        throw new Error('unimplemented');
    },
    getOwner(filename) {
        // return the main owner of the entry
        throw new Error('unimplemented');
    },
    parse(filename, contents) {
        contents = getContentString(contents);
        const reference = filename.replace('.fid', '');
        const toReturn = {
            jpath: 'spectra.nmr',
            content_type: 'chemical/x-jcamp-dx',
            reference: reference
        };
        if (/\.fid\.jdx$/i.test(filename)) { // parse jcamp
            toReturn.data = {};
            toReturn.field = 'jcampFID';
        } else if (/\.jdx$/i.test(filename)) {
            const meta = nmrMetadata.parseJcamp(contents, {computeRanges: true});
            delete meta.isFid;
            delete meta.isFt;
            toReturn.data = meta;
            toReturn.field = 'jcamp';
        } else {
            throw new Error('unexpected file extension: ' + filename);
        }
        return toReturn;
    }
};

function getContentString(contents) {
    if (!contents._string) {
        contents._string = contents.toString('latin1');
    }
    return contents._string;
}
