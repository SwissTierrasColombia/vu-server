// Models
import MUserModel from '../../../../models/m.user.model';

export default class UserBusiness {

    static async getUserByUsernameAndProcess(username, mProcessId) {
        return await MUserModel.getUserByUsernameAndProcess(username, mProcessId);
    }

    static async createUser(firstName, lastName, username, roles, mProcessId) {
        return await MUserModel.createUser(firstName, lastName, username, roles, mProcessId);
    }

    static async getUsersByProcessId(mProcessId, populates) {
        return await MUserModel.getUserByProcessId(mProcessId, populates);
    }

    static async getUserById(userId) {
        try {
            return await MUserModel.getUserById(userId);
        } catch (error) {
            return null;
        }
    }

    static async updateUser(userId, firstName, lastName, username, roles) {
        return await MUserModel.updateUser(userId, firstName, lastName, username, roles);
    }

    static async removeUserById(userId) {
        try {
            return await MUserModel.removeUserById(userId);
        } catch (error) {
            return null;
        }
    }

    static async getUsersByUsername(username) {
        return await MUserModel.getUsersByUsername(username);
    }

}