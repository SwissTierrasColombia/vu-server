import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let mStepTransformer = new Transformer({
    "_id": "_id",
    "typeStep": "typeStep",
    "rules": "rules",
    "roles": "roles",
    "createdAt": "createdAt"
});