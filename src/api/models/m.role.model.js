import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MRoleSchema = new Schema({

    role: {
        type: String,
        required: [
            true, 'Role is required.'
        ]
    },

    process: {
        type: Schema.Types.ObjectId,
        ref: 'MProcessModel',
        required: [
            true, 'The process is required.'
        ],
    }

}, { collection: 'm_roles' });

require('./statics/m.role.static').default(MRoleSchema);

export default mongoose.model('MRoleModel', MRoleSchema);