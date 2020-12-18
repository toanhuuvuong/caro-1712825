const onlineUsers = [];

module.exports = {
  addUser: function(user) {
    const index = onlineUsers.findIndex(function(item) {
      return item.id === user.id
    });
    if (index === -1) {
      onlineUsers.push(user);
      return user;
    }
    return null;
  },
  removeUser: function(userId) {
    const index = onlineUsers.findIndex(function(item) {
      return item.id === userId
    });
    if (index !== -1) {
      return onlineUsers.splice(index, 1)[0];
    }
    return null;
  },
  getOnlineUsers: function() {
    return onlineUsers;
  }
}