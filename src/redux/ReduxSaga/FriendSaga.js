import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteApi, getApi, postApi} from '../../utils/helpers/ApiRequest';
import {
  clearChangePasswordSuccess,
  clearUpdateProfileSuccess,
  tigerAcceptFriedFailure,
  tigerAcceptFriedSuccess,
  tigerFriedFailure,
  tigerFriedListingFailure,
  tigerFriedListingSuccess,
  tigerFriedSuccess,
  tigerFriendDetailsFailure,
  tigerFriendDetailsSuccess,
  tigerFriendListingFailure,
  tigerFriendListingSuccess,
  tigerFriendSuggestionByProfileFailure,
  tigerFriendSuggestionByProfileSuccess,
  tigerFriendSuggestionFailure,
  tigerFriendSuggestionSuccess,
  tigerRejectFriedFailure,
  tigerRejectFriedSuccess,
  tigerUnFriedSuccess,
  userDetailsFailure,
  userDetailsSuccess,
} from '../reducer/FriendReducer';

let getItem = state => state.AuthReducer;
let token = '';

//friendRequest
export function* friendRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/request',
      action?.payload,
      header,
    );
    // console.log('friendRequestSaga response>>', response.data);
    if (response?.status == 200) {
      yield put(tigerFriedSuccess(response?.data));

      showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriedFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.error('friendRequestSaga error>>', error);
    yield put(tigerFriedFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//friendRequest
export function* friendRequestListingSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/request/listing',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerFriedListingSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriedListingFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('riendRequestListingSaga', error);
    yield put(tigerFriedListingFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//Accept friend Request
export function* AcceptFriendRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/request/accept',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerAcceptFriedSuccess(response?.data));

      showErrorAlert(response?.data?.message);
    } else {
      yield put(tigerAcceptFriedFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerAcceptFriedFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//Reject friend Request
export function* RejectFriendRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/request/reject',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerRejectFriedSuccess(response?.data));

      showErrorAlert(response?.data?.message);
    } else {
      yield put(tigerRejectFriedFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerRejectFriedFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//un-friend Request
export function* UnFriendRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/unfriend',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerUnFriedSuccess(response?.data));
      showErrorAlert(response?.data?.message);
    } else {
      yield put(tigerAcceptFriedFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerAcceptFriedFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//un-friend Request
export function* FriendListingRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/listing',
      action?.payload,
      header,
    );
    // console.log(response, '>>>>>>>respon');
    if (response?.status == 200) {
      yield put(tigerFriendListingSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriendListingFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerFriedListingFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//friend details Request
export function* FriendDetailsRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      postApi,
      'friend/details',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerFriendDetailsSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriendDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerFriendDetailsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//user details Request
export function* userDetailsRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      postApi,
      'friend/connection/details',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(userDetailsSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(userDetailsFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(userDetailsFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}

//un-friend Request
export function* FriendSuggestionRequestSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'friend/suggestions',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(tigerFriendSuggestionSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriendSuggestionFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerFriedListingFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

//friend suggesstion by profile
export function* FriendSuggestionByProfileSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    console.log('HITTT');
    let response = yield call(
      postApi,
      'friend/suggestions/by/profile',
      action?.payload,
      header,
    );
    console.log('HERERE11');
    if (response?.status == 200) {
      console.log('HERERE');
      yield put(tigerFriendSuggestionByProfileSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(tigerFriendSuggestionByProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(tigerFriendSuggestionByProfileFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* clearChangePasswordSaga(action) {
  try {
    yield put(clearChangePasswordSuccess(action.payload));
  } catch (error) {
    console.log('clearProductDetailsSaga>>', error);
  }
}

export function* clearUpdateProfileSaga(action) {
  try {
    yield put(clearUpdateProfileSuccess(action.payload));
  } catch (error) {
    console.log('clearProductDetailsSaga>>', error);
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Friend/tigerFriedRequest', friendRequestSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Friend/tigerFriedListingRequest',
      friendRequestListingSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Friend/tigerAcceptFriedRequest', AcceptFriendRequestSaga);
  })(),
  (function* () {
    yield takeLatest('Friend/tigerRejectFriedRequest', RejectFriendRequestSaga);
  })(),
  (function* () {
    yield takeLatest('Friend/tigerUnFriedRequest', UnFriendRequestSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Friend/tigerFriendListingRequest',
      FriendListingRequestSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Friend/tigerFriendDetailsRequest',
      FriendDetailsRequestSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Friend/userDetailsRequest', userDetailsRequestSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Friend/tigerFriendSuggestionRequest',
      FriendSuggestionRequestSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Friend/tigerFriendSuggestionByProfileRequest',
      FriendSuggestionByProfileSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Friend/clearChangePasswordRequest',
      clearChangePasswordSaga,
    );
  })(),

  (function* () {
    yield takeLatest(
      'Friend/clearUpdateProfileRequest',
      clearUpdateProfileSaga,
    );
  })(),
];

export default watchFunction;
