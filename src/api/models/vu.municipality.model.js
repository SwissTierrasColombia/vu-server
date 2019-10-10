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

    versions: [
        {
            name: {
                type: String,
                required: [
                    true, 'Name required.'
                ],
            },
            order: {
                type: Number,
                required: [
                    true, 'Order required.'
                ],
            },
            layer: {
                type: String,
                required: [
                    true, 'Layer required.'
                ],
            },
            srs: {
                type: String,
                required: [
                    true, 'Srs required.'
                ],
            },
            connection: {
                host: {
                    type: String,
                    required: [
                        true, 'Host required.'
                    ],
                },
                port: {
                    type: String,
                    required: [
                        true, 'Port required.'
                    ],
                },
                database: {
                    type: String,
                    required: [
                        true, 'Database required.'
                    ],
                },
                schema: {
                    type: String,
                    required: [
                        true, 'Schema required.'
                    ],
                },
                username: {
                    type: String,
                    required: [
                        true, 'Username required.'
                    ],
                },
                password: {
                    type: String,
                    required: [
                        true, 'Password required.'
                    ],
                }
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'vu_municipalities' });

require('./statics/vu.municipality.static').default(VUMunicipalitySchema);

export default mongoose.model('VUMunicipalityModel', VUMunicipalitySchema);