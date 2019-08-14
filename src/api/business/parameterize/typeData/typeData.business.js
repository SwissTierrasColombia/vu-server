// Models
import PTypeDataModel from '../../../models/p.typesData.model';

export default class TypeDataBusiness {

    static async getAllTypesData() {
        return await PTypeDataModel.getTypesData();
    }

    static async getTypeDataById(typeDataId) {
        try {
            return await PTypeDataModel.getTypeDataById(typeDataId);
        } catch (error) {
            return null;
        }
    }


}