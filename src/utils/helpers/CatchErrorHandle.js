// utils/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';
import {setUnauthorized} from '../../redux/action/userActions';
import showErrorAlert from './Toast';
import { useDispatch } from 'react-redux';
import { clearTokenRequest } from '../../redux/reducer/AuthReducer';


const apiService = axios.create({
  baseURL: constants.BASE_URL,
});
// const dispatch=useDispatch();
// Request interceptor
apiService.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem(constants.TOKEN);
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiService.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // setUnauthorized();
      AsyncStorage.removeItem(constants.TOKEN);
      dispatch(clearTokenRequest())
    } else if (error.response && error.response.status === 502) {
      showErrorAlert('server down');
    }
    return Promise.reject(error);
  },
);

export default apiService;
