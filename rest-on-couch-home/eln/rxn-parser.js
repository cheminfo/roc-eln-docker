'use strict';

function parse(rxn) {
    if (typeof rxn !== 'string') {
        throw new TypeError('Parameter "rxn" must be a string');
    }
    // we will find the delimiter in order to be much faster and not use regular expression
    var header = rxn.substr(0, 1000);
    var crlf = '\n';
    if (header.indexOf('\r\n') > -1) {
        crlf = '\r\n';
    } else if (header.indexOf('\r') > -1) {
        crlf = '\r';
    }

    var rxnParts = rxn.split(crlf + '$MOL' + crlf);

    var reagents=[];
    var products=[];

    var result={};
    result.reagents=reagents;
    result.products=products;


    // the first part is expected to contain the number of reagents and products

    // First part should start with $RXN
    // and the fifth line should contain the number of reagents and products
    if (rxnParts.length===0) throw new Error('file looks empty');

    var header=rxnParts[0];
    if (header.indexOf("$RXN")!=0) throw new Error('file does not start with $RXN');

    var lines=header.split(crlf);
    if (lines.length<5) throw new Error('incorrect number of lines in header');

    var numberReagents=lines[4].substring(0,3) >> 0;
    var numberProducts=lines[4].substring(3,6) >> 0;

    if (numberReagents+numberProducts!=rxnParts.length-1) throw new Error('not the correct number of molecules');

    for (var i=1; i<rxnParts.length; i++) {
        if (i<=numberReagents) {
            reagents.push(rxnParts[i]);
        } else {
            products.push(rxnParts[i]);
        }
    }
    return result;

}

module.exports = parse;
