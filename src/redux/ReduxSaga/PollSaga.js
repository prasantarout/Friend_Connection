import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteApi, getApi, postApi} from '../../utils/helpers/ApiRequest';

import {
  pollListRequest,
  pollListSuccess,
  pollListFailure,
  pollSubmitRequest,
  pollSubmitSuccess,
  pollSubmitFailure,
  pollUpdateRequest,
  pollUpdateSuccess,
  pollUpdateFailure,
  pollDeleteRequest,
  pollDeleteSuccess,
  pollDeleteFailure,
  pollVoteRequest,
  pollVoteSuccess,
  pollVoteFailure,
  pollOwnSuccess,
  pollOwnFailure,
  deletePollSuccess,
  deletePollFailure,
} from '../reducer/PollReducer';

export function* PollListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'poll/list', action?.payload, header);
    // console.log(response,"listapi>>>>>>");
    if (response?.status == 200) {
      yield put(pollListSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(pollListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(pollListFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PollVoteSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'poll/voting', action?.payload, header);
    // console.log(response,"listapi>>>>>>");
    if (response?.status == 200) {
      yield put(pollVoteSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(pollVoteFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(pollVoteFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PollSubmitSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'poll/create', action?.payload, header);
    //  console.log(response,">>>respopnse");
    if (response?.status == 200) {
      yield put(pollSubmitSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(pollSubmitFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>eror');
    yield put(pollSubmitFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}


export function* PollOwnSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'poll/list', action?.payload, header);
    //  console.log(response,">>>respopnse");
    if (response?.status == 200) {
      yield put(pollOwnSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(pollOwnFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>eror');
    yield put(pollOwnFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* DeletePollSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(deleteApi, 'poll/delete', action?.payload, header);
    if (response?.status == 200) {
      yield put(deletePollSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(deletePollFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(deletePollFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Poll/pollListRequest', PollListSaga);
  })(),
  (function* () {
    yield takeLatest('Poll/pollSubmitRequest', PollSubmitSaga);
  })(),
  (function* () {
    yield takeLatest('Poll/pollVoteRequest', PollVoteSaga);
  })(),
  (function* () {
    yield takeLatest('Poll/pollOwnRequest', PollOwnSaga);
  })(),
  (function* () {
    yield takeLatest('Poll/deletePollRequest', DeletePollSaga);
  })(),
];

export default watchFunction;
