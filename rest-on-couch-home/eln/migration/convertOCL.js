const path = require('path');
const superagent = require('superagent');
const password = process.env.COUCHDB_PASSWORD;
const OCL = require('openchemlib');
const db = 'eln';
const host = 'localhost:5984';
updateDB().then(() => console.log('success')).catch((e) =>  console.log('update failed', e.message));

async function updateDB() {
    let samples = await getAllSamples();
    samples = JSON.parse(samples.text).rows;
    let reactions = await getAllReactions();
    reactions = JSON.parse(reactions.text).rows;

    console.log(samples.length, reactions.length);
    let count = 0;
    //for(let i=0; i<samples.length; i++) {
    //     await updateSample(samples[i].doc);
    //      count++;
    //}

    console.log(`updated ${count} samples`);
    count = 0;
    for (let i=0; i<reactions.length; i++) {
        await updateReaction(reactions[i].doc);
        count++;
    }
    console.log(`updated ${count} reactions`);
}

function getAllSamples() {
    return superagent.get(`http://admin:${password}@${host}/${db}/_design/app/_view/entryByKind?key="sample"&reduce=false&include_docs=true`);
}

function getAllReactions() {
    return superagent.get(`http://admin:${password}@${host}/${db}/_design/app/_view/entryByKind?key="reaction"&reduce=false&include_docs=true`);    
}

function updateSample(entry) {
    console.log(entry._id);
    const general = entry.$content.general;
    if(!general) return;
    const molfile = general.molfile;
    if(!molfile) return;
    const mol = OCL.Molecule.fromMolfile(molfile);
    const oclid = mol.getIDCodeAndCoordinates();
    entry.$content.general.ocl = {
        value: oclid.idCode,
        coordinates: oclid.coordinates,
        index: mol.getIndex()
    };

    return superagent.put(`http://admin:${password}@${host}/${db}/${entry._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(entry);
}

function updateReaction(entry) {
    console.log(entry._id);
    const reagents = entry.$content.reagents;
    const products = entry.$content.products;

    for(let reagent of reagents) {
        setIndex(reagent);
    }
    for(let product of products) {
        setIndex(product);
    }
    function setIndex(el) {
        if(!el.ocl) return;
        const idCode = el.ocl.idCode;
        const coordinates = el.ocl.coordinates;
        const mol = OCL.Molecule.fromIDCode(idCode);        
        el.ocl = {
            value: idCode,
            coordinates,
            index: mol.getIndex()
        }
    }
    return superagent.put(`http://admin:${password}@${host}/${db}/${entry._id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(entry);
}
