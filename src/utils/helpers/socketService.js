import {io} from 'socket.io-client';
import constants from './constants';

const customHeaders = {
  'user-agent': 'node-XMLHttpRequest',
  accept: '*/*',
  // 'x-access-token': getAccessToken(useSelector(state => state)),
  // host: 'your-socket-server-host',
  connection: 'close',
};
// console.log("AuthReducer?.getAccessToken",getAccessToken(useSelector(state => state)));
// let socket
let socketInstance = null;
class WSservice {
  initialize = token => {
    try {
      this.socket = io(constants.SOCKET_BASE_URL, {
        autoConnect: true,
        transportOptions: {
          polling: {
            extraHeaders: {...customHeaders, 'x-access-token': token},
          },
        },
      });
      // console.log('Initialize Socket Connection', this.socket);
      this.socket.on('connect', data => {
        // console.log('==== Socket Connected ====', data);
      });
      this.socket.on('disconnect', data => {
        // console.log('==== Socket Disconnected ====', data);
      });
      this.socket.on('error', data => {
        // console.log('==== Socket Connection Error ====', data);
      });
    } catch (err) {
      console.log('Socket Error', err);
    }
  };

  emit(event, data = {}) {
    // console.log("emit>>>",data);
    this.socket.emit(event, data);
  }
  on(event, cb) {
    this.socket.on(event, cb);
  }
  removeEventListener(listener) {
    this.socket.removeEventListener(listener);
  }
}

//const SocketService = new WSservice();

// export const events = {
//   sendMessage: 'message',
//   rcvMessage: 'chatlist',
//   typeResp: 'typingResponse',
//   type: 'typing',
//   users: 'guest_list',
//   sendParam: 'guest_list_initialize',
//   sendPramChatHeader: 'message_user_details',
//   chatdetailHeader: 'user_details',
//   rcvMessageParam: 'details_message',
//   seen: 'seen',
// };

export default token => {
  if (socketInstance == null) {
    socketInstance = new WSservice();
    socketInstance.initialize(token);
    return socketInstance;
  } else {
    return socketInstance;
  }
};
