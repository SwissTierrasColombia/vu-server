// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/manage/process/process.implementation';

// Transformers
import { mProcessTransformer } from '../transformers/m.process.transformer';
import { mRoleTransformer } from '../transformers/m.role.transformer';
import { mStepTransformer } from '../transformers/m.step.transformer';
import { mVariableTransformer } from '../transformers/m.variable.transformer';

// create process
export async function createProcess(req, res) {

    const language = 'es';

    try {

        // validation process name
        req.checkBody("processName", getMessage('m.process.process_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processName = req.body.processName;

        const processNew = await ProcessImplementation.registerProcess(processName);

        return result(res, 201, mProcessTransformer.transformer(processNew));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get processes
export async function getProcesses(req, res) {

    const language = 'es';

    try {
        const processes = await ProcessImplementation.getProcesses();
        return result(res, 200, mProcessTransformer.transformer(processes));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// add role to process
export async function addRoleToProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate role
        req.checkBody("role", getMessage('m.process.process_role_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const role = req.body.role;

        await ProcessImplementation.iAddRoleToProcess(processId, role);

        const roles = await ProcessImplementation.iGetRolesByProcess(processId);
        return result(res, 200, mRoleTransformer.transformer(roles));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get roles by process
export async function getRolesByProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const roles = await ProcessImplementation.iGetRolesByProcess(processId);

        return result(res, 200, mRoleTransformer.transformer(roles));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// update role from process
export async function updateRoleFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate role id
        req.check('role', getMessage('m.process.roles.role_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.role.value);
        });
        req.check('role', getMessage('m.process.roles.role_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.role.value);
        });

        // validate role
        req.checkBody("name", getMessage('m.process.roles.role_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const roleId = req.swagger.params.role.value;
        const roleName = req.body.name;

        await ProcessImplementation.iUpdateRoleFromProcess(processId, roleId, roleName);

        const roles = await ProcessImplementation.iGetRolesByProcess(processId);
        return result(res, 200, mRoleTransformer.transformer(roles));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove role from process
export async function removeRoleFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate role id
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

        const processId = req.swagger.params.process.value;
        const roleId = req.swagger.params.role.value;

        await ProcessImplementation.iRemoveRoleFromProcess(processId, roleId);

        return result(res, 204, {});
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}


// add step to process
export async function addStepToProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate step id
        req.checkBody("step", getMessage('m.process.steps.step_required', language)).notEmpty();
        req.checkBody("step", getMessage('m.process.steps.step_invalid', language)).isMongoId();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const pStepId = req.body.step;

        await ProcessImplementation.iAddStepToProcess(processId, pStepId);

        const steps = await ProcessImplementation.iGetStepsByProcess(processId);
        return result(res, 200, mStepTransformer.transformer(steps));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}


// get roles by process
export async function getStepsFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;

        const steps = await ProcessImplementation.iGetStepsByProcess(processId);
        return result(res, 200, mStepTransformer.transformer(steps));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// add variable to process
export async function addVariableToProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate variable
        req.checkBody("variable", getMessage('m.process.variables.variable_name_required', language)).notEmpty();

        // validate value
        req.checkBody("value", getMessage('m.process.variables.variable_value_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const variableName = req.body.variable;
        const variableValue = req.body.value;

        await ProcessImplementation.iAddVariableToProcess(processId, variableName, variableValue);

        const variables = await ProcessImplementation.iGetVariablesByProcess(processId);
        return result(res, 200, mVariableTransformer.transformer(variables));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get variables by process
export async function getVariablesByProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;

        const variables = await ProcessImplementation.iGetVariablesByProcess(processId);

        return result(res, 200, mVariableTransformer.transformer(variables));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// update variable from process
export async function updateVariableFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate variable id
        req.check('variable', getMessage('m.process.variables.variable_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.variable.value);
        });
        req.check('variable', getMessage('m.process.variables.variable_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.variable.value);
        });

        // validate role
        req.checkBody("name", getMessage('m.process.variables.variable_name_invalid', language)).notEmpty();

        // validate value
        req.checkBody("value", getMessage('m.process.variables.variable_value_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const variableId = req.swagger.params.variable.value;
        const variableName = req.body.name;
        const variableValue = req.body.value;

        await ProcessImplementation.iUpdateVariableFromProcess(processId, variableId, variableName, variableValue);

        const variables = await ProcessImplementation.iGetVariablesByProcess(processId);
        return result(res, 200, mVariableTransformer.transformer(variables));
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove variable from process
export async function removeVariableFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate variable id
        req.check('variable', getMessage('m.process.variables.variable_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.variable.value);
        });
        req.check('variable', getMessage('m.process.variables.variable_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.variable.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const variableId = req.swagger.params.variable.value;

        await ProcessImplementation.iRemoveVariableFromProcess(processId, variableId);

        return result(res, 204, {});
    } catch (exception) {
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}