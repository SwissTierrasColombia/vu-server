import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VUDeparmentSchema = new Schema({

    department: {
        type: String,
        required: [
            true, 'Department required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'vu_departments' });

require('./statics/vu.department.static').default(VUDeparmentSchema);

export default mongoose.model('VUDepartmentModel', VUDeparmentSchema);