'use strict';

module.exports = function configAppendStats(customViews) {
  customViews.userAnalysisToc = {
    map: function (doc) {
      if (doc.$type !== 'entry' || doc.$kind !== 'userAnalysisResults') return;
      emitWithOwner(doc.$id, {
        viewID: doc.$id[1],
        sampleID: doc.$id[2],
        name: doc.$id[3]
      });
    },
    withOwner: true,
    designDoc: 'userAnalysis'
  };
};
