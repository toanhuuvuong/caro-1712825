const moment = require('moment');

module.exports = function(username, content) {
  return {
    id: username + Date.now(),
    username: username,
    content: content,
    time: moment().format('h:mm a')
  };
};
