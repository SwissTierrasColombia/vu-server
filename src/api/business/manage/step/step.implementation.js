// Business
import StepBusiness from './step.business';
import FieldBusiness from '../field/field.business';
import OperatorBusiness from '../../parameterize/operator/operator.business';
import CallbackBusiness from '../../parameterize/callback/callback.business';
import TypeDataBusiness from '../../parameterize/typeData/typeData.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class StepImplementation extends StepBusiness {

    constructor() {
        super();
    }

    static async iAddRuleToStep(mStepId, conditions, callbacks) {

        // verify if step exists
        const mStepFound = await this.getStepById(mStepId);
        if (!mStepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        // validate conditions
        let conditionsValid = 0;
        for (let property in conditions) {
            const dataCondition = conditions[property];
            if (dataCondition.hasOwnProperty('field') && dataCondition.hasOwnProperty('operator') && dataCondition.hasOwnProperty('value')) {
                const fieldFound = await FieldBusiness.getFieldById(dataCondition.field);
                const operatorFound = await OperatorBusiness.getOperatorById(dataCondition.operator);
                const verifyField = fieldFound && fieldFound.step.toString() === mStepId.toString();
                const verifyOperator = operatorFound;
                const verifyValue = dataCondition.value;
                if (verifyField && verifyOperator && verifyValue) {
                    conditionsValid++;
                }
            }
        }
        const verifyConditions = conditions.length === conditionsValid;
        if (!verifyConditions) {
            throw new APIException('m.process.rules.rule_conditions_invalid', 401);
        }

        // validate callbacks
        let callbacksValid = 0;
        for (let property in callbacks) {
            const dataCallaback = callbacks[property];
            if (dataCallaback.hasOwnProperty('callback') && dataCallaback.hasOwnProperty('metadata')) {
                const callbackFound = await CallbackBusiness.getCallbackById(dataCallaback.callback);
                if (callbackFound) {
                    let metadataValid = 0;
                    callbackFound.fields.forEach((field) => {
                        if (dataCallaback.metadata.hasOwnProperty(field.field)) {
                            const verifyTypeData = TypeDataBusiness.verifyTypeData(field.typeData, dataCallaback.metadata[field.field]);
                            if (verifyTypeData) {
                                metadataValid++;
                            }
                        }
                    });
                    if (callbackFound.fields.length === metadataValid) {
                        callbacksValid++;
                    }
                }
            }
        }
        const verifyCallbacks = callbacks.length === callbacksValid;
        if (!verifyCallbacks) {
            throw new APIException('m.process.rules.rule_callbacks_invalid', 401);
        }

        const rule = {
            conditions,
            callbacks
        };

        await this.addRuleToStep(mStepId, rule);

        return await this.getStepById(mStepId);
    }

    static async iRemoveRuleToStep(stepId, ruleId) {

        // verify if step exists
        const mStepFound = await this.getStepById(stepId);
        if (!mStepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        // verify if rule exists
        const rules = mStepFound.rules;
        let ruleFound = false;
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule._id.toString() === ruleId.toString()) {
                ruleFound = true;
            }
        }
        if (!ruleFound) {
            throw new APIException('m.process.rules.rule_not_exists', 404);
        }

        await StepBusiness.removeRuleToStep(stepId, ruleId);
    }

}