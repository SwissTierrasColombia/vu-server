// Libs
import { addPopulates } from '../../../lib/helpers/mongoose';
import moment from 'moment';


export default (VUUserModel) => {

    // Statics
    VUUserModel.statics = {

        loginByLocal(username, password) {

            return new Promise((resolve, reject) => {

                const VUUserModel = this;

                VUUserModel.findOne({
                    username: username
                }).then(user => {

                    if (!user)
                        reject(`${username}' is not registered.`); // You can register user here

                    user.authenticate(password).then(isMatch => { // validate password
                        if (!isMatch)
                            reject(`This password is not correct.`);

                        user.lastAccessAt = moment();

                        user.save().then(_user => resolve(_user)).catch(err => reject(err));

                    });

                }).catch(err => reject(err));

            });

        },

        async getUserById(userId, populates) {
            let user = this.findById(userId);
            user = addPopulates(user, populates);
            return await user.exec();
        },

    };

};