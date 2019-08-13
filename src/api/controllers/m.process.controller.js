// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import ProcessImplementation from '../business/manage/process/process.implementation';

// Transformers
import { mProcessTransformer } from '../transformers/m.process.transformer';
import { mRoleTransformer } from '../transformers/m.role.transformer';

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