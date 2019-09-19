import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VUEntitySchema = new Schema({

    entity: {
        type: String,
        required: [
            true, 'Entity name is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'vu_entities' });

require('./statics/vu.entity.static').default(VUEntitySchema);

export default mongoose.model('VUEntityModel', VUEntitySchema);