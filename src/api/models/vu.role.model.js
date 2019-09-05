import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VURoleSchema = new Schema({

    role: {
        type: String,
        required: [
            true, 'Role name is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'vu_roles' });

require('./statics/vu.role.static').default(VURoleSchema);

export default mongoose.model('VURoleModel', VURoleSchema);