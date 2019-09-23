// Libs
import { getMessage } from '../../../../../lib/helpers/locales';

// Business
import ProcessBusiness from './process.business';
import RoleBusiness from '../role/role.business';
import StepBusiness from '../step/step.business';
import FieldBusiness from '../field/field.business';
import VariableBusiness from '../variable/variable.business';
import UserBusiness from '../user/user.business';
import TypeDataBusiness from '../../parameterize/typeData/typeData.business';
import PCallbackBusiness from '../../parameterize/callback/callback.business';
import PStepBusiness from '../../parameterize/step/step.business';
import POperatorBusiness from '../../parameterize/operator/operator.business';
import VUEntityBusiness from '../../../vu/entity/entity.business';
import RProcessBusiness from '../../runtime/process/process.business';

// Exceptions
import APIException from '../../../../exceptions/api.exception';

export default class ProcessImplementation extends ProcessBusiness {

    constructor() {
        super();
    }

    static async registerProcess(name, description, vuUserId) {
        description = (description) ? description : '';
        return await this.createProcess(name.trim(), description, vuUserId);
    }

    static async getProcesses(filterAvailable) {

        if (filterAvailable) {
            return await this.getProcessesAvailable();
        }

        let processes = await this.getAllProcesses();
        processes = JSON.parse(JSON.stringify(processes));
        for (let i = 0; i < processes.length; i++) {
            const process = processes[i];
            const count = await RProcessBusiness.getCountActiveProcessByTypeProcess(process._id.toString(), true);
            process.inAction = count;
        }

        return processes;
    }

    static async iAddRoleToProcess(processId, role) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify that the role is not registered in the process
        const roleFound = await RoleBusiness.getRoleByNameAndProcess(role.trim(), processId);
        if (roleFound) {
            throw new APIException('m.process.process_role_registered', 401);
        }

        await RoleBusiness.createRole(role.trim(), processId);

