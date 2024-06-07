// reducers/authReducer.js
import {SET_UNAUTHORIZED_INFO} from '../action/Types';

const initialState = {
  isAuthenticated: true,
};

const AuthorizedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UNAUTHORIZED_INFO:
      return {
        ...state,
        isAuthenticated: false,
      };
    // Add other cases as needed

    default:
      return state;
  }
};

export default AuthorizedReducer;
