const jwt = require('jsonwebtoken');

const authManager = {
  verify(req, res, next) {
    console.log(`req: ${req}`);
    console.log(`next: ${next}`);
    console.log('Who called verify?');
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({
          loggedIn: false,
          user: null,
          errorMessage: 'Unauthorized',
        });
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`verified.userId: ${verified.userId}`);
      req.userId = verified.userId;

      return next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        loggedIn: false,
        user: null,
        errorMessage: 'Unauthorized',
      });
    }
  },
  verifyUser(req) {
    try {
      const { token } = req.cookies;
      if (!token) {
        return null;
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken.userId;
    } catch (err) {
      return null;
    }
  },
  signToken(userId) {
    return jwt.sign({
      userId,
    }, process.env.JWT_SECRET);
  },
};

const auth = authManager;
module.exports = auth;