        return processFound;
    }

    static async iGetRolesByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await RoleBusiness.getRolesByProcess(processId);
    }

    static async iUpdateRoleFromProcess(processId, roleId, roleName) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const roleFound = await RoleBusiness.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('m.process.roles.role_not_exists', 404);
        }

        // verify if the role belong to process
        if (roleFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.role_not_belongs_process', 401);
        }

        await RoleBusiness.updateRoleFromProcess(processId, roleId, roleName);

        return processFound;
    }

    static async iRemoveRoleFromProcess(processId, roleId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const roleFound = await RoleBusiness.getRoleById(roleId);
        if (!roleFound) {
            throw new APIException('m.process.roles.role_not_exists', 404);
        }

        // verify if the role belong to process
        if (roleFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.role_not_belongs_process', 401);
        }

        await RoleBusiness.removeRoleById(roleId);
    }

    static async iAddStepToProcess(processId, pStepId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify that the step is not registered in the process
        const stepFound = await StepBusiness.getStepByTypeAndProcess(pStepId, processId);
        if (stepFound) {
            throw new APIException('m.process.process_step_registered', 401);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        const stepNew = await StepBusiness.createStep(pStepId, processId);
        const mStepNewId = stepNew._id.toString();

        // add fields private to step

        // field pri_count
        const nameFieldCount = 'pri_count';
        const descriptionFieldCount = getMessage('m.process.fields.field_pri_count_description', 'es');
        const typeFieldCount = TypeDataBusiness.TYPE_DATA_NUMBER;
        const isRequiredFieldCount = true;
        const permissionsFieldCount = [];
        const isPrivate = true;
        await FieldBusiness.createField(nameFieldCount, descriptionFieldCount, typeFieldCount, isRequiredFieldCount, permissionsFieldCount, mStepNewId, isPrivate);

        return processFound;
    }

    static async iRemoveStepToProcess(processId, mStepId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the step exists
        const stepFound = await StepBusiness.getStepById(mStepId);
        if (!stepFound) {
            throw new APIException('m.process.steps.step_not_exists', 404);
        }

        if (stepFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.steps.step_not_belong_process', 401);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // remove fields
        await FieldBusiness.removeFieldsByStepId(stepFound._id.toString());

        // remove references callbacks
        const steps = await StepBusiness.getStepsFromProcess(processId);
        for (let i in steps) {
            const step = steps[i];
            if (step._id.toString() !== mStepId.toString()) {
                const rules = step.rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    const callbacks = rule.callbacks;
                    for (let k = 0; k < callbacks.length; k++) {
                        const callback = callbacks[k];
                        if (callback.callback.toString() === PCallbackBusiness.CALLBACK_STEP &&
                            callback.metadata.step.toString() === mStepId.toString()) {
                            callbacks.splice(k, 1);
                        }
                    }
                }

                // update step
                await StepBusiness.updateStepRules(step._id.toString(), rules);
            }
        }

        // remove steps
        await StepBusiness.removeStepById(stepFound._id.toString());
    }

    static async iGetStepsByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        let steps = await StepBusiness.getStepsFromProcess(processId, ['typeStep']);
        steps = JSON.parse(JSON.stringify(steps));
        for (let i in steps) {
            let step = steps[i];
            let rules = step.rules;
            for (let j in rules) {
                let rule = rules[j];
                let conditions = rule.conditions;
                for (let k in conditions) {
                    let condition = conditions[k];
                    let field = await FieldBusiness.getFieldById(condition.field.toString());
                    condition.typeData = (field) ? field.typeData : null;
                    condition.metadata = (field) ? field.metadata : {};

                    if (field) {
                        const typeData = await TypeDataBusiness.getTypeDataById(field.typeData);
                        const operators = [];
                        if (typeData) {
                            for (let z = 0; z < typeData.operators.length; z++) {
                                const operatorFound = await POperatorBusiness.getOperatorById(typeData.operators[z]);
                                operators.push(operatorFound);
                            }
                        }
                        condition.operators = (typeData) ? operators : [];
                    }
                }
            }
        }

        return steps;
    }

    static async iAddVariableToProcess(processId, variableName, variableValue) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // verify the field name
        variableName = variableName.replace(new RegExp(' ', 'g'), '_').toLowerCase().trim();
        const patt = new RegExp(/^[a-z0-9\s_]+$/g);
        if (!patt.test(variableName)) {
            throw new APIException('m.process.variables.variable_name_invalid', 401);
        }

        // verify that the variable is not registered in process
        const variableFound = await VariableBusiness.getVariableByNameAndProcess(variableName.trim(), processId);
        if (variableFound) {
            throw new APIException('m.process.variables.variable_process_registered', 401);
        }

        await VariableBusiness.createVariable(variableName, variableValue, processId);

        return processFound;
    }

    static async iGetVariablesByProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await VariableBusiness.getVariablesByProcess(processId);
    }

    static async iUpdateVariableFromProcess(processId, variableId, variableName, variableValue) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // verify if the variable exists
        const variableFound = await VariableBusiness.getVariableById(variableId);
        if (!variableFound) {
            throw new APIException('m.process.variables.variable_not_exists', 404);
        }

        // verify if the variable belong to process
        if (variableFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.variable_not_belongs_process', 401);
        }

        // verify variable name
        variableName = variableName.replace(new RegExp(' ', 'g'), '_').toLowerCase().trim();
        const patt = new RegExp(/^[a-z0-9\s_]+$/g);
        if (!patt.test(variableName)) {
            throw new APIException('m.process.variables.variable_name_invalid', 401);
        }

        const variableNameFound = await VariableBusiness.getVariableByNameAndProcess(variableName.trim(), processId);
        if (variableNameFound && variableNameFound._id.toString() !== variableFound._id.toString()) {
            throw new APIException('m.process.variables.variable_process_registered', 401);
        }

        await VariableBusiness.updateVariable(variableId, variableName.trim(), variableValue);

        return processFound;
    }

    static async iRemoveVariableFromProcess(processId, variableId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // verify if the variable exists
        const variableFound = await VariableBusiness.getVariableById(variableId);
        if (!variableFound) {
            throw new APIException('m.process.variables.variable_not_exists', 404);
        }

        // verify if the variable belong to process
        if (variableFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.roles.variable_not_belongs_process', 401);
        }

        await VariableBusiness.removeVariableById(variableId);
    }

    static async iRemoveProcess(processId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify runtime
        const processes = await RProcessBusiness.getCountProcessesByProcess(processId);
        if (processes > 0) {
            throw new APIException('m.process.process_cant_remove_have_runtime', 401);
        }

        // remove variables
        await VariableBusiness.removeVariablesByProcessId(processId);

        // remove roles
        await RoleBusiness.removeRolesByProcessId(processId);

        const steps = await StepBusiness.getStepsFromProcess(processId);

        // remove fields
        for (let property in steps) {
            const step = steps[property];
            await FieldBusiness.removeFieldsByStepId(step._id.toString());
        }

        // remove steps
        await StepBusiness.removeStepsByProcessId(processId);

        // remove process
        await ProcessBusiness.removeProcessById(processId);
    }

    static async iUpdateProcess(processId, processName, processDescription) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        processDescription = (processDescription) ? processDescription : '';

        await ProcessBusiness.updateProcess(processId, processName, processDescription);

        return await this.getProcessById(processId);
    }

    static async iAddUserToProcess(processId, firstName, lastName, username, roles) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the user already registered in the process
        const userFound = await UserBusiness.getUserByUsernameAndProcess(username.trim(), processId);
        if (userFound) {
            throw new APIException('m.process.users.user_process_registered', 401);
        }

        // verify roles
        const rolesValid = [];
        for (let i in roles) {
            const mRoleId = roles[i];
            const roleFound = await RoleBusiness.getRoleById(mRoleId);
            if (roleFound && roleFound.process.toString() === processId) {
                rolesValid.push(mRoleId);
            }
        }

        if (rolesValid.length === 0) {
            throw new APIException('m.process.users.user_roles_minimum_one', 401);
        }

        await UserBusiness.createUser(firstName, lastName, username.trim(), rolesValid, processId);

        return processFound;
    }

    static async iGetUsersByProcess(mProcessId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        return await UserBusiness.getUsersByProcessId(mProcessId, ['process', 'roles']);
    }

    static async iUpdateUserFromProcess(processId, userId, firstName, lastName, username, roles) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const userFound = await UserBusiness.getUserById(userId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        // verify if the user belong to process
        if (userFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.users.user_not_belongs_process', 401);
        }

        // verify if the username already registered in the process
        const userByUsernameFound = await UserBusiness.getUserByUsernameAndProcess(username.trim(), processId);
        if (userByUsernameFound && userByUsernameFound._id.toString() !== userId.toString()) {
            throw new APIException('m.process.users.user_process_registered', 401);
        }

        // verify roles
        const rolesValid = [];
        for (let i in roles) {
            const mRoleId = roles[i];
            const roleFound = await RoleBusiness.getRoleById(mRoleId);
            if (roleFound && roleFound.process.toString() === processId) {
                rolesValid.push(mRoleId);
            }
        }

        if (rolesValid.length === 0) {
            throw new APIException('m.process.users.user_roles_minimum_one', 401);
        }

        await UserBusiness.updateUser(userId, firstName, lastName, username, rolesValid);

        return processFound;
    }

    static async iRemoveUserFromProcess(processId, userId) {

        // verify if the process exists
        const processFound = await this.getProcessById(processId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify if the role exists
        const userFound = await UserBusiness.getUserById(userId);
        if (!userFound) {
            throw new APIException('m.process.users.user_not_exists', 404);
        }

        // verify if the user belong to process
        if (userFound.process.toString() !== processId.toString()) {
            throw new APIException('m.process.users.user_not_belongs_process', 401);
        }

        await UserBusiness.removeUserById(userId);
    }

    static async deployProcess(mProcessId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // verify that the process had a minimum step
        const steps = await StepBusiness.getStepsFromProcess(mProcessId);
        if (steps.length === 0) {
            throw new APIException('m.process.process_deploy_error_steps', 401);
        }

        // check at each step if you have assigned entity
        for (let i in steps) {
            const step = steps[i];
            if (!step.entity) {
                throw new APIException('m.process.process_deploy_error_entity', 401);
            }
        }

        // check at each step if you have assigned fields
        for (let i in steps) {
            const step = steps[i];
            let fields = await FieldBusiness.getFieldsByStep(step._id.toString());
            fields = fields.filter(field => {
                return field.isPrivate === false;
            });
            if (fields.length === 0) {
                throw new APIException('m.process.process_deploy_error_fields', 401);
            }
        }

        // check at each step if you have assigned rules
        let haveRuleClosed = false;
        for (let i in steps) {
            const step = steps[i];
            const rules = step.rules;

            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                const callbacks = rule.callbacks;
                for (let k = 0; k < callbacks.length; k++) {
                    const callback = callbacks[k];
                    if (callback.callback.toString() === PCallbackBusiness.CALLBACK_CLOSING) {
                        haveRuleClosed = true;
                    }
                }
            }

            if (rules.length === 0) {
                throw new APIException('m.process.process_deploy_error_rules', 401);
            }
        }

        if (!haveRuleClosed) {
            throw new APIException('m.process.process_deploy_error_not_rule_closing', 401);
        }


        // check at each step if you have assigned roles
        for (let i in steps) {
            const step = steps[i];
            const roles = step.roles;
            if (roles.length === 0) {
                throw new APIException('m.process.process_deploy_error_steps_roles', 401);
            }
        }

        // check if process has a origin step
        let hasOrigin = false;
        for (let i in steps) {
            const step = steps[i];
            if (step.isFirst === true) {
                hasOrigin = true;
                break;
            }
        }
        if (!hasOrigin) {
            throw new APIException('m.process.process_deploy_error_not_has_origin_step', 401);
        }

        await this.updateActiveProcess(mProcessId, true);

        return await this.getProcessById(mProcessId);
    }

    static async iGetStepsFlow(mProcessId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        const steps = await StepBusiness.getStepsFromProcess(mProcessId);

        const nodes = [];
        const links = [];

        for (let i in steps) {
            const step = steps[i];
            const rules = step.rules;

            const typeStep = await PStepBusiness.getStepById(step.typeStep.toString());
            nodes.push(
                {
                    id: step._id.toString(),
                    label: typeStep.step
                }
            );
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                const callbacks = rule.callbacks;
                for (let k = 0; k < callbacks.length; k++) {
                    const callback = callbacks[k];
                    if (callback.callback.toString() === PCallbackBusiness.CALLBACK_STEP) {
                        links.push(
                            {
                                id: i,
                                source: step._id.toString(),
                                target: callback.metadata.step.toString()
                            }
                        );

                    }
                }
            }

        }
        return { nodes, links };
    }

    static async iAddEntityToProcess(mProcessId, vuEntityId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(mProcessId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // verify if the entity exists
        const entityFound = await VUEntityBusiness.getEntityById(vuEntityId);
        if (!entityFound) {
            throw new APIException('m.process.entities.entity_not_exists', 404);
        }

        const entities = processFound.entities;
        const hasEntity = entities.find(item => {
            return item.toString() === vuEntityId.toString();
        });
        if (!hasEntity) {
            entities.push(vuEntityId.toString());
            await this.updateEntities(mProcessId, entities);
        }

        return await this.getProcessById(mProcessId);
    }

    static async iRemoveEntityFromProcess(mProcessId, vuEntityId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        // process information cannot be edited until it is deactivated and there are no procedures in progress
        const count = await RProcessBusiness.getCountProcessesByProcess(mProcessId);
        if (processFound.active || count > 0) {
            throw new APIException('m.process.process_cant_update', 401);
        }

        // verify if the entity exists
        const entityFound = await VUEntityBusiness.getEntityById(vuEntityId);
        if (!entityFound) {
            throw new APIException('m.process.entities.entity_not_exists', 404);
        }

        const entities = processFound.entities;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.toString() === vuEntityId.toString()) {
                entities.splice(i, 1);
                break;
            }
        }

        // set to null the steps where the entity is registered
        const steps = await StepBusiness.getStepsFromProcess(mProcessId);
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (step.entity) {
                if (step.entity.toString() === vuEntityId.toString()) {
                    await StepBusiness.updateEntityToStep(step._id.toString(), null);
                }
            }
        }

        await this.updateEntities(mProcessId, entities);
    }

    static async undeployProcess(mProcessId) {

        // verify if the process exists
        const processFound = await this.getProcessById(mProcessId);
        if (!processFound) {
            throw new APIException('m.process.process_not_exists', 404);
        }

        await this.updateActiveProcess(mProcessId, false);

        return await this.getProcessById(mProcessId);
    }

}