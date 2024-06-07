import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Icons} from '../../themes/ImagePath';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import constants from '../../utils/helpers/constants';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [dataValue, setDataValue] = useState('');
  const [isFirstLaunch, setIsfirstLunch] = useState(false);
  const isFocus = useIsFocused();
  const AuthReducer = useSelector(state => state?.AuthReducer);
  //  console.log("AuthReducer.getProfileRes.data.isApprove",AuthReducer.getProfileRes);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getProfileRequest());
    }, [isFocus]),
  );

  const getToken = async () => {
    let token = await AsyncStorage.getItem(constants.TOKEN);
    console.log(token,">>>>>>>ree")
    let SignUpResponse = await AsyncStorage.getItem(constants.SignUpResponse);
    let SetupToken = await AsyncStorage.getItem(constants.SetupToken);
    if (
      token !== null &&
      AuthReducer?.getProfileRes?.data?.isApprove === 'Yes'
    ) {
      navigation.replace('TabNavigator');

      return;
    }
    if (AuthReducer?.getProfileRes?.data?.isApprove === 'No') {
      navigation.replace('WaitingForApproval');
      return;
    }
    if (SetupToken !== null) {
      navigation?.navigate('SignupStep2');
      return;
    }
    if (token === null && isFirstLaunch !== true) {
      navigation?.navigate('DrawerNavigation');
      return;
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        getToken();
      }, 1000);
    }, [isFocus, AuthReducer.getProfileRes]), // Include AuthReducer.getProfileRes in dependencies
  );

  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent />
      <ImageBackground
        source={Icons.Splash}
        style={{flex: 1, width: '100%', height: '103%'}}
        resizeMode="cover"
      />
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
