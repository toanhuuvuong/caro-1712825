export default {
  //SERVER_URL: 'https://caro-do-an-ck-api.herokuapp.com',
  //CLIENT_URL: 'https://caro-1712825.herokuapp.com',
  SERVER_URL: 'http://localhost:8080',
  CLIENT_URL: 'http://localhost:3000',
  GAME_STATE_DEFAULT: {
    COL: 30,
    ROW: 30
  },
  ACTION_TYPES: {
    GAME: {
      CLICK: 'CLICK',
      JUMP_TO: 'JUMP_TO',
      HIGHT_LIGHT: 'HIGHT_LIGHT',
      CHANGE_RESULT: 'CHANGE_RESULT',
      SORT: 'SORT',
      CHANGE_BOARD_SIZE: 'CHANGE_BOARD_SIZE',
      GET_ROOM_DETAIL: 'GET_ROOM_DETAIL',
      GET_PLAYER: 'GET_PLAYER',
      CHANGE_GAME_STATE: 'CHANGE_GAME_STATE'
    },
    GAME_REVIEW: {
      CLICK: 'CLICK_REVIEW',
      JUMP_TO: 'JUMP_TO_REVIEW',
      HIGHT_LIGHT: 'HIGHT_LIGHT_REVIEW',
      CHANGE_RESULT: 'CHANGE_RESULT_REVIEW',
      CHANGE_GAME_PLAY: 'CHANGE_GAME_PLAY'
    }
  }
};