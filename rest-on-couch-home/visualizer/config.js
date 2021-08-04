'use strict';

module.exports = {
  rights: {
    create: ['anyuser']
  },
  customDesign: {
    version: 23,
    views: {
      byVisualizerVersion: {
        designDoc: 'app',
        map: function (doc) {
          if (doc.$type !== 'entry') return;
          if (doc.$deleted) return;
          emit(doc.$content.version);
        },
        reduce: '_count'
      },
      search: {
        designDoc: 'app',
        map: function (doc) {
          if (doc.$type !== 'entry') return;
          if (doc.$deleted) return;
          function uniq(a) {
            var temp = {};
            for (var i = 0; i < a.length; i++) {
              temp[a[i]] = true;
            }
            var r = [];
            for (var k in temp) {
              r.push(k);
            }
            return r;
          }

          var content = doc.$content;
          for (var flavor in content.flavors) {
            var toEmit = {
              _id: doc._id,
              _rev: doc._rev,
              flavor: flavor,
              flavors: content.flavors[flavor],
              data: false,
              view: false,
              meta: content.meta,
              keywords: content.keywords
            };
            if (doc._attachments) {
              toEmit.data = !!doc._attachments['data.json'];
              toEmit.view = !!doc._attachments['view.json'];
            }

            var currentFlavor = content.flavors[flavor];
            var keywords = [];
            for (var i = 0; i < currentFlavor.length; i++) {
              var words = currentFlavor[i].split(' ');
              for (var j = 0; j < words.length; j++) {
                keywords.push(words[j].toLowerCase());
              }
            }

            if (content.keywords && content.keywords instanceof Array) {
              for (i = 0; i < content.keywords.length; i++) {
                var kw = content.keywords[i].toString();
                keywords.push(kw);
              }
            }

            if (content.keywords && typeof content.keywords === 'string') {
              var kws = content.keywords.replace(/[\s;, ]+/g, ' ').split(' ');
              for (i = 0; i < kws.length; i++) {
                keywords.push(kws[i]);
              }
            }

            keywords = uniq(keywords);

            for (i = 0; i < keywords.length; i++) {
              for (j = i + 1; j < keywords.length; j++) {
                emit([keywords[i], keywords[j]], toEmit);
                emit([keywords[j], keywords[i]], toEmit);
              }
            }
          }
        }
      },
      searchOne: {
        designDoc: 'app',
        map: function (doc) {
          if (doc.$type !== 'entry') return;
          if (doc.$deleted) return;
          function uniq(a) {
            var temp = {};
            for (var i = 0; i < a.length; i++) {
              temp[a[i]] = true;
            }
            var r = [];
            for (var k in temp) {
              r.push(k);
            }
            return r;
          }

          var content = doc.$content;
          for (var flavor in content.flavors) {
            var toEmit = {
              _id: doc._id,
              _rev: doc._rev,
              flavor: flavor,
              flavors: content.flavors[flavor],
              data: false,
              view: false,
              meta: content.meta,
              keywords: content.keywords
            };
            if (doc._attachments) {
              toEmit.data = !!doc._attachments['data.json'];
              toEmit.view = !!doc._attachments['view.json'];
            }

            var currentFlavor = content.flavors[flavor];
            var keywords = [];
            for (var i = 0; i < currentFlavor.length; i++) {
              var words = currentFlavor[i].split(' ');
              for (var j = 0; j < words.length; j++) {
                keywords.push(words[j].toLowerCase());
              }
            }
            if (content.keywords && content.keywords instanceof Array) {
              for (i = 0; i < content.keywords.length; i++) {
                var kw = content.keywords[i].toString();
                keywords.push(kw);
              }
            }

            if (content.keywords && typeof content.keywords === 'string') {
              var kws = content.keywords.replace(/[\s;, ]+/g, ' ').split(' ');
              for (i = 0; i < kws.length; i++) {
                keywords.push(kws[i]);
              }
            }

            keywords = uniq(keywords);

            for (i = 0; i < keywords.length; i++) {
              emit(keywords[i], toEmit);
            }
          }
        }
      },
      list: {
        designDoc: 'app',
        map: function (doc) {
          if (doc.$type !== 'entry') return;
          if (doc.$deleted) return;
          for (var i in doc.$content.flavors) {
            emit(doc.$owners[0], i);
          }
        },
        reduce: function (key, values, rereduce) {
          var intobj = {};
          var i;

          if (rereduce) {
            for (i = 0; i < values.length; i++) {
              var intres = values[i];
              for (var j = 0; j < intres.length; j++) {
                intobj[intres[j]] = true;
              }
            }
          } else {
            for (i = 0; i < values.length; i++) {
              intobj[values[i]] = true;
            }
          }
          var result = [];
          for (i in intobj) {
            result.push(i);
          }
          return result;
        }
      },
      docs: {
        designDoc: 'app',
        map: function (doc) {
          if (doc.$type !== 'entry') return;
          if (doc.$deleted) return;
          if (doc.$owners.indexOf('anonymousRead') === -1) return;

          var content = doc.$content;
          for (var flavor in content.flavors) {
            var toEmit = {
              _id: doc._id,
              _rev: doc._rev,
              version: content.version,
              flavor: flavor,
              flavors: content.flavors[flavor],
              data: false,
              view: false,
              meta: content.meta,
              title: content.title,
              keywords: content.keywords
            };
            if (doc._attachments) {
              toEmit.data = !!doc._attachments['data.json'];
              toEmit.view = !!doc._attachments['view.json'];
            }
            emit([flavor, doc.$owners[0]], toEmit);
          }
        }
      }
    },
    lists: {
      sort: function () {
        function sorter(row1, row2) {
          var flavors1 = row1.value.flavors;
          var flavors2 = row2.value.flavors;
          var l1 = flavors1.length;
          var l2 = flavors2.length;
          var l = Math.max(l1, l2);
          var counter = Math.min(l1, l2);
          for (var i = 0; i < l; i++) {
            if (--counter === 0) {
              if (l1 > l2) {
                return -1;
              }
              if (l2 > l1) {
                return 1;
              }
            }
            var flavor1 = flavors1[i].toLowerCase();
            var flavor2 = flavors2[i].toLowerCase();
            if (flavor1 === flavor2) {
              continue;
            }
            return mySort(flavor1.split(/[ .]/), flavor2.split(/[ .]/));
          }
          return 0;
        }

        function mySort(a, b, index) {
          if (!index) {
            index = 0;
          }
          var valueA = a[index];
          var valueB = b[index];
          if (!valueA) {
            return -1;
          }
          if (!valueB) {
            return 1;
          }

          valueA = +valueA;
          valueB = +valueB;

          var aIsNumber = !isNaN(valueA);
          var bIsNumber = !isNaN(valueB);
          if (aIsNumber) {
            if (bIsNumber) {
              if (valueA === valueB) {
                return mySort(a, b, ++index);
              }
              return valueA * 1 - valueB * 1;
            } else {
              return -1;
            }
          } else {
            if (bIsNumber) {
              return 1;
            } else {
              if (valueA > valueB) {
                return 1;
              }
              if (valueA < valueB) {
                return -1;
              }
              return mySort(a, b, ++index);
            }
          }
        }

        start({
          headers: {
            'Content-Type': 'application/json'
          }
        });

        var rows = [];
        var row;
        while ((row = getRow())) {
          rows.push(row);
        }

        rows.sort(sorter);

        send(JSON.stringify(rows));
      }
    },
    filters: {
      copyAdminToCheminfo: function (doc) {
        if (doc._id.substring(0, 7) === '_design') return true;
        if (
          doc.$type === 'entry' &&
          doc.$owners[0] === 'admin@cheminfo.org' &&
          doc.$owners.indexOf('anonymousRead') !== -1
        ) {
          return true;
        }
        return false;
      },
      copyPublic: function (doc) {
        if (doc._id.substring(0, 7) === '_design') return true;
        if (
          doc.$type === 'entry' &&
          doc.$owners.indexOf('anonymousRead') !== -1
        ) {
          return true;
        }
        return false;
      }
    }
  }
};
