import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PStepSchema = new Schema({

    step: {
        type: String,
        required: [
            true, 'Step name is required.'
        ]
    },

    icon: {
        type: String,
        required: [
            true, 'Icon is required.'
        ]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'p_steps' });

require('./statics/p.step.static').default(PStepSchema);

export default mongoose.model('PStepModel', PStepSchema);