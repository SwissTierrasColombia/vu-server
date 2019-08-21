// Libs
import { getMessage } from '../../../../lib/helpers/locales';

// Business
import ProcessBusiness from './process.business';
import RoleBusiness from '../role/role.business';
import StepBusiness from '../step/step.business';
import FieldBusiness from '../field/field.business';
import VariableBusiness from '../variable/variable.business';
import TypeDataBusiness from '../../parameterize/typeData/typeData.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class ProcessImplementation extends ProcessBusiness {

    constructor() {
        super();
    }

    static async registerProcess(name) {
        return await this.createProcess(name);
    }

    static async getProcesses() {
        return await this.getAllProcesses();
    }

    static async iAddRoleToProcess(processId, role) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify that the role is not registered in the process
        const roleFound = await RoleBusiness.getRoleByNameAndProcess(role.trim(), processId);
        if (roleFound) {
            throw new APIException('m.process.process_role_registered', 401);
        }

        await RoleBusiness.createRole(role.trim(), processId);

        return processFound;
    }

    static async iGetRolesByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await RoleBusiness.getRolesByProcess(processId);
    }

    static async iUpdateRoleFromProcess(processId, roleId, roleName) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const roleFound = await RoleBusiness.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('m.process.roles.role_not_exists', 404);
        }

        // verify if the role belong to process
        if (roleFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.role_not_belongs_process', 401);
        }

        await RoleBusiness.updateRoleFromProcess(processId, roleId, roleName);

        return processFound;
    }

    static async iRemoveRoleFromProcess(processId, roleId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const roleFound = await RoleBusiness.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('m.process.roles.role_not_exists', 404);
        }

        // verify if the role belong to process
        if (roleFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.role_not_belongs_process', 401);
        }

        await RoleBusiness.removeRoleById(roleId);
    }

    static async iAddStepToProcess(processId, pStepId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify that the step is not registered in the process
        const stepFound = await StepBusiness.getStepByTypeAndProcess(pStepId, processId);
        if (stepFound) {
            throw new APIException('m.process.process_step_registered', 401);
        }

        const stepNew = await StepBusiness.createStep(pStepId, processId);
        const mStepNewId = stepNew._id.toString();

        // add fields private to step

        // field pri_count
        const nameFieldCount = 'pri_count';
        const descriptionFieldCount = getMessage('m.process.fields.field_pri_count_description', 'es');
        const typeFieldCount = TypeDataBusiness.TYPE_DATA_NUMBER;
        const isRequiredFieldCount = true;
        const permissionsFieldCount = [];
        await FieldBusiness.createField(nameFieldCount, descriptionFieldCount, typeFieldCount, isRequiredFieldCount, permissionsFieldCount, mStepNewId);

        return processFound;
    }

    static async iGetStepsByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await StepBusiness.getStepsFromProcess(processId);
    }

    static async iAddVariableToProcess(processId, variableName, variableValue) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify the field name
        variableName = variableName.replace(new RegExp(' ', 'g'), '_').toLowerCase().trim();
        const patt = new RegExp(/^[a-z0-9\s_]+$/g);
        if (!patt.test(variableName)) {
            throw new APIException('m.process.variables.variable_name_invalid', 401);
        }

        // verify that the variable is not registered in process
        const variableFound = await VariableBusiness.getVariableByNameAndProcess(variableName.trim(), processId);
        if (variableFound) {
            throw new APIException('m.process.variables.variable_process_registered', 401);
        }

        await VariableBusiness.createVariable(variableName, variableValue, processId);

        return processFound;
    }

    static async iGetVariablesByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await VariableBusiness.getVariablesByProcess(processId);
    }

    static async iUpdateVariableFromProcess(processId, variableId, variableName, variableValue) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the variable exists
        const variableFound = await VariableBusiness.getVariableById(variableId);
        if (!variableFound) {
            throw new APIException('m.process.variables.variable_not_exists', 404);
        }

        // verify if the variable belong to process
        if (variableFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.variable_not_belongs_process', 401);
        }

        // verify variable name
        variableName = variableName.replace(new RegExp(' ', 'g'), '_').toLowerCase().trim();
        const patt = new RegExp(/^[a-z0-9\s_]+$/g);
        if (!patt.test(variableName)) {
            throw new APIException('m.process.variables.variable_name_invalid', 401);
        }

        const variableNameFound = await VariableBusiness.getVariableByNameAndProcess(variableName.trim(), processId);
        if (variableNameFound && variableNameFound._id.toString() !== variableFound._id.toString()) {
            throw new APIException('m.process.variables.variable_process_registered', 401);
        }

        await VariableBusiness.updateVariable(variableId, variableName.trim(), variableValue);

        return processFound;
    }

    static async iRemoveVariableFromProcess(processId, variableId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the variable exists
        const variableFound = await VariableBusiness.getVariableById(variableId);
        if (!variableFound) {
            throw new APIException('m.process.variables.variable_not_exists', 404);
        }

        // verify if the variable belong to process
        if (variableFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.variable_not_belongs_process', 401);
        }

        await VariableBusiness.removeVariableById(variableId);
    }

}