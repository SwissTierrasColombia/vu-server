import Transformer from 'transformer-response-data';

// Transformers
import { mProcessTransformer } from './m.process.transformer';
import { mStepTransformer } from './m.step.transformer';

//create transformer and define output properties
export let rProcessTransformer = new Transformer({
    "_id": "_id",
    "process": {
        "field": "process",
        "reference": mProcessTransformer
    },
    "step": {
        "field": "step",
        "reference": mStepTransformer
    },
    "data": "data",
    "metadata": "metadata",
    "createdAt": "createdAt",
    "updatedAt": "updatedAt"
});