import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';

import {
  clearAllFeedListRequest,
  clearAllFeedListSuccess,
  getAllFeedFailure,
  getAllFeedSuccess,
} from '../reducer/HomeReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import {
  deleteApi,
  getApi,
  postApi,
  putApi,
} from '../../utils/helpers/ApiRequest';
import {signupFailure} from '../reducer/AuthReducer';

let getItem = state => state.AuthReducer;
let token = '';

//getAllFeedSaga saga
export function* getAllFeedSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'status/feed', action.payload, header);
    // console.error('getAllFeedSaga>>', response.data);
    if (response?.status == 200) {
      yield put(getAllFeedSuccess(response?.data));
    } else {
      yield put(getAllFeedFailure(response?.data));
    }
  } catch (error) {
    yield put(getAllFeedFailure(error));
  }
}

export function* clearAllFieldListSaga(action) {
  try {
    yield put(clearAllFeedListSuccess(action.payload));
  } catch (error) {
    // console.log('clearProductDetailsSaga>>', error);
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Home/getAllFeedRequest', getAllFeedSaga);
  })(),
  (function* () {
    yield takeLatest('Home/clearAllFeedListRequest', clearAllFieldListSaga);
  })(),
];

export default watchFunction;
