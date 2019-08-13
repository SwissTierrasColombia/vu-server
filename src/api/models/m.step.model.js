import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MStepSchema = new Schema({

    process: {
        type: Schema.Types.ObjectId,
        ref: 'MProcessModel',
        required: [
            true, 'The process is required.'
        ],
    },

    typeStep: {
        type: Schema.Types.ObjectId,
        ref: 'PStepModel',
        required: [
            true, 'The type step is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'p_steps' });

//require('./statics/p.step.static').default(MStepSchema);

export default mongoose.model('MStepModel', MStepSchema);