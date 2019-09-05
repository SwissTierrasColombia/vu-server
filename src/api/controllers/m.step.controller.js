// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import FieldImplementation from '../business/pm/manage/field/field.implementation';
import StepImplementation from '../business/pm/manage/step/step.implementation';

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
        req.checkBody("nameField", getMessage('m.process.fields.field_name_required', language)).notEmpty();

        // validate field type
        req.checkBody("type", getMessage('m.process.fields.field_type_required', language)).notEmpty();
        req.checkBody("type", getMessage('m.process.fields.field_type_invalid', language)).isMongoId();

        // validate is required
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).notEmpty();
        req.checkBody("isRequired", getMessage('m.process.fields.field_is_required_required', language)).isBoolean();

        // validate permissions
        // req.checkBody("permissions", getMessage('m.process.fields.field_permissions_required', language)).notEmpty();
        // req.check('permissions', getMessage('m.process.fields.field_permissions_required', language)).custom((value) => {
        //     return req.body.permissions !== Array;
        // });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const nameField = req.body.nameField;
        const pTypeId = req.body.type;
        const isRequired = req.body.isRequired;
        const permissions = req.body.permissions;
        const description = req.body.description;
        const metadata = req.body.metadata;

        const fieldNew = await FieldImplementation.iCreateField(nameField, description, pTypeId, isRequired, permissions, metadata, mStepId);
        return result(res, 201, mFieldTransformer.transformer(fieldNew));
    } catch (exception) {
        console.log("m.step@addFieldToStep ---->", exception);
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
        console.log("m.step@getFieldsFromStep ---->", exception);
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
        // req.checkBody("permissions", getMessage('m.process.fields.field_permissions_required', language)).notEmpty();
        // req.check('permissions', getMessage('m.process.fields.field_permissions_required', language)).custom((value) => {
        //     return req.body.permissions !== Array;
        // });

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
        const metadata = req.body.metadata;

        const fieldUpdate = await FieldImplementation.iUpdateField(mFieldId, nameField, description, pTypeId, isRequired, permissions, metadata, mStepId);
        return result(res, 200, mFieldTransformer.transformer(fieldUpdate));
    } catch (exception) {
        console.log("m.step@updateFieldFromStep ---->", exception);
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
        console.log("m.step@removeFieldFromStep ---->", exception);
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
        console.log("m.step@addRuleToStep ---->", exception);
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
        console.log("m.step@removeRuleToStep ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// add role to step
export async function addRoleToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate role
        req.checkBody("role", getMessage('m.process.roles.role_required', language)).notEmpty();
        req.checkBody("role", getMessage('m.process.roles.role_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const vuRoleId = req.body.role;

        const stepUpdated = await StepImplementation.iAddRoleToStep(mStepId, vuRoleId);

        return result(res, 200, mStepTransformer.transformer(stepUpdated));
    } catch (exception) {
        console.log("m.step@addRoleToStep ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove role to step
export async function removeRoleToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate role
        req.check('role', getMessage('m.process.roles.role_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.role.value);
        });
        req.check('role', getMessage('m.process.roles.role_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.role.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const vuRoleId = req.swagger.params.role.value;

        const stepUpdated = await StepImplementation.iRemoveRoleToStep(mStepId, vuRoleId);

        return result(res, 200, mStepTransformer.transformer(stepUpdated));
    } catch (exception) {
        console.log("m.step@removeRoleToStep ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// set origin step
export async function setOriginStep(req, res) {

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

        const stepUpdated = await StepImplementation.updateStepToOrigin(mStepId);

        return result(res, 200, mStepTransformer.transformer(stepUpdated));
    } catch (exception) {
        console.log("m.step@setOriginStep ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// set entity to step
export async function setEntityToStep(req, res) {

    const language = 'es';

    try {

        // validate m/step id
        req.check('step', getMessage('m.process.steps.step_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.step.value);
        });
        req.check('step', getMessage('m.process.steps.step_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.step.value);
        });

        // validate entity
        req.check('entity', getMessage('m.process.entities.entity_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.entity.value);
        });
        req.check('entity', getMessage('m.process.entities.entity_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.entity.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const mStepId = req.swagger.params.step.value;
        const vuEntityId = req.swagger.params.entity.value;

        const stepUpdated = await StepImplementation.iSetEntityToStep(mStepId, vuEntityId);

        return result(res, 200, mStepTransformer.transformer(stepUpdated));
    } catch (exception) {
        console.log("m.step@setEntityToStep ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}