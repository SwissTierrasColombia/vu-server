import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RProcessSchema = new Schema({

    process: {
        type: Schema.Types.ObjectId,
        ref: 'MProcessModel',
        required: [
            true, 'The process is required.'
        ],
    },

    step: {
        type: Schema.Types.ObjectId,
        ref: 'MStepModel',
        required: [
            true, 'The step is required.'
        ],
    },

    steps: [
        {
            step: {
                type: Schema.Types.ObjectId,
                ref: 'MStepModel',
                required: [
                    true, 'The step is required.'
                ]
            },
            active: {
                type: Boolean,
                default: false
            },
            data: {
                type: Schema.Types.Mixed,
                required: [
                    true, 'Data is required.'
                ],
            },
            metadata: {
                type: Schema.Types.Mixed,
                required: false
            },
            updatedAt: {
                type: Date,
                required: false
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        required: false
    }

}, { collection: 'r_processes' });

require('./statics/r.process.static').default(RProcessSchema);

export default mongoose.model('RProcessModel', RProcessSchema);