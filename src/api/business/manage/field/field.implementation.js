// Business
import FieldBusiness from './field.business';
import TypeDataBusiness from '../../parameterize/typeData/typeData.business';
import StepBusiness from '../step/step.business';
import RoleBusiness from '../role/role.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class FieldImplementation extends FieldBusiness {

    constructor() {
        super();
    }


    static async iCreateField(name, description, pTypeId, isRequired, permissions, mStepId) {

        // verify if step exists
        const mStepFound = await StepBusiness.getStepById(mStepId);
        if (!mStepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        // verify if type exists
        const pTypeDataFound = await TypeDataBusiness.getTypeDataById(pTypeId);
        if (!pTypeDataFound) {
            throw new APIException('p.types_data.type_not_exists', 404);
        }

        // verify the field name
        name = name.replace(new RegExp(' ', 'g'), '_').toLowerCase().trim();
        const patt = new RegExp(/^[a-z0-9\s_]+$/g);
        if (!patt.test(name)) {
            throw new APIException('m.process.fields.field_name_invalid', 401);
        }

        // verify that the field is not registered in step
        const fieldFound = await this.getFieldByNameAndStep(name.trim(), mStepId);
        if (fieldFound) {
            throw new APIException('m.process.steps.step_field_registered', 401);
        }

        description = (description) ? description : '';

        // verify permissions
        const permissionsValid = [];
        const processId = mStepFound.process.toString();
        for (let property in permissions) {
            const permission = permissions[property];
            const isFormatValid = permission.hasOwnProperty('role') && permission.hasOwnProperty('create') &&
                permission.hasOwnProperty('read') && permission.hasOwnProperty('update');
            if (isFormatValid) {
                // verify if role exists in the process
                const role = await RoleBusiness.getRoleById(permission.role);
                if (role.process.toString() === processId) {
                    permissionsValid.push(permission);
                }
            }
        }
        const rolesProcess = await RoleBusiness.getRolesByProcess(processId);
        let countRoles = 0;
        for (let property in rolesProcess) {
            const role = rolesProcess[property];
            const roleFound = permissionsValid.find(function (element) {
                return element.role.toString() === role._id.toString();
            });
            if (roleFound) {
                countRoles++;
            }
        }
        if (countRoles !== rolesProcess.length) {
            throw new APIException('m.process.fields.field_permissions_required', 401);
        }

        const fieldNew = await FieldBusiness.createField(name, description, pTypeId, isRequired, permissionsValid, mStepId);

        return await FieldBusiness.getFieldById(fieldNew._id.toString(), ['step', 'typeData']);
    }

    static async getFieldsByStep(mStepId) {

        // verify if step exists
        const mStepFound = await StepBusiness.getStepById(mStepId);
        if (!mStepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        return await FieldBusiness.getFieldsByStep(mStepId, ['step', 'typeData']);
    }

    static async iRemoveField(mFieldId, mStepId) {

        // verify if field exists
        const fieldFound = await FieldBusiness.getFieldById(mFieldId);
        if (!fieldFound) {
            throw new APIException('m.process.fields.field_not_exists', 404);
        }

        // verify if step exists
        const mStepFound = await StepBusiness.getStepById(mStepId);
        if (!mStepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        // verify if field belongs to step
        if (fieldFound.step.toString() !== mStepFound._id.toString()) {
            throw new APIException('m.process.fields.field_not_belongs_to_step', 401);
        }

        await FieldBusiness.removeFieldById(mFieldId);
    }

}