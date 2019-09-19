// Models
import VURoleModel from '../../../models/vu.role.model';

export default class RoleBusiness {

    static async getRolesOrderByName() {
        return await VURoleModel.getRoles();
    }

    static async getRoleById(roleId) {
        try {
            return await VURoleModel.getRoleById(roleId);
        } catch (error) {
            return null;
        }
    }

}