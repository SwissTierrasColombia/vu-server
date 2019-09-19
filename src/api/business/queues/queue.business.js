// Libs
import { getQueueProcedure } from '../../../lib/queues/index';

// Exceptions
import APIException from '../../exceptions/api.exception';

export default class QueueBusiness {

    /**
     * Queue for procedures
     */
    static QUEUE_TYPE_PROCEDURES = 'procedures';


    constructor() {

    }

    /**
     * Add job to queue
     * 
     * @param {string} type 
     * @param {object} data 
     * 
     * @return {boolean}
     */
    static async addJob(type, data) {

        let queue = null;

        switch (type) {
            case QueueBusiness.QUEUE_TYPE_PROCEDURES:
                queue = await getQueueProcedure();
                break;
            default:

                break;
        }

        queue.add(data);
    }

}