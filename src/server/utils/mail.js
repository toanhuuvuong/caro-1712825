const { text } = require('express');
const nodemailer =  require('nodemailer');

const mailConfig = require('../config/mail');

const transporter =  nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailConfig.MAIL_SERVER,
    pass: mailConfig.MAIL_SERVER_PASSWORD
  }
});

module.exports = {
  sendText: function(from, to, subject, content) {
    return new Promise(function(resolve, reject) {
      const mainOptions = {
        from: from,
        to: to,
        subject: subject,
        text: content
      };
      transporter.sendMail(mainOptions, function(err, info){
        if(err) {
          reject(err);
        } 
        resolve(info);
      });
    });
  },
  sendHtml: function(from, to, subject, content) {
    return new Promise(function(resolve, reject) {
      const mainOptions = {
        from: from,
        to: to,
        subject: subject,
        html: content
      };
      transporter.sendMail(mainOptions, function(err, info){
        if(err) {
          reject(err);
        } 
        resolve(info);
      });
    });
  }
};