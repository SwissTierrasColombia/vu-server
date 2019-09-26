// Business
import RoleBusiness from './role.business';
import UserBusiness from '../user/user.business';
import MStepBusiness from '../../pm/manage/step/step.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class RoleImplementation extends RoleBusiness {

    constructor() {
        super();
    }

    static async iGetRoles() {
        return await this.getRolesOrderByName();
    }

    static async iCreateRole(roleName) {

        const roleFound = await this.getRoleByName(roleName);
        if (roleFound) {
            throw new APIException('vu.roles.role_name_already_registered', 401);
        }

        const role = await this.createRole(roleName);
        return await this.getRoleById(role._id.toString());
    }

    static async iGetRole(roleId) {

        const roleFound = await this.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('vu.roles.role_not_exists', 404);
        }

        return roleFound;
    }

    static async iUpdateRole(roleId, roleName) {

        const roleFound = await this.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('vu.roles.role_not_exists', 404);
        }

        const roleNameFound = await this.getRoleByName(roleName);
        if (roleNameFound && roleNameFound._id.toString() !== roleId.toString()) {
            throw new APIException('vu.roles.role_name_already_registered', 401);
        }

        await this.updateRole(roleId, roleName);
        return await this.getRoleById(roleId);
    }

    static async iDeleteRole(roleId) {

        const roleFound = await this.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('vu.roles.role_not_exists', 404);
        }

        const countStepsRoles = await MStepBusiness.countStepsWithRole(roleId);
        if (countStepsRoles > 0) {
            throw new APIException('vu.roles.role_cant_delete_steps_used', 401);
        }

        const countUserRoles = await UserBusiness.countUserWithRole(roleId);
        if (countUserRoles > 0) {
            throw new APIException('vu.roles.role_cant_delete_users_used', 401);
        }

        return await this.deleteRole(roleId);
    }

}