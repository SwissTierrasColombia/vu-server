// Models
import PStepModel from '../../../models/p.step.model';

export default class StepBusiness {

    constructor() {

    }

    static async getSteps() {
        return await PStepModel.getSteps();
    }


}