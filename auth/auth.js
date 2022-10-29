import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/users.js';
import catchAsync from '../utils/catchAsync.js';

dotenv.config({ path: './config.env' });

export default catchAsync(async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.cookie
    && req.headers.authorization.startsWith('jwt')
  ) {
    token = req.headers.cookie.split('=')[1];
  }

  if (token) {
    new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    })
      .then(async decoded => {
        const user = await User.findOne(
          { _id: decoded._id },
          { password: 0 },
        );

        if (!user) {
          return res.status(403).send({
            status: 'fail',
            errors: 'Invalid user or token',
          });
        }

        req.user = JSON.parse(JSON.stringify(user));

        next();
      })
      .catch(err => {
        console.log(err);
        return res.status(401).send({
          status: 'fail',
          errors: err,
        });
      });
  } else {
    return res.status(401).send({
      status: 'fail',
      errors: 'Missing authorization token',
    });
  }
});
