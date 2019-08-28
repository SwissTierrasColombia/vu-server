import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;

const MUserSchema = new Schema({

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

  username: {
    type: String,
    lowercase: true,
    required: [
      true, 'Username is required.'
    ]
  },

  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MRoleModel',
      required: [
          true, 'The role is required.'
      ]
    }
  ],

  process: {
    type: Schema.Types.ObjectId,
    ref: 'MProcessModel',
    required: [
        true, 'The process is required.'
    ],
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { collection: 'm_users' });

require('./statics/m.user.static').default(MUserSchema);

export default mongoose.model('MUserModel', MUserSchema);