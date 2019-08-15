import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let mProcessTransformer = new Transformer({
    "_id": "_id",
    "process": "process",
    "variables": "variables",
    "createdAt": "createdAt"
});