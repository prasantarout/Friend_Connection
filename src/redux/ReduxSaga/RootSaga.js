import {all} from 'redux-saga/effects';
import AuthSaga from './AuthSaga';
import HomeSaga from './HomeSaga';
import PostSaga from './PostSaga';
import FriendSaga from './FriendSaga';
import EventSaga from './EventSaga';
import Matchsaga from './MatchSaga';
import GroupSaga from './GroupSaga';
import PollSaga from './PollSaga';
import MessagingSaga from './MessagingSaga';

const combinedSaga = [
  ...AuthSaga,
  ...HomeSaga,
  ...PostSaga,
  ...FriendSaga,
  ...EventSaga,
  ...Matchsaga,
  ...GroupSaga,
  ...PollSaga,
  ...MessagingSaga,
];

export default function* RootSaga() {
  yield all(combinedSaga);
}
