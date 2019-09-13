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
        const jobId = job.id;

        const isOver = await RProcessImplementation.validateProcedure(jobData.rProcessId);
        done();

        if (isOver) {

        } else {

        }

    });

    proceduresQueue.on('active', function (job, jobPromise) {
        // A job has started. You can use `jobPromise.cancel()` to abort it.
    });

    proceduresQueue.on('completed', (job, result) => {
        // Job completed with output result!
        console.log('job completed', result);

    });

    proceduresQueue.on('error', function (error) {
        // An error occured.
    });

    proceduresQueue.on('waiting', function (jobId) {
        // A Job is waiting to be processed as soon as a worker is idling.
    });

    proceduresQueue.on('stalled', function (job) {
        // A job has been marked as stalled. This is useful for debugging job
        // workers that crash or pause the event loop.
    });

    proceduresQueue.on('progress', function (job, progress) {
        // A jobs progress was updated!
    });

    proceduresQueue.on('failed', function (job, err) {
        // A job failed with reason `err`!
        console.log('failed', err);
    });

    proceduresQueue.on('paused', function () {
        // The queue has been paused.
    });

    proceduresQueue.on('resumed', function (job) {
        // The queue has been resumed.
    });

    proceduresQueue.on('cleaned', function (jobs, type) {
        // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        // jobs, and `type` is the type of jobs cleaned.
    });

    proceduresQueue.on('drained', function () {
        // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
    });

    proceduresQueue.on('removed', function (job) {
        // A job successfully removed.
    });

};

/**
 * Get queue
 * 
 * @return {object} Queue
 */
export function getQueue() {
    return queue;
}


export function getQueueProcedure() {
    return proceduresQueue;
}