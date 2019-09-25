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

    static async getUserByUsername(username) {
        return await VUUserModel.getUserByUsername(username);
    }

    static async getUserByEmail(username) {
        return await VUUserModel.getUserByEmail(username);
    }

    static async createUser(firstName, lastName, email, username, password, roles, entities, enabled) {
        return await VUUserModel.createUser(firstName, lastName, email, username, password, roles, entities, enabled);
    }

    static async getUsers(page, limit, populate) {
        return await VUUserModel.getUsers(page, limit, populate);
    }

    static async updateUser(userId, firstName, lastName, email, username, password, roles, entities) {
        return await VUUserModel.updateUser(userId, firstName, lastName, email, username, password, roles, entities);
    }

    static async updateEnabled(userId, enabled) {
        return await VUUserModel.updateEnabled(userId, enabled);
    }

}