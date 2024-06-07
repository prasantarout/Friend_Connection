import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import { deleteApi, getApi, postApi } from '../../utils/helpers/ApiRequest';
import {matchsuggestionlistRequest,
matchsuggestionlistSuccess,
matchsuggestionlistFailure,
matchuserdetailsRequest,
matchuserdetailsSuccess,
matchuserdetailsFailure,
followuserRequest,
followuserSuccess,
followuserFailure,
interestuserRequest,
interestuserSuccess,
interestuserFailure,
tigermatchjoinRequest,
tigermatchjoinSuccess,
tigermatchjoinFailure,
matchrequestlistRequest,
matchrequestlistSuccess,
matchrequestlistFailure,
matchfriendlistRequest,
matchfriendlistSuccess,
matchfriendlistFailure

} from '../reducer/MatchReducer'

let getItem = state => state.AuthReducer;
let token = '';

//friendRequest
export function* matchsuggestionlistsaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/suggestions/by/profile',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(matchsuggestionlistSuccess(response?.data));

    //   showErrorAlert(response.data.message);
    } else {
      yield put(matchsuggestionlistFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(matchsuggestionlistFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//matchuserdetailsSaga

export function* matchuserdetailsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/connection/details',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(matchuserdetailsSuccess(response?.data));

    //   showErrorAlert(response?.data?.message);
    } else {
      yield put(matchuserdetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(matchuserdetailsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//followuserSaga
export function* followuserSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/follow',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(followuserSuccess(response?.data));

      showErrorAlert(response?.data?.message);
    } else {
      yield put(followuserFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(followuserFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//interestuserSaga
export function* interestuserSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/mark/interested',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(interestuserSuccess(response?.data));

      showErrorAlert(response?.data?.message);
    } else {
      yield put(interestuserFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(interestuserFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//tigermatchjoinSaga
export function* tigermatchjoinSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/join',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigermatchjoinSuccess(response?.data));

    //   showErrorAlert(response?.data?.message);
    } else {
      yield put(tigermatchjoinFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigermatchjoinFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//matchrequestlistSaga
export function* matchrequestlistSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/request/listing',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(matchrequestlistSuccess(response?.data));

    //   showErrorAlert(response?.data?.message);
    } else {
      yield put(matchrequestlistFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(matchrequestlistFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//matchfriendlistSaga

export function* matchfriendlistSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'tiger-match/match/listing',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(matchfriendlistSuccess(response?.data));

    //   showErrorAlert(response?.data?.message);
    } else {
      yield put(matchfriendlistFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(matchfriendlistFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Match/matchsuggestionlistRequest', matchsuggestionlistsaga);
  })(),//matchuserdetailsRequest
  (function* () {
    yield takeLatest('Match/matchuserdetailsRequest', matchuserdetailsSaga);
  })(),//followuserRequest
  (function* () {
    yield takeLatest('Match/followuserRequest', followuserSaga);
  })(),//interestuserRequest
  (function* () {
    yield takeLatest('Match/interestuserRequest', interestuserSaga);
  })(),//tigermatchjoinRequest
  (function* () {
    yield takeLatest('Match/tigermatchjoinRequest', tigermatchjoinSaga);
  })(),//matchrequestlistRequest
  (function* () {
    yield takeLatest('Match/matchrequestlistRequest', matchrequestlistSaga);
  })(),//matchfriendlistRequest
  (function* () {
    yield takeLatest('Match/matchfriendlistRequest', matchfriendlistSaga);
  })(),
];

export default watchFunction;
