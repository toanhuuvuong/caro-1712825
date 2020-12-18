const jwt = require('jsonwebtoken');

module.exports = function(app) {
  // --- Decode token
  app.use(function(req, res, next) {
    const authorization = req.headers.authorization;

    if(authorization) {
      const token = authorization.slice(7); // remove Bearer

      jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
        if (err) { 
          throw err;
        }
        req.user = decodedToken; // serialize user
        return next();
      });
    } else {
      return next();
    }
  });
};