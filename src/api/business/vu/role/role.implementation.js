// Business
import RoleBusiness from './role.business';

export default class RoleImplementation extends RoleBusiness {

    constructor() {
        super();
    }

    static async iGetRoles() {
        return await this.getRolesOrderByName();
    }

}