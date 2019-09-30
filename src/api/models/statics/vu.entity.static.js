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
        },

        async getEntityByName(entityName) {
            return await this.findOne({ entity: entityName });
        },

        async createEntity(entityName) {
            const VUEntityModel = this;
            const entity = new VUEntityModel({
                entity: entityName
            });
            return await entity.save();
        },

        async updateEntity(entityId, entityName) {
            let entity = await this.findById(entityId);
            entity.entity = entityName;
            return await entity.save();
        }

    };

};