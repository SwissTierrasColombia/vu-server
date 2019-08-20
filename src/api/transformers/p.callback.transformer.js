import Transformer from 'transformer-response-data';

// Transformers
import { pTypeDataTransformer } from './p.typeData.transformer';

//create transformer and define output properties
export let pCallbackTransformer = new Transformer({
    "_id": "_id",
    "callback": "callback",
    "fields": "fields",
    "createdAt": "createdAt"
});