import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let vuMunicipalityTransformer = new Transformer({
    "_id": "_id",
    "municipality": "municipality",
    "createdAt": "createdAt"
});