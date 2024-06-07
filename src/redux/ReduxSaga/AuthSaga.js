import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';

import {
  signupSuccess,
  signupFailure,
  loginSuccess,
  loginFailure,
  forgotpasswordSuccess,
  forgotpasswordFailure,
  otpverificationSuccess,
  otpverificationFailure,
  craetenewpasswordSuccess,
  craetenewpasswordFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
  classListSuccess,
  classListFailure,
  degreeListSuccess,
  degreeListFailure,
  streamListSuccess,
  streamListFailure,
  getProfileSuccess,
  getProfileFailure,
  resendOtpSuccess,
  resendOtpFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearChangePasswordSuccess,
  contactUsRequest,
  contactUsFailure,
  contactUsSuccess,
  updateProfileSuccess,
  updateProfileFailure,
  clearUpdateProfileSuccess,
  universityListSuccess,
  universityListFailure,
  getTokenSuccess,
  getTokenFailure,
  notificationlistRequest,
  notificationlistSuccess,
  notificationlistFailure,
  cmsContentSuccess,
  cmsContentFailure,
  GetCmsContentSuccess,
  GetCmsContentFailure,
  validateEmailExitsSuccess,
  validateEmailExitsFailure,
  clearProfileSuccess,
  logoutSuccess,
  logoutFailure,
} from '../reducer/AuthReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import {
  deleteApi,
  getApi,
  postApi,
  putApi,
} from '../../utils/helpers/ApiRequest';

let getItem = state => state.AuthReducer;
let token = '';

//signupSaga saga
export function* signupSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'user/signup', action?.payload, header);
    if (response?.status == 200) {
      yield put(signupSuccess(response?.data));

      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      //   response?.data?.data?.isApprove,
      // );
      showErrorAlert(response.data.message);
    } else {
      yield put(signupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(signupFailure(error));
    console.log(error);
    showErrorAlert(
      error?.response?.data?.message == 'Validation Error.'
        ? error?.response?.data?.data?.email[0]
        : error?.response?.data?.message,
    );
  }
}

// Get Token Saga
export function* getTokensaga() {
  try {
    const response = yield call(AsyncStorage.getItem, constants?.TOKEN);
    // console.log('Token', response);
    if (response != null) {
      yield put(getTokenSuccess(response));
    } else {
      yield put(getTokenSuccess(null));
    }
  } catch (error) {
    yield put(getTokenFailure(null));
  }
}

//login saga
export function* loginSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'user/signin', action?.payload, header);
    if (response?.status == 200) {
      // console.log(response);
      // if (action.payload.savePassword) {
      //   yield call(
      //     AsyncStorage.setItem,
      //     constants.WHICHCREADS,
      //     JSON.stringify({
      //       email: action?.payload?.creads?.email ?? '',
      //       password: action?.payload?.creads?.password ?? '',
      //     }),
      //   );
      // }

      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SignUpResponse,
      //   response?.data?.data?.isApprove,
      // );
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.SetupToken,
      //   response?.data?.data?.isProfileCompleted.toString(),
      // );
      // yield call(
      //   AsyncStorage.setItem,
      //   constants.REFRESH_TOKEN,
      //   response?.data?.refresh_token,
      // );

      // yield put(getTokenSuccess(response?.data?.token));
      // navigate('TabNavigator', {
      //   screen: 'Home',
      // });
      yield put(loginSuccess(response?.data?.data));
      showErrorAlert('Login Successful');
    } else {
      yield put(loginFailure(response?.data));
      // showErrorAlert("Login failed");
    }
  } catch (error) {
    yield put(loginFailure(error));
    console.log(error)
    showErrorAlert(error?.response?.data?.message);
  }
}

//forgot password
export function* forgotpasswordSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'user/forgot-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(forgotpasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('ForgotPasswordOtpVerify', action.payload);
    } else {
      yield put(forgotpasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotpasswordFailure(error));
    showErrorAlert(error?.response?.message);
  }
}

export function* resetPasswordSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'user/reset-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(resetPasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('ForgotPasswordOtpVerify', action.payload);
    } else {
      yield put(resetPasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(resetPasswordFailure(error));
    // showErrorAlert('Sorry user not found');
  }
}

