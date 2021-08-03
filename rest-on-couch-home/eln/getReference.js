
exports.getReference = function(entry) {
    return entry.$id[0] + (entry.$id[1] ? ' ' + entry.$id[1] : '');
};
