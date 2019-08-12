import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PTypesDataSchema = new Schema({

    typeData: {
        type: String,
        required: [
            true, 'Type data is required.'
        ]
    }

}, { collection: 'p_types_data' });

require('./statics/p.typesData.static').default(PTypesDataSchema);

export default mongoose.model('PTypeDataModel', PTypesDataSchema);