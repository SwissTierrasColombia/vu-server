// Business
import EntityBusiness from './entity.business';

export default class EntityImplementation extends EntityBusiness {

    constructor() {
        super();
    }

    static async iGetEntities() {
        return await this.getEntitiesOrderByName();
    }

}