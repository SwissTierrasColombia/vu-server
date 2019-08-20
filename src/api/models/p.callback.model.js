import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PCallbackSchema = new Schema({

    callback: {
        type: String,
        required: [
            true, 'Callback name is required.'
        ]
    },

    fields: [
        {
            field: {
                type: String,
                required: [
                    true, 'Field is required.'
                ]
            },
            typeData: {
                type: Schema.Types.ObjectId,
                ref: 'PTypeDataModel',
                required: [
                    true, 'Type data is required.'
                ],
            },
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'p_callbacks' });

require('./statics/p.callback.static').default(PCallbackSchema);

export default mongoose.model('PCallbackModel', PCallbackSchema);