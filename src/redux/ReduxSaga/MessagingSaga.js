import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteApi, getApi, postApi, putApi} from '../../utils/helpers/ApiRequest';
import {
  getChatListRequest,
  getChatListSuccess,
  getChatListFailure,
  getChatMessageListRequest,
  getChatMessageListSuccess,
  getChatMessageListFailure,
  getMediaLinkSuccess,
  getMediaLinkFailure,
  blockunblockRequest,
  blockunblockSuccess,
  blockunblockFailure
} from '../reducer/MessagingReducer';

let getItem = state => state.AuthReducer;
let token = '';

//friendRequest
export function* messageListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'chat/list', action?.payload, header);
    // console.log('friendRequestSaga response>>', response.data);
    if (response?.status == 200) {
      yield put(getChatListSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(getChatListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getChatListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* getMediaLink(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    console.log('Innn');
    let response = yield call(postApi, 'chat/list', action?.payload, header);
    // console.log('friendRequestSaga response>>', response.data);
    if (response?.status == 200) {
      yield put(getMediaLinkSuccess(response?.data));

      showErrorAlert(response.data.message);
    } else {
      yield put(getMediaLinkFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.error('friendRequestSaga error>>', error);
    yield put(getMediaLinkFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//friendRequest
export function* messageChatListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'chat/message-list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(getChatMessageListSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(getChatMessageListFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getChatMessageListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//blockunblockSaga

export function* blockunblockSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      putApi,
      'chat/block-unblock',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(blockunblockSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(blockunblockFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(blockunblockFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}


const watchFunction = [
  (function* () {
    yield takeLatest('Messaging/getChatListRequest', messageListSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Messaging/getChatMessageListRequest',
      messageChatListSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Messaging/getMediaLinkRequest', getMediaLink);
  })(),//blockunblockRequest
  (function* () {
    yield takeLatest('Messaging/blockunblockRequest', blockunblockSaga);
  })(),
];

export default watchFunction;
