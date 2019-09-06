// Business
import UserBusiness from './user.business';
import RProcessBusiness from '../../pm/runtime/process/process.business';
import MProcessBusiness from '../../pm/manage/process/process.business';
import MStepBusiness from '../../pm/manage/step/step.business';

export default class UserImplementation extends UserBusiness {

    constructor() {
        super();
    }

    static async getTasksProceduresUser(vuUserId) {

        // verify if the user exists
        const userFound = await this.getUserById(vuUserId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        const entitiesUser = userFound.entities;
        const rolesUser = userFound.roles;

        let allProcess = [];

        const manageProcesses = await MProcessBusiness.getProcessesMatchEntities(entitiesUser);
        for (let i = 0; i < manageProcesses.length; i++) {
            let mStepsId = [];
            const mProcess = manageProcesses[i];
            const manageStepsToProcess = await MStepBusiness.getStepsMatchEntitiesAndRoles(mProcess._id.toString(), entitiesUser, rolesUser);
            for (let j = 0; j < manageStepsToProcess.length; j++) {
                mStepsId.push(manageStepsToProcess[j]._id.toString());
            }

            const runtimeProcesses = await RProcessBusiness.getProcessesMatchSteps(mProcess._id.toString(), mStepsId); console.log('run', runtimeProcesses);

            allProcess = allProcess.concat(runtimeProcesses);
        }

        return allProcess;
    }

}