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
        }

    };

};