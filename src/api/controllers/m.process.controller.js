// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/pm/manage/process/process.implementation';

// Transformers
import { mProcessTransformer } from '../transformers/m.process.transformer';
import { mRoleTransformer } from '../transformers/m.role.transformer';
import { mStepTransformer } from '../transformers/m.step.transformer';
import { mVariableTransformer } from '../transformers/m.variable.transformer';
import { mUserTransformer } from '../transformers/m.user.transformer';

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
        const processDescription = req.body.processDescription;

        const processNew = await ProcessImplementation.registerProcess(processName, processDescription);

        return result(res, 201, mProcessTransformer.transformer(processNew));
    } catch (exception) {
        console.log("m.process@createProcess ---->", exception);
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

        const propAvailable = req.swagger.params.available.value;

        const processes = await ProcessImplementation.getProcesses(propAvailable);
        return result(res, 200, mProcessTransformer.transformer(processes));
    } catch (exception) {
        console.log("m.process@getProcesses ---->", exception);
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
        console.log("m.process@addRoleToProcess ---->", exception);
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
        console.log("m.process@getRolesByProcess ---->", exception);
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
        console.log("m.process@updateRoleFromProcess ---->", exception);
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
        console.log("m.process@removeRoleFromProcess ---->", exception);
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
        console.log("m.process@addStepToProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove step to process
export async function removeStepToProcess(req, res) {

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

        const processId = req.swagger.params.process.value;
        const mStepId = req.swagger.params.step.value;

        await ProcessImplementation.iRemoveStepToProcess(processId, mStepId);

        const steps = await ProcessImplementation.iGetStepsByProcess(processId);
        return result(res, 200, mStepTransformer.transformer(steps));
    } catch (exception) {
        console.log("m.process@removeStepToProcess ---->", exception);
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
        console.log("m.process@getStepsFromProcess ---->", exception);
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
        console.log("m.process@addVariableToProcess ---->", exception);
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
        console.log("m.process@getVariablesByProcess ---->", exception);
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
        console.log("m.process@updateVariableFromProcess ---->", exception);
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
        console.log("m.process@removeVariableFromProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

export async function removeProcess(req, res) {

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


        await ProcessImplementation.iRemoveProcess(processId);

        return result(res, 204, {});
    } catch (exception) {
        console.log("m.process@removeProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}


export async function updateProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validation process name
        req.checkBody("processName", getMessage('m.process.process_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const processName = req.body.processName;
        const processDescription = req.body.processDescription;


        const process = await ProcessImplementation.iUpdateProcess(processId, processName, processDescription);

        return result(res, 200, mProcessTransformer.transformer(process));
    } catch (exception) {
        console.log("m.process@updateProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// add user to process
export async function addUserToProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate first name
        req.checkBody("firstName", getMessage('m.process.users.firstname_required', language)).notEmpty();

        // validate last name
        req.checkBody("lastName", getMessage('m.process.users.lastname_required', language)).notEmpty();

        // validate username
        req.checkBody("username", getMessage('m.process.users.username_required', language)).notEmpty();

        // validate roles
        req.checkBody("roles", getMessage('m.process.users.roles_required', language)).notEmpty();
        req.check('roles', getMessage('m.process.users.roles_invalid', language)).custom((value) => {
            return req.body.roles !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const roles = req.body.roles;

        await ProcessImplementation.iAddUserToProcess(processId, firstName, lastName, username, roles);

        const users = await ProcessImplementation.iGetUsersByProcess(processId);
        return result(res, 200, mUserTransformer.transformer(users));
    } catch (exception) {
        console.log("m.process@addUserToProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get users to process
export async function getUsersToProcess(req, res) {

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

        const users = await ProcessImplementation.iGetUsersByProcess(processId);
        return result(res, 200, mUserTransformer.transformer(users));
    } catch (exception) {
        console.log("m.process@getUsersToProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// update user to process
export async function updateUserToProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate user id
        req.check('user', getMessage('m.process.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('m.process.users.user_required', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        // validate first name
        req.checkBody("firstName", getMessage('m.process.users.firstname_required', language)).notEmpty();

        // validate last name
        req.checkBody("lastName", getMessage('m.process.users.lastname_required', language)).notEmpty();

        // validate username
        req.checkBody("username", getMessage('m.process.users.username_required', language)).notEmpty();

        // validate roles
        req.checkBody("roles", getMessage('m.process.users.roles_required', language)).notEmpty();
        req.check('roles', getMessage('m.process.users.roles_invalid', language)).custom((value) => {
            return req.body.roles !== Array;
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const userId = req.swagger.params.user.value;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const roles = req.body.roles;

        await ProcessImplementation.iUpdateUserFromProcess(processId, userId, firstName, lastName, username, roles);

        const users = await ProcessImplementation.iGetUsersByProcess(processId);
        return result(res, 200, mUserTransformer.transformer(users));
    } catch (exception) {
        console.log("m.process@updateUserToProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// remove role from process
export async function removeUserFromProcess(req, res) {

    const language = 'es';

    try {

        // validate process id
        req.check('process', getMessage('m.process.process_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.process.value);
        });
        req.check('process', getMessage('m.process.process_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.process.value);
        });

        // validate user id
        req.check('user', getMessage('m.process.users.user_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.user.value);
        });
        req.check('user', getMessage('m.process.users.user_required', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.user.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const processId = req.swagger.params.process.value;
        const userId = req.swagger.params.user.value;

        await ProcessImplementation.iRemoveUserFromProcess(processId, userId);

        return result(res, 204, {});
    } catch (exception) {
        console.log("m.process@removeRoleFromProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// deploy process
export async function deployProcess(req, res) {

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

        const process = await ProcessImplementation.deployProcess(processId);

        return result(res, 200, mProcessTransformer.transformer(process));
    } catch (exception) {
        console.log("m.process@deployProcess ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get steps flow
export async function getStepsFlow(req, res) {

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

        const data = await ProcessImplementation.iGetStepsFlow(processId);

        return result(res, 200, data);
    } catch (exception) {
        console.log("m.process@getStepsFlow ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}