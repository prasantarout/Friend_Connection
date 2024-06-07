import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import AuthReducer from './reducer/AuthReducer';
import HomeReducer from './reducer/HomeReducer';
import PostReducer from './reducer/PostReducer';
import {logger} from 'redux-logger';
import RootSaga from './ReduxSaga/RootSaga';
import FriendReducer from './reducer/FriendReducer';
import EventReducer from './reducer/EventReducer';
import MatchReducer from './reducer/MatchReducer';
import GroupReducer from './reducer/GroupReducer';
import PollReducer from './reducer/PollReducer';
import MessagingReducer from './reducer/MessagingReducer';
import userReducer from './reducer/userReducer';
import AuthorizedReducer from './reducer/AuthorizedReducer';
let sagaMiddleware = createSagaMiddleware();
// const middleware = [sagaMiddleware, logger];
const middleware = [sagaMiddleware];
// logger
export default configureStore({
  reducer: {
    AuthReducer,
    HomeReducer,
    PostReducer,
    FriendReducer,
    EventReducer,
    MatchReducer,
    GroupReducer,
    PollReducer,
    MessagingReducer,
    user:userReducer,
  },
  middleware,
});

sagaMiddleware.run(RootSaga);
