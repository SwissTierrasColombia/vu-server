import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MStepSchema = new Schema({

    process: {
        type: Schema.Types.ObjectId,
        ref: 'MProcessModel',
        required: [
            true, 'The process is required.'
        ],
    },

    rules: [

        {
            conditions: [

                {
                    field: {
                        type: Schema.Types.ObjectId,
                        ref: 'MFieldModel',
                        required: [
                            true, 'The field is required.'
                        ],
                    },
                    operator: {
                        type: Schema.Types.ObjectId,
                        ref: 'POperatorModel',
                        required: [
                            true, 'The operator is required.'
                        ],
                    },
                    value: {
                        type: Schema.Types.Mixed,
                        required: [
                            true, 'Value is required.'
                        ],
                    }
                }

            ],
            callbacks: [
                {
                    callback: {
                        type: Schema.Types.ObjectId,
                        ref: 'PCallbackModel',
                        required: [
                            true, 'The callback is required.'
                        ],
                    },
                    metadata: {
                        type: Schema.Types.Mixed,
                        required: false
                    }
                }
            ]
        }

    ],

    typeStep: {
        type: Schema.Types.ObjectId,
        ref: 'PStepModel',
        required: [
            true, 'The type step is required.'
        ],
    },

    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'VURoleModel',
            required: [
                true, 'The role is required.'
            ]
        }
    ],

    entity: {
        type: Schema.Types.ObjectId,
        ref: 'VUEntityModel',
        required: false
    },

    isFirst: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'm_steps' });

require('./statics/m.step.static').default(MStepSchema);

export default mongoose.model('MStepModel', MStepSchema);