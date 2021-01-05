const moment = require('moment');

module.exports = function(user, content) {
  return {
    id: user.id + Date.now(),
    user: user,
    content: content,
    time: moment().format('h:mm a')
  };
};
