// Libs
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import DepartmentImplementation from '../business/vu/deparment/department.implementation';

// Transformers
import { vuDepartmentTransformer } from '../transformers/vu.department.transformer';
import { vuMunicipalityTransformer } from '../transformers/vu.municipality.transformer';

// get departments
export async function getDepartments(req, res) {

    try {
        const departments = await DepartmentImplementation.iGetDepartments();
        return result(res, 200, vuDepartmentTransformer.transformer(departments));
    } catch (exception) {
        console.log("vu.department@getDepartments ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

// get municipalities by department
export async function getMunicipalitiesByDeparment(req, res) {

    const language = 'es';

    try {

        // validate department
        req.check('department', getMessage('vu.departments.department_required', language)).custom((value) => {
            return !validator.isEmpty(req.swagger.params.department.value);
        });
        req.check('department', getMessage('vu.departments.department_invalid', language)).custom((value) => {
            return validator.isMongoId(req.swagger.params.department.value);
        });

        const errors = req.validationErrors();
        if (errors) {
            return badRequest(res, 400, { message: errors[0].msg });
        }

        const departmentId = req.swagger.params.department.value;

        const municipalities = await DepartmentImplementation.iGetMunicipalitiesByDepartment(departmentId);
        return result(res, 200, vuMunicipalityTransformer.transformer(municipalities));
    } catch (exception) {
        console.log("vu.department@getMunicipalitiesByDeparment ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}

