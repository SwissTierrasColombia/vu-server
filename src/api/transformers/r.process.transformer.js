import Transformer from 'transformer-response-data';

// Transformers
import { mProcessTransformer } from './m.process.transformer';
import { mStepTransformer } from './m.step.transformer';

//create transformer and define output properties
export let rProcessTransformer = new Transformer({
    "_id": "_id",
    "active": "active",
    "process": {
        "field": "process",
        "reference": mProcessTransformer
    },
    "steps": "steps",
    "stepNameActive": function (data) {
        const steps = data.steps;
        const stepActive = steps.find(item => {
            return item.active === true;
        });
        return stepActive.step.typeStep.step;
    },
    "createdAt": "createdAt",
    "updatedAt": "updatedAt"
});