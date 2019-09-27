import passport from 'passport';
import { initialize } from '../services/session.service';
import { result, error, badRequest } from 'express-easy-helper';
import { getMessage } from '../../lib/helpers/locales';
import validator from 'validator';

// Business
import UserImplementation from '../../api/business/vu/user/user.implementation';

// Callback passport
export function callback(req, res, next) {
  passport.authenticate('local', (err, user) => initialize(err, user, res))(req, res, next);
}

// restore password
export async function restorePassword(req, res) {

  const language = 'es';

  try {

    // validate email
    req.checkBody("email", getMessage('vu.users.user_email_required', language)).notEmpty();
    req.checkBody("email", getMessage('vu.users.user_email_invalid', language)).isEmail();

    const errors = req.validationErrors();
    if (errors) {
      return badRequest(res, 400, { message: errors[0].msg });
    }

    const email = req.body.email.toLowerCase();

    await UserImplementation.iRestorePassword(email);

    return result(res, 200, {});
  } catch (exception) {
    console.log("local@restorePassword ---->", exception);
    if (exception.codeHttp && exception.key) {
      return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
    }
    return error(res, 500, { message: 'Server error ...' });
  }

}

// update password
export async function updatePassword(req, res) {

  const language = 'es';

  try {

    // validate email
    req.checkBody("email", getMessage('vu.users.user_email_required', language)).notEmpty();
    req.checkBody("email", getMessage('vu.users.user_email_invalid', language)).isEmail();

    // validate token
    req.checkBody("token", getMessage('vu.users.user_token_required', language)).notEmpty();

    // validate password
    req.checkBody("password", getMessage('vu.users.user_password_required', language)).notEmpty();

    console.log("holaa")

    const errors = req.validationErrors();
    if (errors) {
      return badRequest(res, 400, { message: errors[0].msg });
    }

    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const token = req.body.token;

    await UserImplementation.iUpdatePassword(token, email, password);

    return result(res, 200, {});
  } catch (exception) {
    console.log("local@updatePassword ---->", exception);
    if (exception.codeHttp && exception.key) {
      return error(res, exception.codeHttp, { message: getMessage(exception.key, language) });
    }
    return error(res, 500, { message: 'Server error ...' });
  }

}