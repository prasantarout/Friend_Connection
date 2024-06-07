import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import { deleteApi, getApi, postApi, putApi } from '../../utils/helpers/ApiRequest';

import {
  getGroupDetailsFailure,
  getGroupDetailsSuccess,
  getGroupInviteDetailsFailure,
  getGroupInviteDetailsSuccess,
  getGroupPostFailure,
  getGroupPostSuccess,
  groupCreateFailure,
  groupCreateSuccess,
  groupCreatedListFailure,
  groupCreatedListSuccess,
  groupInvitationFailure,
  groupInvitationRequest,
  groupInvitationSuccess,
  updategroupRequest,
  updategroupSuccess,
  updategroupFailure,
  pendinggroupRequest,
  pendinggroupSuccess,
  pendinggroupFailure,
  joinedgroupRequest,
  joinedgroupSuccess,
  joinedgroupFailure,
  toJoinAGroupSuccess,
  toJoinAGroupFailure,
  toRejectAGroupSuccess,
  toRejectAGroupFailure,
  toLeaveAGroupSuccess,
  toLeaveAGroupFailure
} from '../reducer/GroupReducer';

let getItem = state => state.AuthReducer;
let token = '';

//friendRequest
export function* GroupCreatedListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/created/list',
      action?.payload,
      header,
    );
    // console.log(response,"listapi>>>>>>");
    if (response?.status == 200) {
      yield put(groupCreatedListSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(groupCreatedListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(groupCreatedListFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* GroupInviteSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/send/invitation',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(
        groupInvitationSuccess({
          ...response?.data,
          data: {
            ...response?.data?.data,
            user_id: action.payload.user_id,
          },
        }),
      );
      // showErrorAlert(response.data.message);
    } else {
      yield put(groupInvitationFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(groupInvitationFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* GroupCreateSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'group/create', action?.payload, header);
    if (response?.status == 200) {
      yield put(groupCreateSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(groupCreateFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(groupCreateFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* getGroupPostSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'post/get/group/posts',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(getGroupPostSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(getGroupPostFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getGroupPostFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* getGroupDetailsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/details',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(getGroupDetailsSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(getGroupDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getGroupDetailsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* getGroupInviteDetailsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/friend/list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(getGroupInviteDetailsSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(getGroupInviteDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(getGroupInviteDetailsFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//updategroupSaga

export function* updategroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      putApi,
      'group/update',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(updategroupSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(updategroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(updategroupFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
//pendinggroupSaga

export function* pendinggroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/pending/list',
      action?.payload,
      header,
    );
    // console.log(response,"listapi>>>>>>");
    if (response?.status == 200) {
      yield put(pendinggroupSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(pendinggroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(pendinggroupFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}
//joinedgroupSaga
export function* joinedgroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/joined/list',
      action?.payload,
      header,
    );
    // console.log(response,"listapi>>>>>>");
    if (response?.status == 200) {
      yield put(joinedgroupSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(joinedgroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(joinedgroupFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}

//To join a group
export function* toJoinAGroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/invite/join',
      action?.payload,
      header,
    );
    // console.log("toJoinAGroupSaga>>>>>>",response.data);
    if (response?.status == 200) {
      yield put(toJoinAGroupSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(toJoinAGroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    // console.log("toJoinAGroupSaga>>>>>> error",error?.response?.data);
    yield put(toJoinAGroupFailure(error)); 
    showErrorAlert(error?.response?.data?.message);
  }
}
//To Invite a group
export function* toRejectAGroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/invite/decline', 
      action?.payload,
      header,
    );
    // console.log("toRejectAGroupSaga>>>>>>",response.data);
    if (response?.status == 200) {
      yield put(toRejectAGroupSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(toRejectAGroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log("toRejectAGroupSaga>>>>>> error",error?.response?.data);
    yield put(toRejectAGroupFailure(error)); 
    showErrorAlert(error?.response?.data?.message);
  }
}
//To Leave a group
export function* toLeaveAGroupSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'group/leave', 
      action?.payload,
      header,
    );
    // console.log("toLeaveAGroupSaga>>>>>>",response.data);
    if (response?.status == 200) {
      yield put(toLeaveAGroupSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(toLeaveAGroupFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log("toLeaveAGroupSaga>>>>>> error",error?.response?.data);
    yield put(toLeaveAGroupFailure(error)); 
    showErrorAlert(error?.response?.data?.message);
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Group/groupCreatedListRequest', GroupCreatedListSaga);
  })(),
  (function* () {
    yield takeLatest('Group/groupInvitationRequest', GroupInviteSaga);
  })(),
  (function* () {
    yield takeLatest('Group/groupCreateRequest', GroupCreateSaga);
  })(),
  (function* () {
    yield takeLatest('Group/getGroupPostRequest', getGroupPostSaga);
  })(),
  (function* () {
    yield takeLatest('Group/getGroupDetailsRequest', getGroupDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Group/getGroupInviteDetailsRequest', getGroupInviteDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Group/updategroupRequest', updategroupSaga);
  })(),
  (function* () {
    yield takeLatest('Group/pendinggroupRequest', pendinggroupSaga);
  })(),
  (function* () {
    yield takeLatest('Group/joinedgroupRequest', joinedgroupSaga);
  })(),
  (function* () {
    yield takeLatest('Group/toJoinAGroupRequest', toJoinAGroupSaga);
  })(),
  (function* () {
    yield takeLatest('Group/toRejectAGroupRequest', toRejectAGroupSaga);
  })(),
  (function* () {
    yield takeLatest('Group/toLeaveAGroupRequest', toLeaveAGroupSaga);
  })(),
];

export default watchFunction;
