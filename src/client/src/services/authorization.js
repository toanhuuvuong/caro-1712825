import authenticationService from './authentication';

const authorizationTypes = {
  X_PLAYER: 'X_PLAYER',
  O_PLAYER: 'O_PLAYER',
  VIEWER: 'VIEWER',
  GUEST: 'GUEST'
};

export default {
  authorizationTypes: authorizationTypes,
  getAuthorizationInRoom: function(room) {
    const userId = authenticationService.getUserId();
    if(!userId) {
      return authorizationTypes.GUEST;
    }
    if(room.xPlayer && userId === room.xPlayer.id) {
      return authorizationTypes.X_PLAYER;
    }
    if(room.oPlayer && userId === room.oPlayer.id) {
      return authorizationTypes.O_PLAYER;
    }
    const viewers = room.viewers;
    for(const viewer of viewers) {
      if(viewer.id === userId) {
        return authorizationTypes.VIEWER;
      }
    }
    return authorizationTypes.GUEST;
  },
  getPlayer: function(room) {
    const userId = authenticationService.getUserId();
    if(!userId) {
      return null;
    }
    if(room.xPlayer && userId === room.xPlayer.id) {
      return room.xPlayer;
    }
    if(room.oPlayer && userId === room.oPlayer.id) {
      return room.oPlayer;
    }
    return null;
  },
  isPlayer: function(room) {
    const userId = authenticationService.getUserId();
    if(!userId) {
      return false;
    }
    if(room.xPlayer && userId === room.xPlayer.id) {
      return true;
    }
    if(room.oPlayer && userId === room.oPlayer.id) {
      return true;
    }
    
    return false;
  }
};