'use strict';

const config = require('./configBase');

const customViews = config.customDesign.views;

require('./configAnalysis')(customViews);

require('./configAppendStats')(customViews);
// add custom views here

customViews.reagentSSS = {
  map: function (doc) {
    if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
      return;
    }
    var reagents = doc.$content.reagents;
    for (var i = 0; i < reagents.length; i++) {
      var r = reagents[i];
      var result = {
        reference: doc.$id,
        ocl: r.ocl,
        mf: r.mf,
        em: r.em,
        mw: r.mw
      };
      emitWithOwner(doc._id, result);
    }
  },
  reduce: '_count',
  designDoc: 'reactionSSS',
  withOwner: true
};

customViews.productSSS = {
  map: function (doc) {
    if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
      return;
    }
    var products = doc.$content.products;
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var result = {
        reference: doc.$id,
        ocl: p.ocl,
        mf: p.mf,
        em: p.em,
        mw: p.mw
      };
      emitWithOwner(doc._id, result);
    }
  },
  reduce: '_count',
  designDoc: 'reactionSSS',
  withOwner: true
};

customViews.reactionTree = {
  map: function (doc) {
    if (doc.$type !== 'entry' || doc.$kind !== 'reaction') {
      return;
    }
    var codes = [];

    function emitElements(arr) {
      for (var i = 0; i < arr.length; ++i) {
        var current = arr[i];
        var toEmit = {
          ocl: current.ocl
        };
        if (codes.indexOf(current.code) !== -1) {
          toEmit.yield = current.yield;
        } else {
          codes.push(current.code);
        }
        emitWithOwner(doc._id, toEmit);
      }
    }

    emitElements(doc.$content.reagents);
    emitElements(doc.$content.products);
  },
  reduce: '_count',
  designDoc: 'reactionTree',
  withOwner: true
};

module.exports = config;
