// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import FieldImplementation from '../business/manage/field/field.implementation';

// Transformers
import { mFieldTransformer } from '../transformers/m.field.transformer';

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

        const mStepId = req.swagger.params.step.value;
        const nameField = req.body.field;
        const pTypeId = req.body.type;
        const isRequired = req.body.isRequired;
        const permissions = req.body.permissions;
        const description = req.body.description;

        const fieldNew = await FieldImplementation.iCreateField(nameField, description, pTypeId, isRequired, permissions, mStepId);
        return result(res, 201, mFieldTransformer.transformer(fieldNew));
    } catch (exception) {
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

