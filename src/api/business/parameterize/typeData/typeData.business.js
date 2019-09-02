// Libs
import validator from 'validator';
import moment from 'moment';

// Models
import PTypeDataModel from '../../../models/p.typesData.model';

export default class TypeDataBusiness {

    static TYPE_DATA_TEXT = '5d519eb247943f3539d116ef';
    static TYPE_DATA_NUMBER = '5d519eb247943f3539d116f0';
    static TYPE_DATA_EMAIL = '5d5c174067bca9c43a6c0781';
    static TYPE_DATA_PHONE_NUMBER = '5d5c17a7c5e62930e04c6f57';
    static TYPE_DATA_DATE = '5d5c31053f13df7873bcdd7c';
    static TYPE_DATA_SINGLE_RESPONSE_LIST = '5d6d14bdcf24455da624f3d2';
    static TYPE_DATA_MULTIPLE_RESPONSE_LIST = '5d6d14db839412978f3d657d';
    static TYPE_DATA_CHECKBOX = '5d6d158e15ba903fa8b8b5f5';
    static TYPE_DATA_FILE = '5d6d20ef775e54cab6e1a7c3';
    static TYPE_DATA_TEXTAREA = '5d6d41ebd3bc60802d460fcf';

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

    static verifyTypeData(typeDataId, value) {
        let valid = false;
        switch (typeDataId.toString()) {
            case TypeDataBusiness.TYPE_DATA_TEXT:
                valid = typeof value === 'string' || value instanceof String;
                break;
            case TypeDataBusiness.TYPE_DATA_NUMBER:
                valid = validator.isNumeric(value);
                break;
            case TypeDataBusiness.TYPE_DATA_EMAIL:
                valid = validator.isEmail(value);
                break;
            case TypeDataBusiness.TYPE_DATA_PHONE_NUMBER:
                valid = true;
                break;
            case TypeDataBusiness.TYPE_DATA_DATE:
                valid = moment(value, 'YYYY-MM-DD', true).isValid();
                break;
        }
        return valid;
    }


}