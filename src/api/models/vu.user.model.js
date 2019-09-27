import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;

const VUUserSchema = new Schema({

    firstName: {
        type: String,
        required: [
            true, 'First name is required.'
        ],
    },

    lastName: {
        type: String,
        required: [
            true, 'Last name is required.'
        ],
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [
            true, 'Email is required.'
        ]
    },

    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [
            true, 'Username is required.'
        ]
    },

    password: {
        type: String,
        required: [
            true, 'Password is required.'
        ]
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

    entities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'VUEntityModel',
            required: [
                true, 'The entity is required.'
            ]
        }
    ],

    otp: {
        secret: {
            type: String
        },
        step: {
            type: Number,
        },
        token: {
            type: String
        }
    },

    enabled: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    lastAccessAt: {
        type: Date
    },

}, { collection: 'vu_users' });


require('./statics/vu.user.static').default(VUUserSchema);
require('./methods/vu.user.method').default(VUUserSchema);

VUUserSchema.plugin(mongoosePaginate);

export default mongoose.model('VUUserModel', VUUserSchema);