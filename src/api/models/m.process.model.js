import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MProcessSchema = new Schema({

    // name process
    process: {
        type: String,
        required: [
            true, 'Process name is required.'
        ]
    },

    description: {
        type: String,
        required: false
    },

    active: {
        type: Boolean,
        default: false
    },

    entities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'VUEntityModel',
            required: [
                true, 'The entity is required.'
            ]
        }
    ],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'VUUserModel',
        required: [
            true, 'The entity is required.'
        ]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'm_process' });

require('./statics/m.process.static').default(MProcessSchema);

export default mongoose.model('MProcessModel', MProcessSchema);