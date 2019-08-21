// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import FieldImplementation from '../business/manage/field/field.implementation';
import StepImplementation from '../business/manage/step/step.implementation';

// Transformers
import { mFieldTransformer } from '../transformers/m.field.transformer';
import { mStepTransformer } from '../transformers/m.step.transformer';

// add field to step
export async function addFieldToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate field name
        req.checkBody("field", getMessage('m.process.fields.field_name_required', language)).notEmpty();

        // validate field type
        req.checkBody("type", getMessage('m.process.fields.field_type_required', language)).notEmpty();
        req.checkBody("type", getMessage('m.process.fields.field_type_invalid', language)).isMongoId();

        // validate is required
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).notEmpty();
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).isBoolean();

        // validate permissions
        req.checkBody("permissions", getMessage('m.process.fields.field_permissions_required', language)).notEmpty();
        req.check('permissions', getMessage('m.process.fields.field_permissions_required', language)).custom((value) => {
            return req.body.permissions !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const nameField = req.body.field;
        const pTypeId = req.body.type;
        const isRequired = req.body.isRequired;
        const permissions = req.body.permissions;
        const description = req.body.description;

        const fieldNew = await FieldImplementation.iCreateField(nameField, description, pTypeId, isRequired, permissions, mStepId);
        return result(res, 201, mFieldTransformer.transformer(fieldNew));
    } catch (exception) {
        console.log('error --->', exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get fields from step
export async function getFieldsFromStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;

        const fields = await FieldImplementation.getFieldsByStep(mStepId);
        return result(res, 200, mFieldTransformer.transformer(fields));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// update field from step
export async function updateFieldFromStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate m/field id
        req.check('field', getMessage('m.process.steps.field_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.field.value);
        });
        req.check('field', getMessage('m.process.steps.field_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.field.value);
        });

        // validate field name
        req.checkBody("nameField", getMessage('m.process.fields.field_name_required', language)).notEmpty();

        // validate field type
        req.checkBody("type", getMessage('m.process.fields.field_type_required', language)).notEmpty();
        req.checkBody("type", getMessage('m.process.fields.field_type_invalid', language)).isMongoId();

        // validate is required
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).notEmpty();
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).isBoolean();

        // validate permissions
        req.checkBody("permissions", getMessage('m.process.fields.field_permissions_required', language)).notEmpty();
        req.check('permissions', getMessage('m.process.fields.field_permissions_required', language)).custom((value) => {
            return req.body.permissions !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const mFieldId = req.swagger.params.field.value;
        const nameField = req.body.nameField;
        const pTypeId = req.body.type;
        const isRequired = req.body.isRequired;
        const permissions = req.body.permissions;
        const description = req.body.description;

        const fieldUpdate = await FieldImplementation.iUpdateField(mFieldId, nameField, description, pTypeId, isRequired, permissions, mStepId);
        return result(res, 200, mFieldTransformer.transformer(fieldUpdate));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove field from step
export async function removeFieldFromStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate field
        req.check('field', getMessage('m.process.fields.field_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.field.value);
        });
        req.check('field', getMessage('m.process.fields.field_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.field.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const mFieldId = req.swagger.params.field.value;

        await FieldImplementation.iRemoveField(mFieldId, mStepId);

        return result(res, 204, {});
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// add rule to step
export async function addRuleToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate conditions
        req.checkBody("conditions", getMessage('m.process.rules.rule_conditions_required', language)).notEmpty();
        req.check('conditions', getMessage('m.process.rules.rule_conditions_required', language)).custom((value) => {
            return req.body.conditions !== Array;
        });

        // validate callbacks
        req.checkBody("callbacks", getMessage('m.process.rules.rule_callbacks_required', language)).notEmpty();
        req.check('callbacks', getMessage('m.process.rules.rule_callbacks_required', language)).custom((value) => {
            return req.body.callbacks !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const conditions = req.body.conditions;
        const callbacks = req.body.callbacks;

        const stepUpdated = await StepImplementation.iAddRuleToStep(mStepId, conditions, callbacks);

        return result(res, 200, mStepTransformer.transformer(stepUpdated));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove rule from step
export async function removeRuleToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate rule
        req.check('rule', getMessage('m.process.rules.rule_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.rule.value);
        });
        req.check('rule', getMessage('m.process.rules.rule_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.rule.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const ruleId = req.swagger.params.rule.value;

        await StepImplementation.iRemoveRuleToStep(mStepId, ruleId);

        return result(res, 204, {});
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}