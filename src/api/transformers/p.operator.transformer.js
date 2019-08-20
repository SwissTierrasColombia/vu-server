import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let pOperatorTransformer = new Transformer({
    "_id": "_id",
    "operator": "operator",
    "symbol": "symbol",
    "createdAt": "createdAt"
});