import Transformer from 'transformer-response-data';

// Transformers
import { mStepTransformer } from './m.step.transformer';
import { pTypeDataTransformer } from './p.typeData.transformer';

//create transformer and define output properties
export let mFieldTransformer = new Transformer({
    "_id": "_id",
    "field": "field",
    "description": "description",
    "isRequired": "isRequired",
    "isPrivate": "isPrivate",
    "permissions": "permissions",
    "createdAt": "createdAt",
    "step": {
        "field": "step",
        "reference": mStepTransformer
    },
    "typeData": {
        "field": "typeData",
        "reference": pTypeDataTransformer
    },
});