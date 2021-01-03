export default {
  search: function(keySearch, users) {
    if(!users) {
      return null;
    }
    const key = keySearch.toLowerCase();
    return users.filter(user => {
      return (user.username.toLowerCase().includes(key) ||
      user.name.toLowerCase().includes(key) ||
      user.role.toLowerCase().includes(key));
    });
  }
}