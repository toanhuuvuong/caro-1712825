const passportJwt = require('passport-jwt');
const passportGoogle = require('passport-google-oauth');
const passportFacebook = require('passport-facebook');

const userBUS = require('../bus/user');
const authConfig = require('../config/auth');

const JwtStragegy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.OAuth2Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};
const jwtStragegy = new JwtStragegy(jwtOptions, function(payload, done) {
  userBUS.findById(payload.id)
  .then(function(user) {
    if(!user) {
      return done(null, fasle);
    } else {
      return done(null, user);
    }
  })
  .catch(function(err) {
    console.trace(err);
    return done(null, fasle);
  });
});

const googleOptions = {
  clientID: authConfig.GOOGLE_CLIENT_ID,
  clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
};
const googleStrategy = new GoogleStrategy(googleOptions, function(accessToken, refreshToken, profile, done) {
  if (profile.id) {
    userBUS.findByGoogleId(profile.id)
    .then(function(user) {
      if(user) {
          done(null, user);
      } else {
        const newUser = {
          username: profile.emails[0].value,
          googleId: profile.id,
          facebookId: null,
          password: null,
          name: profile.name.familyName + ' ' + profile.name.givenName,
          avatar: null,
          role: 'user'
        };

        userBUS.insertOne(newUser)
        .then(function(result) {
          done(null, result);
        })
        .catch(function(err) {
          console.trace(err);
          done(null, false);
        });
      }
    })
    .catch(function(err) {
      console.trace(err);
      done(null, false);
    });
  }
});

const facebookOptions = {
  clientID: authConfig.FACEBOOK_CLIENT_ID,
  clientSecret: authConfig.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
};
const facebookStrategy = new FacebookStrategy(facebookOptions, function(accessToken, refreshToken, profile, done) {
  if (profile.id) {
    userBUS.findByFacebookId(profile.id)
    .then(function(user) {
      if(user) {
          done(null, user);
      } else {
        const newUser = {
          username: profile.emails[0].value,
          googleId: null,
          facebookId: profile.id,
          password: null,
          name: profile.name.familyName + ' ' + profile.name.givenName,
          avatar: null,
          role: 'user'
        };

        userBUS.insertOne(newUser)
        .then(function(result) {
          done(null, result);
        })
        .catch(function(err) {
          console.trace(err);
          done(null, false);
        });
      }
    })
    .catch(function(err) {
      console.trace(err);
      done(null, false);
    });
  }
});

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  passport.use(jwtStragegy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
};