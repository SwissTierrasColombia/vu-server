import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let pStepTransformer = new Transformer({
    "_id": "_id",
    "step": "step",
    "createdAt": "createdAt"
});