import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import constants from '../../utils/helpers/constants';
import navigate from '../../utils/helpers/RootNavigation';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteApi, getApi, postApi} from '../../utils/helpers/ApiRequest';
import { authorization } from '../../utils/helpers/CatchErrorHandle';
import {
  EventCompletedFailure,
  EventCompletedSuccess,
  EventDetailsFailure,
  EventDetailsSuccess,
  EventEnrolmentFailure,
  EventEnrolmentSuccess,
  EventListFailure,
  EventListSuccess,
  EventUpcomingFailure,
  EventUpcomingSuccess,
  RelatedEventFailure,
  RelatedEventSuccess,
  sendRequestFailure,
  sendRequestSuccess,
} from '../reducer/EventReducer';

let token = '';

//friendRequest
export function* EventListSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(postApi, 'event/list', action?.payload, header);
    if (response?.status == 200) {
      yield put(EventListSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(EventListFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(EventListFailure(error));
    showErrorAlert(error?.response?.data?.message);

  }
}

export function* EventUpcomingSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/upcoming',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(EventUpcomingSuccess(response?.data));

      //   showErrorAlert(response.data.message);
    } else {
      yield put(EventUpcomingFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(EventUpcomingFailure(error));
    showErrorAlert(error?.response?.data?.message);
 
  }
}

export function* sendNotificationSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/invite',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(sendRequestSuccess(response?.data));
        showErrorAlert(response.data.message);
    } else {
      yield put(sendRequestFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(sendRequestFailure(error));
    console.log(error,">>>>>>Ree")
    showErrorAlert(error?.response?.data?.message);
 
  }
}

export function* EventCompletedSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/completed',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(EventCompletedSuccess(response?.data));

      //   showErrorAlert(response.data.message);
    } else {
      yield put(EventCompletedFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(EventCompletedFailure(error));
    showErrorAlert(error?.response?.data?.message);

  }
}

export function* EventDetailsSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/details',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(EventDetailsSuccess(response?.data));

      //   showErrorAlert(response.data.message);
    } else {
      yield put(EventDetailsFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(EventDetailsFailure(error));
    showErrorAlert(error?.response?.data?.message);

  }
}

export function* EvenEnrolmentSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/enrolment',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(EventEnrolmentSuccess(response?.data));

      showErrorAlert(response.data.message);
    } else {
      yield put(EventEnrolmentFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(EventEnrolmentFailure(error));
    showErrorAlert(error?.response?.data?.message);

  }
}

export function* EventRelatedSaga(action) {
  const getToken = yield call(AsyncStorage.getItem, constants?.TOKEN);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: getToken,
  };
  try {
    let response = yield call(
      postApi,
      'event/related/list',
      action?.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(RelatedEventSuccess(response?.data));

      // showErrorAlert(response.data.message);
    } else {
      yield put(RelatedEventFailure(response?.data));
      showErrorAlert(response?.data?.message);
      authorization(response)
    }
  } catch (error) {
    yield put(RelatedEventFailure(error));
    showErrorAlert(error?.response?.data?.message);
   
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Event/EventListRequest', EventListSaga);
  })(),
  (function* () {
    yield takeLatest('Event/EventUpcomingRequest', EventUpcomingSaga);
  })(),
  (function* () {
    yield takeLatest('Event/EventCompletedRequest', EventCompletedSaga);
  })(),
  (function* () {
    yield takeLatest('Event/EventDetailsRequest', EventDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Event/EventEnrolmentRequest', EvenEnrolmentSaga);
  })(),
  (function* () {
    yield takeLatest('Event/RelatedEventRequest', EventRelatedSaga);
  })(),
  (function* () {
    yield takeLatest('Event/sendRequestRequest', sendNotificationSaga);
  })(),
];

export default watchFunction;
