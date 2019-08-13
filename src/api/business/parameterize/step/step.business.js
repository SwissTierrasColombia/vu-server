// Models
import PStepModel from '../../../models/p.step.model';

export default class StepBusiness {

    static async getAllSteps() {
        return await PStepModel.getSteps();
    }


}