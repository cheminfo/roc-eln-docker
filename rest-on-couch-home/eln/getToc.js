exports.getToc = function (doc) {
  var content = doc.$content;
  var general = content.general || {};
  var spectra = content.spectra || {};
  var names = general.name || [];
  var nmr = spectra.nmr;
  var ir = spectra.ir;
  var mass = spectra.mass;
  var chromatagram = spectra.chromatogram;
  var xray = spectra.xray;
  var uv = spectra.uv;
  var dsc = spectra.differentialScanningCalorimetry;
  var tga = spectra.thermogravimetricAnalysis;
  var xrd = spectra.xrd;
  var xps = spectra.xps;
  var location = undefined;
  if (
    content.stock &&
    content.stock.history &&
    content.stock.history[0] &&
    content.stock.history[0].status === 500
  ) {
    location = content.stock.history[0].location;
  }
  var nb1d = 0;
  var nb2d = 0;
  var nb1h = 0;
  var nb13c = 0;
  if (nmr) {
    for (var i = 0; i < nmr.length; i++) {
      for (var i = 0; i < nmr.length; i++) {
        if (nmr[i].dimension === 1) {
          nb1d++;
          if (
            Array.isArray(nmr[i].nucleus) &&
            typeof nmr[i].nucleus[0] === 'string'
          ) {
            if (nmr[i].nucleus[0].toLowerCase() === '1h') {
              nb1h++;
            } else if (nmr[i].nucleus[0].toLowerCase() === '13c') {
              nb13c++;
            }
          }
        } else if (nmr[i].dimension === 2) nb2d++;
      }
    }
  }

  return {
    mf: general.mf,
    mw: general.mw,
    em: general.em,
    // We don't need the index
    ocl: general.ocl && {
      value: general.ocl.value,
      coordinates: general.ocl.coordinates
    },
    keyword: general.keyword,
    meta: general.meta,
    nbNmr: (nmr && nmr.length) || undefined,
    nbIR: (ir && ir.length) || undefined,
    nbMass: (mass && mass.length) || undefined,
    nb1d: nb1d || undefined,
    nb2d: nb2d || undefined,
    nb1h: nb1h || undefined,
    nb13c: nb13c || undefined,
    nbTGA: (tga && tga.length) || undefined,
    nbDSC: (dsc && dsc.length) || undefined,
    nbUV: (uv && uv.length) || undefined,
    nbXPS: (xps && xps.length) || undefined,
    nbXRD: (xrd && xrd.length) || undefined,
    nbChromatogram: (chromatagram && chromatagram.length) || undefined,
    nbXray: (xray && xray.length) || undefined,
    hidden: content.hidden || false,
    names: names.map(function (name) {
      // names are added for search purposes
      if (name) return name.value;
    }),
    location: location,
    owner: doc.$owners[0],
    created: new Date(doc.$creationDate).toISOString().substring(0, 10),
    modified: new Date(doc.$modificationDate).toISOString().substring(0, 10)
  };
};
