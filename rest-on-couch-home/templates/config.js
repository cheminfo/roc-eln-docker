module.exports = {
    defaultEntry: function() {
        return {};
    },
    customDesign: {
        views: {
            toc: {
                withOwner: true,
                map: function (doc) {
                    var emitWithOwner = function (key, data) {
                        for (var i = 0; i < doc.$owners.length; i++) {
                            emit([doc.$owners[i]].concat(key), data);
                        }
                    };
                    emitWithOwner(
                        [doc.$id],
                        {
                            title: doc.$content.title,
                            category: doc.$content.category,
                            modificationDate: doc.$modificationDate
                        }
                    );
                }
            },
            template: {
                withOwner: true,
                map: function (doc) {
                    var emitWithOwner = function (key, data) {
                        for (var i = 0; i < doc.$owners.length; i++) {
                            emit([doc.$owners[i]].concat(key), data);
                        }
                    };
                    for (var j = 0; j < doc.$content.category.length; j++) {
                        emitWithOwner(
                            [doc.$content.category[j].value],
                            {
                                title: doc.$content.title
                            }
                        );
                    }
                }
            }
        }
    }
};
