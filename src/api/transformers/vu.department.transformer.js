import Transformer from 'transformer-response-data';

//create transformer and define output properties
export let vuDepartmentTransformer = new Transformer({
    "_id": "_id",
    "department": "department",
    "createdAt": "createdAt"
});