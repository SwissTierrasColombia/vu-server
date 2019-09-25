// Libs
import bcrypt from 'bcrypt';

// Business
import UserBusiness from './user.business';
import RProcessBusiness from '../../pm/runtime/process/process.business';
import MProcessBusiness from '../../pm/manage/process/process.business';
import MStepBusiness from '../../pm/manage/step/step.business';
import RoleBusiness from '../role/role.business';
import EntityBusiness from '../entity/entity.business';

// Exceptions
import APIException from '../../../exceptions/api.exception';

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

            const runtimeProcesses = await RProcessBusiness.getProcessesMatchSteps(mProcess._id.toString(), mStepsId);

            allProcess = allProcess.concat(runtimeProcesses);
        }

        return allProcess;
    }

    static async iCreateUserCitizen(firstName, lastName, username, email, password) {
        const roles = [RoleBusiness.ROLE_CITIZEN];
        return await UserImplementation.iCreateUser(firstName, lastName, email, username, password, roles, [], true);
    }

    static async iCreateUser(firstName, lastName, email, username, password, roles, entities, enabled) {

        // verify if the user already registered (username)
        const userUsernameFound = await this.getUserByUsername(username.trim());
        if (userUsernameFound) {
            throw new APIException('vu.users.user_username_already_registered', 401);
        }

        // verify if the user already registered (email)
        const userEmailFound = await this.getUserByEmail(email.trim());
        if (userEmailFound) {
            throw new APIException('vu.users.user_email_already_registered', 401);
        }

        // verify roles
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            const roleFound = await RoleBusiness.getRoleById(role.toString());
            if (!roleFound) {
                throw new APIException('vu.users.user_roles_not_exists', 401);
            }
        }

        // verify minimum one role
        if (roles.length === 0) {
            throw new APIException('vu.users.user_roles_minimun', 401);
        }

        // verify entities
        if (entities) {
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                const entityFound = await EntityBusiness.getEntityById(entity.toString());
                if (!entityFound) {
                    throw new APIException('vu.users.user_entities_not_exists', 401);
                }
            }
        }

        //hash password
        password = await bcrypt.hashSync(password, 10);

        const newUser = await this.createUser(firstName, lastName, email, username, password, roles, entities, enabled);

        return await this.getUserById(newUser._id.toString(), ['entities', 'roles']);
    }

    static async getUsersFromAdmin(page) {
        const limit = 10;
        return await this.getUsers(page, limit, []);
    }

    static async iUpdateUser(userId, firstName, lastName, email, username, password, roles, entities) {

        // verify if user exists
        const userFound = await this.getUserById(userId);
        if (!userFound) {
            throw new APIException('vu.users.user_not_exists', 404);
        }

        // verify if the user already registered (username)
        const userUsernameFound = await this.getUserByUsername(username.trim());
        if (userUsernameFound && userId.toString() !== userUsernameFound._id.toString()) {
            throw new APIException('vu.users.user_username_already_registered', 401);
        }

        // verify if the user already registered (email)
        const userEmailFound = await this.getUserByEmail(email.trim());
        if (userEmailFound && userId.toString() !== userEmailFound._id.toString()) {
            throw new APIException('vu.users.user_email_already_registered', 401);
        }

        // verify roles
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            const roleFound = await RoleBusiness.getRoleById(role.toString());
            if (!roleFound) {
                throw new APIException('vu.users.user_roles_not_exists', 401);
            }
        }

        // verify minimum one role
        if (roles.length === 0) {
            throw new APIException('vu.users.user_roles_minimun', 401);
        }

        // verify entities
        if (entities) {
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                const entityFound = await EntityBusiness.getEntityById(entity.toString());
                if (!entityFound) {
                    throw new APIException('vu.users.user_entities_not_exists', 401);
                }
            }
        }

        if (password) {
            //hash password
            password = await bcrypt.hashSync(password, 10);
        } else {
            password = userFound.password;
        }

        const newUser = await this.updateUser(userId, firstName, lastName, email, username, password, roles, entities);

        return await this.getUserById(newUser._id.toString(), ['entities', 'roles']);
    }

    static async iDisableUser(userId) {

        // verify if user exists
        const userFound = await this.getUserById(userId);
        if (!userFound) {
            throw new APIException('vu.users.user_not_exists', 404);
        }

        await this.updateEnabled(userId, false);

        return await this.getUserById(userId, ['entities', 'roles']);
    }

    static async iEnableUser(userId) {

        // verify if user exists
        const userFound = await this.getUserById(userId);
        if (!userFound) {
            throw new APIException('vu.users.user_not_exists', 404);
        }

        await this.updateEnabled(userId, true);

        return await this.getUserById(userId, ['entities', 'roles']);
    }

}