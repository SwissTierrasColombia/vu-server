// Models
import MRoleModel from '../../../models/m.role.model';

export default class RoleBusiness {

    static async getRoleByNameAndProcess(roleName, processId) {
        return await MRoleModel.getRoleByNameAndProcess(roleName, processId);
    }

    static async createRole(roleName, processId) {
        return await MRoleModel.createRole(roleName, processId);
    }

    static async getRolesByProcess(processId) {
        return await MRoleModel.getRolesByProcess(processId);
    }

    static async getRoleById(roleId) {
        try {
            return await MRoleModel.getRoleById(roleId);
        } catch (error) {
            return null;
        }
    }

    static async updateRoleFromProcess(processId, roleId, roleName) {
        return await MRoleModel.updateRoleFromProcess(processId, roleId, roleName);
    }

}