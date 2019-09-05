import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import VUUserModel from '../../api/models/vu.user.model';

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, function (username, password, done) {

  VUUserModel.loginByLocal(username, password)
    .then(user => done(null, user))
    .catch(err => done(err));

}));