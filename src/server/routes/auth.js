const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const CLIENT_LOGIN_PAGE_URL = process.env.CLIENT_URL + '/login';

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: CLIENT_LOGIN_PAGE_URL
}), function(req, res, next) {
  const payload = {
    id: req.user._id.toString(),
    username: req.user.username,
    name: req.user.name,
    avatar: req.user.avatar,
    trophies: req.user.trophies,
    win: req.user.win,
    lost: req.user.lost,
    total: req.user.total,
    role: req.user.role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  res.redirect(CLIENT_LOGIN_PAGE_URL + '?token=' + token + '&userId=' + payload.id + '#end');
});

router.get('/facebook', passport.authenticate('facebook', {scope: ['profile', 'email']}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  session: false,
  failureRedirect: CLIENT_LOGIN_PAGE_URL
}), function(req, res, next) {
  const payload = {
    id: req.user._id.toString(),
    username: req.user.username,
    name: req.user.name,
    avatar: req.user.avatar,
    trophies: req.user.trophies,
    win: req.user.win,
    lost: req.user.lost,
    total: req.user.total,
    role: req.user.role
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  res.redirect(CLIENT_LOGIN_PAGE_URL + '?token=' + token + '&userId=' + payload.id);
});

module.exports = router;