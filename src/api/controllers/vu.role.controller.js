// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import RoleImplementation from '../business/vu/role/role.implementation';

// Transformers
import { vuRoleTransformer } from '../transformers/vu.role.transformer';

// get roles
export async function getRoles(req, res) {

    try {

        const roles = await RoleImplementation.iGetRoles();
        return result(res, 200, vuRoleTransformer.transformer(roles));
    } catch (exception) {
        console.log("vu.role@getRoles ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// create role
export async function createRole(req, res) {

    const language = 'es';

    try {

        // validate role
        req.checkBody("role", getMessage('vu.roles.role_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const roleName = req.body.role.trim();

        const role = await RoleImplementation.iCreateRole(roleName);

        return result(res, 200, vuRoleTransformer.transformer(role));
    } catch (exception) {
        console.log("vu.role@createRole ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get role
export async function getRole(req, res) {

    const language = 'es';

    try {

        // validate role id
        req.check('role', getMessage('vu.roles.role_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.role.value);
        });
        req.check('role', getMessage('vu.roles.role_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.role.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const roleId = req.swagger.params.role.value;

        const role = await RoleImplementation.iGetRole(roleId);

        return result(res, 200, vuRoleTransformer.transformer(role));
    } catch (exception) {
        console.log("vu.role@getRole ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// udpate role
export async function updateRole(req, res) {

    const language = 'es';

    try {

        // validate role id
        req.check('role', getMessage('vu.roles.role_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.role.value);
        });
        req.check('role', getMessage('vu.roles.role_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.role.value);
        });

        // validate firstName
        req.checkBody("name", getMessage('vu.roles.role_name_required', language)).notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const roleId = req.swagger.params.role.value;
        const roleName = req.body.name.trim();

        const role = await RoleImplementation.iUpdateRole(roleId, roleName);

        return result(res, 200, vuRoleTransformer.transformer(role));
    } catch (exception) {
        console.log("vu.role@updateRole ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// delete role
export async function deleteRole(req, res) {

    const language = 'es';

    try {

        // validate role id
        req.check('role', getMessage('vu.roles.role_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.role.value);
        });
        req.check('role', getMessage('vu.roles.role_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.role.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const roleId = req.swagger.params.role.value;

        await RoleImplementation.iDeleteRole(roleId);

        const roles = await RoleImplementation.iGetRoles();

        return result(res, 200, vuRoleTransformer.transformer(roles));
    } catch (exception) {
        console.log("vu.role@deleteRole ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}