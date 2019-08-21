import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MFieldSchema = new Schema({

    field: {
        type: String,
        required: [
            true, 'The field is required.'
        ]
    },

    description: {
        type: String,
        required: false
    },

    typeData: {
        type: Schema.Types.ObjectId,
        ref: 'PTypeDataModel',
        required: [
            true, 'The type data is required.'
        ],
    },

    isRequired: {
        type: Boolean,
        required: [
            true, 'It is mandatory to determine if the field is required.'
        ]
    },

    isPrivate: {
        type: Boolean,
        default: false,
        required: [
            true, 'It is mandatory to determine if the field is private.'
        ]
    },

    permissions: [
        {
            role: {
                type: Schema.Types.ObjectId,
                ref: 'MRoleModel',
                required: [
                    true, 'The role is required.'
                ],
            },
            create: {
                type: Boolean,
                required: [
                    true, 'The create is required.'
                ]
            },
            read: {
                type: Boolean,
                required: [
                    true, 'The read is required.'
                ]
            },
            update: {
                type: Boolean,
                required: [
                    true, 'The update is required.'
                ]
            },
        }
    ],

    step: {
        type: Schema.Types.ObjectId,
        ref: 'MStepModel',
        required: [
            true, 'The step is required.'
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'm_fields' });

require('./statics/m.field.static').default(MFieldSchema);

export default mongoose.model('MFieldModel', MFieldSchema);