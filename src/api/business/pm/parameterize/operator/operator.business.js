// Models
import POperatorModel from '../../../../models/p.operator.model';

export default class OperatorBusiness {

    static OPERATOR_MAJOR = '5d5c252d5fefc198244a14ff';
    static OPERATOR_MINOR = '5d5c253a557daf56900f3efe';
    static OPERATOR_EQUAL = '5d5c25441b06c98e5c07c20c';
    static OPERATOR_MAJOR_EQUAL = '5d5c254a0c5328ae31e19402';
    static OPERATOR_MINOR_EQUAL = '5d5c25516fcbd8a0389f14c1';
    static OPERATOR_DIFFERENT = '5d5c255761a6c29cd91d7036';
    static OPERATOR_NOT_EMPTY = '5d7bd1056887f0354a82e1b1';
    static OPERATOR_AFTER_TIME = '5d7bd1a77fdd1321b9793c2d';
    static OPERATOR_BEFORE_TIME = '5d7bd1c4b995b07cd94c1435';
    static OPERATOR_IN = '5d7bd209a65a9581441e1071';

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