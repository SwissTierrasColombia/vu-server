// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';


export default (VUEntityModel) => {

    // Statics
    VUEntityModel.statics = {

        async getEntities() {
            return await this.find({}, [], {
                sort: { entity: 1 }
            });
        },

        async getEntityById(entityId) {
            return await this.findById(entityId);
        }

    };

};