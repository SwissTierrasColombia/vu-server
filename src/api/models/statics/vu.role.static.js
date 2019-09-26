// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';


export default (VURoleModel) => {

    // Statics
    VURoleModel.statics = {

        async getRoles() {
            return await this.find({}, [], {
                sort: { role: 1 }
            });
        },

        async getRoleById(roleId) {
            return await this.findById(roleId);
        },

        async getRoleByName(roleName) {
            return await this.findOne({ role: roleName });
        },

        async createRole(roleName) {
            const VURoleModel = this;
            const role = new VURoleModel({
                role: roleName
            });
            return await role.save();
        },

        async updateRole(roleId, name) {
            let role = await this.findById(roleId);
            role.role = name;
            return await role.save();
        },

        async deleteRole(roleId) {
            return await this.remove({ _id: roleId });
        }

    };

};