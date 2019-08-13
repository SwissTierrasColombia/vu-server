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

    // global variables
    variables: [
        {
            key: {
                type: String,
                required: [
                    true, 'Key is required.'
                ]
            },
            value: {
                type: Schema.Types.Mixed,
                required: [
                    true, 'Value is required.'
                ]
            },
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'm_process' });

require('./statics/m.process.static').default(MProcessSchema);

export default mongoose.model('MProcessModel', MProcessSchema);