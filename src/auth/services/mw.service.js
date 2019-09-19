import { unauthorized, forbidden } from 'express-easy-helper';
import { r } from '../../lib/redis-jwt';
import { has } from 'role-calc';
import VUUserModel from '../../api/models/vu.user.model';

// VerifyToken
export async function mw(req, authOrSecDef, token, cb) {

  const requiredRoles = req.swagger.operation["x-security-scopes"];

  if (token) {
    // Bearer
    req.headers.authorization = `Bearer ${token}`;

    // Verify Token with redis-jwt -> if you want to extract the data you should add true: r.verify(token, true);
    let session = null;
    try {
      session = await r.verify(token, true);
      if (!session)
        return cb(forbidden(req.res, 403, { message: "The session has expired", tokenExpiration: true }));
    } catch (error) {
      return cb(forbidden(req.res, 403, { message: "The token is invalid", tokenExpiration: true }));
    }

    // Extract info user from MongoDB
    let _user = await VUUserModel.findById(session.id);
    if (!_user)
      return cb(unauthorized(req.res));

    // If id's not equals
    if (_user._id.toString() !== session.id.toString())
      return cb(forbidden(req.res));

    // User is enabled?
    if (!_user.enabled)
      return cb(unauthorized(req.res));

    if (requiredRoles) {
      let valid = false;
      const rolesUser = _user.roles;
      for (let i = 0; i < rolesUser.length; i++) {
        const roleUser = rolesUser[i].toString();
        const roleFind = requiredRoles.find(item => {
          return item.toString() === roleUser;
        });
        if (roleFind) {
          valid = true;
          break;
        }
      }
      if (!valid)
        return cb(forbidden(req.res, 403, { message: "Access denied by permissions" }));
    }

    // Success
    req.user = Object.assign({ session }, _user._doc);

    return cb(null);
  } else {
    return cb(forbidden(req.res));
  }
}