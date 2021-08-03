"use strict";

exports.getIndexes = function (doc) {
    if (doc.$type !== 'entry' || doc.$kind !== 'sample') return;
    if (!doc.$content.spectra || !doc.$content.spectra.nmr) return;
    var nmr = doc.$content.spectra.nmr.filter(function(nmr) {
        return nmr.dimension === 1 && nmr.nucleus[0] === '1H'
    });
    var toEmit = [];
    for (var j = 0; j < nmr.length; j++) {
        var general = doc.$content.general || {};
        var entry = {
            description: general.description,
            mf: general.mf,
            id: String(doc.$id[0]),
            index: toIndex(nmr[j].range),
            jcamp: nmr[j].jcamp ? nmr[j].jcamp.filename : null
        };

        var oclid = '';
        if (doc.$content.general && doc.$content.general.molfile) {
            if (doc.$content.general.ocl) {
                oclid = doc.$content.general.ocl;
            } else {
                log('No associated ocl code for ' + doc._id);
            }
        }

        entry.oclid = oclid;
        toEmit.push(entry);
    }
    return toEmit;
};

function toIndex(ranges, options) {
    options = options || {};
    var index = [];

    if (options.joinCouplings) {
        ranges.forEach(function (range) {
            range.signal.forEach(function (signal) {
                signal.multiplicity = joinCoupling(signal, options.tolerance);
            });
        });
    }

    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (Array.isArray(range.signal) && range.signal.length > 0) {
            var l = range.signal.length;
            var delta = new Array(l);
            for (var k = 0; k < l; k++) {
                delta[k] = range.signal[k].delta;
            }
            index.push({
                multiplicity: (l > 1) ? 'm' : (range.signal[0].multiplicity ||
                joinCoupling(range.signal[0], options.tolerance)),
                delta: arithmeticMean(delta) || (range.to + range.from) * 0.5,
                integral: range.integral
            });
        } else {
            index.push({
                delta: (range.to + range.from) * 0.5,
                multiplicity: 'm'
            });
        }
    }
    return index;
};

function joinCoupling(signal, tolerance) {
    if (tolerance === undefined) tolerance = 0.05;
    var jc = signal.j;
    if (jc && jc.length > 0) {
        var cont = jc[0].assignment ? jc[0].assignment.length : 1;
        var pattern = '';
        var newNmrJs = [];
        var diaIDs = [];
        var atoms = [];
        jc.sort(function (a, b) {
            return b.coupling - a.coupling;
        });
        if (jc[0].diaID) {
            diaIDs = [jc[0].diaID];
        }
        if (jc[0].assignment) {
            atoms = jc[0].assignment;
        }
        for (var i = 0; i < jc.length - 1; i++) {
            if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                cont += jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                diaIDs.push(jc[i].diaID);
                atoms = atoms.concat(jc[i + 1].assignment);
            } else {
                var jTemp = {
                    coupling: Math.abs(jc[i].coupling),
                    multiplicity: patterns[cont]
                };
                if (diaIDs.length > 0) {
                    jTemp.diaID = diaIDs;
                }
                if (atoms.length > 0) {
                    jTemp.assignment = atoms;
                }
                newNmrJs.push(jTemp);
                if (jc[0].diaID) {
                    diaIDs = [jc[i].diaID];
                }
                if (jc[0].assignment) {
                    atoms = jc[i].assignment;
                }
                pattern += patterns[cont];
                cont = jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
            }
        }
        var jTemp = {
            coupling: Math.abs(jc[i].coupling),
            multiplicity: patterns[cont]
        };
        if (diaIDs.length > 0) {
            jTemp.diaID = diaIDs;
        }
        if (atoms.length > 0) {
            jTemp.assignment = atoms;
        }
        newNmrJs.push(jTemp);

        pattern += patterns[cont];
        signal.j = newNmrJs;

    } else if (signal.delta) {
        pattern = 's';
    } else {
        pattern = 'm';
    }
    return pattern;
}

function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

