import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MVariableSchema = new Schema({

    variable: {
        type: String,
        required: [
            true, 'The variable is required.'
        ]
    },

    value: {
        type: Schema.Types.Mixed,
        required: [
            true, 'The value is required.'
        ]
    },

    process: {
        type: Schema.Types.ObjectId,
        ref: 'MProcessModel',
        required: [
            true, 'The process is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'm_variables' });

require('./statics/m.variable.static').default(MVariableSchema);

export default mongoose.model('MVariableModel', MVariableSchema);