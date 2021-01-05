export default {
  search: function(keySearch, rooms) {
    if(!rooms) {
      return null;
    }
    return rooms.filter(room => {
      return (room.id === keySearch);
    });
  }
}