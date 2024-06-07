import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteApi, getApi, postApi} from '../../utils/helpers/ApiRequest';

import {
  clearPostSubmitSuccess,
  deletePostFailure,
  deletePostSuccess,
  postCommentFailure,
  postCommentListFailure,
  postCommentListSuccess,
  postCommentReactionFailure,
  postCommentReactionSuccess,
  postCommentSuccess,
  postFavoriteFailure,
  postFavoriteSuccess,
  postListFailure,
  postListRequest,
  postListSuccess,
  postReactionFailure,
  postReactionSuccess,
  postShareFailure,
  postShareSuccess,
  postSubmitFailure,
  postSubmitSuccess,
} from '../reducer/PostReducer';
import {useNavigation} from '@react-navigation/native';
import { deleteAccountFailure } from '../reducer/AuthReducer';

let getItem = state => state.AuthReducer;
let token = '';

//friendRequest
export function* PostListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'post/list', action?.payload, header);
    if (response?.status == 200) {
      let tempObj={};
       
      yield put(postListSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(postListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(postListFailure(error));
    console.log(error);
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostSubmitSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    // Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'post/submit', action?.payload, header);
    //  console.log(response,">>>respopnse");
    if (response?.status == 200) {
      yield put(postSubmitSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(postSubmitFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>eror');
    yield put(postSubmitFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostShareSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'post/share', action?.payload, header);
    if (response?.status == 200) {
      yield put(postShareSuccess(response?.data));

      showErrorAlert(response.data.message);
    } else {
      yield put(postShareFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(postShareFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}
export function* PostReactionSaga(action) {
  // console.log(action.payload);
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'post/reaction',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(postReactionSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(postReactionFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(postReactionFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostCommentListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'post/comment/list',
      action?.payload,
      header,
    );
    // console.log(response,">>>>>rss");
    if (response?.status == 200) {
      yield put(postCommentListSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(postCommentListFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(postCommentListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostCommentSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'post/comment', action?.payload, header);
    // console.log(response,"comment>>>>>>>>>");
    if (response?.status == 200) {
      yield put(postCommentSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(postCommentFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>>>error');
    yield put(postCommentListFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostCommentReactionSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'post/comment/reaction',
      action?.payload,
      header,
    );
    // console.log(response,"comment>>>>>>>>>");
    if (response?.status == 200) {
      yield put(postCommentReactionSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(postCommentReactionFailure(response?.data));
      // showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    // console.log(error,">>>>>>>>>error");
    yield put(postCommentReactionFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}

export function* PostFavoriteSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'post/make-favourite',
      action?.payload,
      header,
    );
    // console.log(response,"favorite>>>>>>>>>");
    if (response?.status == 200) {
      yield put(postFavoriteSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(postFavoriteFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>>>error');
    yield put(postFavoriteFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}


export function* deletePostSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      deleteApi,
      'post/delete',
      action?.payload,
      header,
    );
    // console.log(response,"favorite>>>>>>>>>");
    if (response?.status == 200) {
      yield put(deletePostSuccess(response?.data));
      showErrorAlert(response.data.message);
    } else {
      yield put(deletePostFailure(response?.data));
      showErrorAlert(response?.data?.message);
    }
  } catch (error) {
    console.log(error, '>>>>>>>>>error');
    yield put(deleteAccountFailure(error));
    showErrorAlert(error?.response?.data?.message);
  }
}


export function* clearPostSubmitSaga(action) {
  try {
    yield put(clearPostSubmitSuccess(action.payload));
  } catch (error) {
    // console.log('clearProductDetailsSaga>>', error);
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Post/postListRequest', PostListSaga);
  })(),
  (function* () {
    yield takeLatest('Post/postSubmitRequest', PostSubmitSaga);
  })(),
  (function* () {
    yield takeLatest('Post/postShareRequest', PostShareSaga);
  })(),
  (function* () {
    yield takeLatest('Post/postReactionRequest', PostReactionSaga);
  })(),
  (function* () {
    yield takeLatest('Post/postCommentListRequest', PostCommentListSaga);
  })(),
  (function* () {
    yield takeLatest('Post/postCommentRequest', PostCommentSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Post/postCommentReactionRequest',
      PostCommentReactionSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Post/postFavoriteRequest', PostFavoriteSaga);
  })(),
  (function* () {
    yield takeLatest('Post/clearPostSubmitRequest', clearPostSubmitSaga);
  })(),
  (function* () {
    yield takeLatest('Post/deletePostRequest', deletePostSaga);
  })(),
];

export default watchFunction;
