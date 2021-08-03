module.exports = function configAppendStats(customViews) {
  customViews.statsByUser = {
    map: function(doc) {
      if (doc.$type !== 'entry') return;
      for (var i = 0; i < doc.$owners.length; i++) {
        emit(['admin@cheminfo.org', doc.$owners[i]], doc);
      }
    },
    reduce: function(keys, values, rereduce) {
      if (!rereduce) {
        var result = {
          entries: {
            total: values.length,
            reaction: values.filter(function(value) {
              return value.$kind === 'reaction';
            }).length,
            sample: values.filter(function(value) {
              return value.$kind === 'sample';
            }).length,
            analysisRequest: values.filter(function(value) {
              return value.$kind === 'analysisRequest';
            }).length
          },
          attachments: {
            number: 0,
            size: 0
          }
        };
        values.forEach(function(value) {
          if (value._attachments) {
            var keys = Object.keys(value._attachments);
            for (var i = 0; i < keys.length; i++) {
              result.attachments.number++;
              result.attachments.size += value._attachments[keys[i]].length;
            }
          }
        });
        return result;
      } else {
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
          var value = values[i];
          result.entries.total += value.entries.total;
          result.entries.sample += value.entries.sample;
          result.entries.reaction += value.entries.reaction;
          result.entries.analysisRequest += value.entries.analysisRequest;
          result.attachments.number += value.attachments.number;
          result.attachments.size += value.attachments.size;
        }
        return result;
      }
    },
    designDoc: 'stats',
    withOwner: false
  };

  customViews.statsByMonth = {
    map: function(doc) {
      if (doc.$type !== 'entry') return;
      var epoch = new Date(doc.$creationDate);
      var month = String(epoch.getMonth() + 1);
      if (month.length === 1) month = '0' + month;
      emit(
        [
          'admin@cheminfo.org',
          new Date(epoch.getFullYear() + '-01-01').getTime(),
          new Date(epoch.getFullYear() + '-' + month + '-01').getTime()
        ],
        doc
      );
    },
    reduce: function(keys, values, rereduce) {
      if (!rereduce) {
        var result = {
          entries: {
            total: values.length,
            reaction: values.filter(function(value) {
              return value.$kind === 'reaction';
            }).length,
            sample: values.filter(function(value) {
              return value.$kind === 'sample';
            }).length,
            analysisRequest: values.filter(function(value) {
              return value.$kind === 'analysisRequest';
            }).length
          },
          attachments: {
            number: 0,
            size: 0
          }
        };
        values.forEach(function(value) {
          if (value._attachments) {
            var keys = Object.keys(value._attachments);
            for (var i = 0; i < keys.length; i++) {
              result.attachments.number++;
              result.attachments.size += value._attachments[keys[i]].length;
            }
          }
        });
        return result;
      } else {
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
          var value = values[i];
          result.entries.total += value.entries.total;
          result.entries.sample += value.entries.sample;
          result.entries.reaction += value.entries.reaction;
          result.entries.analysisRequest += value.entries.analysisRequest;
          result.attachments.number += value.attachments.number;
          result.attachments.size += value.attachments.size;
        }
        return result;
      }
    },
    designDoc: 'stats',
    withOwner: false
  };
};
