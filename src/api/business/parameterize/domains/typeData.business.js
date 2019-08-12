// Models
import PTypeDataModel from '../../../models/p.typesData.model';

export default class TypeDataBusiness {

    constructor() {

    }

    static async getTypesData() {
        return await PTypeDataModel.getTypesData();
    }


}