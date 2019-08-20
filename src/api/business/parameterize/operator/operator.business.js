// Models
import POperatorModel from '../../../models/p.operator.model';

export default class OperatorBusiness {

    static async getOperators() {
        return await POperatorModel.getOperators();
    }

    static async getOperatorById(operatorId) {
        try {
            return await POperatorModel.getOperatorById(operatorId);
        } catch (error) {
            return null;
        }
    }


}