///create new password
export function* craetenewpasswordSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'user/change-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(craetenewpasswordSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('Signin');
    } else {
      yield put(craetenewpasswordFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(craetenewpasswordFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* otpverificationSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/otp-verification',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(otpverificationSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('ChangePassword', {email: action?.payload?.email});
    } else {
      yield put(otpverificationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(otpverificationFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* resendOtpSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'user/resend-forgot-password-otp',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(resendOtpSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('ChangePassword', {email: action?.payload?.email});
    } else {
      yield put(resendOtpFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(resendOtpFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* deleteAccountSaga(action, props) {
  const getToken = yield call(AsyncStorage.getItem, constants.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      deleteApi,
      'user/profile/delete',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(deleteAccountSuccess(response?.data));
      showErrorAlert(response.data.message);
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield call(AsyncStorage.removeItem, constants.SignUpResponse);
    } else {
      yield put(deleteAccountFailure(response?.data));
      // Toast(response.data.message);
    }
  } catch (error) {
    console.log(error);
    yield put(deleteAccountFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* classListSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      getApi,
      'class/list',
      // action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(classListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(classListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(classListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* degreeListSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      getApi,
      'degree/list',
      // action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(degreeListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(degreeListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(degreeListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* streamListSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      getApi,
      'education-stream/list',
      // action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(streamListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(streamListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(streamListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* universityListSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      getApi,
      'university/list',
      // action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(universityListSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(universityListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(universityListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* getProfileSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  // console.log('token :', getToken);
  // const getToken1 = yield call(AsyncStorage.getItem, constants?.LoginToken);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      getApi,
      'user/profile',
      // action.payload,
      header,
    );
    // console.log(response, 'get>>>>>>>>>>>');
    if (response?.status == 200) {
      yield put(getProfileSuccess(response?.data));
      yield call(
        AsyncStorage.setItem,
        constants.SignUpResponse,
        response?.data?.data?.isApprove,
      );
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(getProfileFailure(response?.data));
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getProfileFailure(error));
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* contactUsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);

  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'contact-us/submit',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(contactUsSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('Signin');
    } else {
      yield put(contactUsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(contactUsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* updateProfileSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      putApi,
      'user/update-profile',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(updateProfileSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate('Signin');
    } else {
      yield put(updateProfileFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(updateProfileFailure(error));
    // console.log(error?.response?.data,"updateProfileSaga");
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* cmsContentSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      getApi,
      'cms/list-slugs',
      // action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(cmsContentSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate('Signin');
    } else {
      yield put(cmsContentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(cmsContentFailure(error));
    // console.log(error?.response?.data,"updateProfileSaga");
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* GetCmsContentSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  // console.log(header);
  try {
    let response = yield call(
      getApi,
      `cms/content/${action.payload}`,
      // action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(GetCmsContentSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate('Signin');
    } else {
      yield put(GetCmsContentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(GetCmsContentFailure(error));
    console.log(error, 'updateProfileSaga');
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* clearChangePasswordSaga(action) {
  try {
    yield put(clearChangePasswordSuccess(action.payload));
  } catch (error) {
    // console.log('clearProductDetailsSaga>>', error);
  }
}

export function* clearUpdateProfileSaga(action) {
  try {
    yield put(clearUpdateProfileSuccess(action.payload));
  } catch (error) {
    // console.log('clearProductDetailsSaga>>', error);
  }
}
export function* clearProfileSaga(action) {
  try {
    yield put(clearProfileSuccess(action.payload));
  } catch (error) {
    // console.log('clearProductDetailsSaga>>', error);
  }
}

//notificationlistSaga
export function* notificationlistSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'notification/list',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(notificationlistSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(notificationlistFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(notificationlistFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* signUpEmailExitsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'user/signup/check-exist',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(validateEmailExitsSuccess(response?.data));
      // showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(validateEmailExitsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(validateEmailExitsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* LogoutSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      getApi,
      'user/signout',
      // action.payload,
      header,
    );
    console.log(response,">>>>>>>>>resposne")
    if (response?.status == 200) {
      yield put(logoutSuccess(response?.data));
      showErrorAlert(response?.data?.message);
      // navigate("ChangePassword", { email: action?.payload?.email });
    } else {
      yield put(logoutFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(logoutFailure(error));
    console.log(error,">>>>>>>.ress")
    showErrorAlert(error?.response?.data?.message);
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/signupRequest', signupSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/getTokenRequest', getTokensaga);
  })(),

  (function* () {
    yield takeLatest('Auth/loginRequest', loginSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/forgotpasswordRequest', forgotpasswordSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/craetenewpasswordRequest', craetenewpasswordSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/otpverificationRequest', otpverificationSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/resendOtpRequest', resendOtpSaga);
  })(),

  (function* () {
    yield takeLatest('Auth/deleteAccountRequest', deleteAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/classListRequest', classListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/degreeListRequest', degreeListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/streamListRequest', streamListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/universityListRequest', universityListSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/getProfileRequest', getProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/resetPasswordRequest', resetPasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/contactUsRequest', contactUsSaga);
  })(),

  (function* () {
    yield takeLatest(
      'Auth/clearChangePasswordRequest',
      clearChangePasswordSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Auth/updateProfileRequest', updateProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/clearUpdateProfileRequest', clearUpdateProfileSaga);
  })(), //notificationlistRequest
  (function* () {
    yield takeLatest('Auth/notificationlistRequest', notificationlistSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/cmsContentRequest', cmsContentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/getCmsContentRequest', GetCmsContentSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/validateEmailExitsRequest', signUpEmailExitsSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/clearProfileRequest', clearProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/logoutRequest', LogoutSaga);
  })(),
];

export default watchFunction;
