// Libs
import Queue from 'bull';
import config from '../../config';

// Business
import QueueBusiness from '../../api/business/queues/queue.business';
import RProcessImplementation from '../../api/business/pm/runtime/process/process.implementation';

let proceduresQueue = null;


export default () => {

    proceduresQueue = new Queue(QueueBusiness.QUEUE_TYPE_PROCEDURES, { redis: config.bull.redis });

    proceduresQueue.process(async (job, done) => {

        const jobData = job.data;
        try {
            const isOver = await RProcessImplementation.validateProcedure(jobData.rProcessId);
            done();
            if (!isOver) {
                setTimeout(async function () {
                    await QueueBusiness.addJob(QueueBusiness.QUEUE_TYPE_PROCEDURES, { rProcessId: jobData.rProcessId });
                }, 10000);
            }
        } catch (error) {

        }

    });

    proceduresQueue.on('failed', async function (job, err) {
        try {
            await job.retry();
        } catch (error) {

        }
    });

};

export function getQueueProcedure() {
    return proceduresQueue;
}