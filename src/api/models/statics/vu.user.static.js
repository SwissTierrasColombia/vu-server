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
                        reject(`El nombre de usuario no esta registrado.`); // You can register user here

                    user.authenticate(password).then(isMatch => { // validate password
                        if (!isMatch)
                            reject(`La contraseña es incorrecta.`);

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

        async getUserByUsername(username) {
            return await this.findOne({ username });
        },

        async getUserByEmail(email) {
            return await this.findOne({ email });
        },

        async createUser(firstName, lastName, email, username, password, roles, entities, enabled) {
            const VUUserModel = this;
            const user = new VUUserModel({
                firstName,
                lastName,
                email,
                username,
                password,
                roles,
                entities,
                enabled
            });
            return await user.save();
        },

        async getUsers(page, limit, populate) {
            return await this.paginate(
                {},
                {
                    'sort': { 'createdAt': -1 },
                    'page': page,
                    'limit': limit,
                    'populate': populate
                }
            );
        },

        async updateUser(userId, firstName, lastName, email, username, password, roles, entities) {
            const user = await this.findById(userId);
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.username = username;
            user.password = password;
            user.roles = roles;
            user.entities = entities;
            return await user.save();
        },

        async updateEnabled(userId, enabled) {
            const user = await this.findById(userId);
            user.enabled = enabled;
            return await user.save();
        },

        async countUserWithRole(roleId) {
            return await this.count({
                roles: { "$in": [roleId] }
            });
        }

    };

};