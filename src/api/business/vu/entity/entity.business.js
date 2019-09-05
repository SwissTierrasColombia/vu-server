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

}