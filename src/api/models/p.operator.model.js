import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const POperatorSchema = new Schema({

    operator: {
        type: String,
        required: [
            true, 'Operator name is required.'
        ]
    },

    symbol: {
        type: String,
        required: [
            true, 'Symbol is required.'
        ]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'p_operators' });

require('./statics/p.operator.static.js').default(POperatorSchema);

export default mongoose.model('POperatorModel', POperatorSchema);