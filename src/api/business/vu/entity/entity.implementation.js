// Business
import EntityBusiness from './entity.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

export default class EntityImplementation extends EntityBusiness {

    constructor() {
        super();
    }

    static async iGetEntities() {
        return await this.getEntitiesOrderByName();
    }

    static async iCreateEntity(entityName) {

        const entityFound = await this.getEntityByName(entityName);
        if (entityFound) {
            throw new APIException('vu.entities.entity_name_already_registered', 401);
        }

        const entity = await this.createEntity(entityName);
        return await this.getEntityById(entity._id.toString());
    }

    static async iGetEntity(entityId) {

        const entityFound = await this.getEntityById(entityId);
        if (!entityFound) {
            throw new APIException('vu.entities.entity_not_exists', 404);
        }

        return entityFound;
    }

    static async iUpdateEntity(entityId, entityName) {

        const entityFound = await this.getEntityById(entityId);
        if (!entityFound) {
            throw new APIException('vu.entities.entity_not_exists', 404);
        }

        const entityNameFound = await this.getEntityByName(entityName);
        if (entityNameFound && entityNameFound._id.toString() !== entityId.toString()) {
            throw new APIException('vu.entities.entity_name_already_registered', 401);
        }

        await this.updateEntity(entityId, entityName);
        return await this.getEntityById(entityId);
    }

}