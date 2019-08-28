import Transformer from 'transformer-response-data';

// Transformers
import { mProcessTransformer } from './m.process.transformer';

//create transformer and define output properties
export let mUserTransformer = new Transformer({
    "_id": "_id",
    "firstName": "firstName",
    "lastName": "lastName",
    "username": "username",
    "roles": "roles",
    "process": {
        "field": "process",
        "reference": mProcessTransformer
    },
    "createdAt": "createdAt",
});