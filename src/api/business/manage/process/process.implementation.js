// Business
import ProcessBusiness from './process.business';
import RoleBusiness from '../role/role.business';
import StepBusiness from '../step/step.business';

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

        await RoleBusiness.updateRoleFromProcess(processId, roleId, roleName);

        return processFound;
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

        await StepBusiness.createStep(pStepId, processId);

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

}