// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';


export default (MUserModel) => {

    // Statics
    MUserModel.statics = {

        async getUserByUsernameAndProcess(username, mProcessId) {
            return await this.findOne({ username, process: mProcessId });
        },

        async createUser(firstName, lastName, username, roles, mProcessId) {
            const MUserModel = this;
            const user = new MUserModel({
                firstName,
                lastName,
                username,
                roles,
                process: mProcessId
            });
            return await user.save();
        },

        async getUserByProcessId(mProcessId, populates) {
            let users = this.find({ process: mProcessId });
            users = addPopulates(users, populates);
            return await users.exec();
        },

        async getUserById(userId) {
            return await this.findById(userId);
        },

        async updateUser(userId, firstName, lastName, username, roles) {
            let user = await this.findById(userId);
            user.firstName = firstName;
            user.lastName = lastName;
            user.username = username;
            user.roles = roles;
            return await user.save();
        },

        async removeUserById(userId) {
            return await this.remove({ _id: userId });
        },

    };

};