// Models
import VUUserModel from '../../../models/vu.user.model';

export default class UserBusiness {

    static async getUserById(userId, populates) {
        try {
            return VUUserModel.getUserById(userId, populates);
        } catch (error) {
            return null;
        }
    }

}