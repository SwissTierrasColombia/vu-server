import { result, invalid, error } from 'express-easy-helper';
import { r } from '../../lib/redis-jwt';
import config from '../../config';

// Initialize after login success
export async function initialize(err, user, res) {

  try {
    // Errors
    if (err)
      return invalid(res, { message: err });
    if (!user)
      return error(res, { message: 'Something went wrong, please try again.' });

    // Create session in redis-jwt
    const token = await r.sign(user._id.toString(), {
      ttl: '30 days',
      dataSession: {// save data in REDIS (Private)
        ip: res.req.headers['x-forwarded-for'] || res.req.connection.remoteAddress,
        agent: res.req.headers['user-agent']
      },
      dataToken: {// save data in Token (Public)
        roles: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      }
    });

    // return token
    return result(res, { token });

  } catch (e) {
    return error(res, { message: e });
  }

}