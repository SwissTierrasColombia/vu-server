import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VUMunicipalitySchema = new Schema({

    municipality: {
        type: String,
        required: [
            true, 'Municipality required.'
        ],
    },

    department: {
        type: Schema.Types.ObjectId,
        ref: 'VUDepartmentModel',
        required: [
            true, 'Department is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'vu_municipalities' });

require('./statics/vu.municipality.static').default(VUMunicipalitySchema);

export default mongoose.model('VUMunicipalityModel', VUMunicipalitySchema);