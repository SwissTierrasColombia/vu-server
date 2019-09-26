// Models
import VUEntityModel from '../../../models/vu.entity.model';

export default class EntityBusiness {

    static async getEntitiesOrderByName() {
        return await VUEntityModel.getEntities();
    }

    static async getEntityById(entityId) {
        try {
            return await VUEntityModel.getEntityById(entityId);
        } catch (error) {
            return null;
        }
    }

    static async getEntityByName(entityName) {
        return await VUEntityModel.getEntityByName(entityName);
    }

    static async createEntity(entityName) {
        return await VUEntityModel.createEntity(entityName);
    }

    static async updateEntity(entityId, entityName) {
        return await VUEntityModel.updateEntity(entityId, entityName);
    }

}