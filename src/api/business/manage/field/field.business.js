// Models
import MFieldModel from '../../../models/m.field.model';

export default class FieldBusiness {

    static async getFieldByNameAndStep(name, mStepId) {
        return await MFieldModel.getFieldByNameAndStep(name, mStepId);
    }

    static async createField(name, description, type, isRequired, permissions, mStepId) {
        return await MFieldModel.createField(name, description, type, isRequired, permissions, mStepId);
    }

    static async getFieldsByStep(stepId, populates) {
        return await MFieldModel.getFieldsByStep(stepId, populates);
    }

    static async getFieldById(fieldId, populates) {
        return await MFieldModel.getFieldById(fieldId, populates);
    }

    static async updateField(mFieldId, name, description, pTypeId, isRequired, permissions, mStepId) {
        return await MFieldModel.updateField(mFieldId, name, description, pTypeId, isRequired, permissions, mStepId);
    }
}