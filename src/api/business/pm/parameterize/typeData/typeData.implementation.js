// Business
import TypeDataBusiness from './typeData.business';

export default class TypeDataImplementation extends TypeDataBusiness {

    constructor() {
        super();
    }

    static async getTypesData() {
        return await this.getAllTypesData();
    }


}