// Models
import VURoleModel from '../../../models/vu.role.model';

export default class RoleBusiness {

    static ROLE_ADMINISTRATOR = '5d710564330f7d7cd67ee491';
    static ROLE_CITIZEN = '5d7105cb698085331067bf8f';
    static ROLE_ENTITY = '5d7107e7a6a3e77e5fe15217';

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