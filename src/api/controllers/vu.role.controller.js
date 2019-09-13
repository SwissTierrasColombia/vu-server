// Libs
import { result, error } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';

// Business
import RoleImplementation from '../business/vu/role/role.implementation';
import QueueBusiness from '../business/queues/queue.business';

// Transformers
import { vuRoleTransformer } from '../transformers/vu.role.transformer';

// get roles
export async function getRoles(req, res) {

    try {

        await QueueBusiness.addJob(QueueBusiness.QUEUE_TYPE_PROCEDURES, { rProcessId: "5d7a5b19a118f4745c11ade1" });

        const roles = await RoleImplementation.iGetRoles();
        return result(res, 200, vuRoleTransformer.transformer(roles));
    } catch (exception) {
        console.log("vu.role@getRoles ---->", exception);
        if (exception.codeHttp && exception.key) {
            return error(res, exception.codeHttp, { message: getMessage(exception.key, 'es') });
        }
        return error(res, 500, { message: 'Server error ...' });
    }

}