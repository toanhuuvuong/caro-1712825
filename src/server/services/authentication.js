const passport = require('passport');

const ensureAuthenticated = function(req, res, next) {
  passport.authenticate('jwt', { session: false }, function(err, user, info) { 
    if (err) { 
      return next(err); 
    } 
    if (!user) { 
      res.json({ok: false, messageCode: 'not_authenticated'});
    } else {
      next();
    }
  })(req, res, next);
};

const forwardAuthenticated = function(req, res, next) {
  passport.authenticate('jwt', { session: false }, function(err, user, info) { 
    if (err) { 
      return next(err); 
    } 
    if (!user) { 
      next();
    } else {
      res.json({ok: false, messageCode: 'forward_authenticated'});
    }
  })(req, res, next);
};

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    return ensureAuthenticated(req, res, next);
  },
  forwardAuthenticated: function(req, res, next) {
    return forwardAuthenticated(req, res, next);
  }
};