import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  clearChangePasswordRequest,
  clearContactUsRequest,
  clearProfileRequest,
  clearUpdateProfileRequest,
  deleteAccountRequest,
  logoutRequest,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import TextInputmultiple from '../../components/TextInputmultiple';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import {setUnauthorized} from '../../redux/action/userActions';
import {clearAllFeedListRequest} from '../../redux/reducer/HomeReducer';

const Setting = props => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const AuthReducer = useSelector(state => state.AuthReducer);

  let item = [
    {
      id: 1,
      name: 'Contact Us',
      icon: Icons.call,
      rightIcon: Icons.rightIcon,
      //   onPress:props?.navigation?.navigate('ContactUs'),
    },
    {
      id: 2,
      name: 'Change Password',
      icon: Icons.password,
      rightIcon: Icons.rightIcon,
      //   onPress:props?.navigation?.navigate('ContactUs'),
    },
    {
      id: 3,
      name: 'Update Profile',
      icon: Icons.profile,
      rightIcon: Icons.rightIcon,
      //   onPress:props?.navigation?.navigate('ContactUs'),
    },
    {
      id: 4,
      name: 'Delete Account',
      icon: Icons.delete,
      rightIcon: Icons.rightIcon,
    },
    {
      id: 5,
      name: 'Logout',
      icon: Icons.logout,
      rightIcon: Icons.rightIcon,
    },
  ];

  function onPressUpdate(item) {
    props?.navigation.navigate('UpdateProfile');
    dispatch(clearUpdateProfileRequest({}));
  }

  const createTwoButtonAlert = () =>
    Alert.alert('Logout!', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          // dispatch(setUnauthorized())
          dispatch(clearUpdateProfileRequest({}));
          dispatch(clearAllFeedListRequest({}));
          dispatch(clearProfileRequest({}));
          dispatch(logoutRequest());
        },
      },
    ]);

  useEffect(() => {
    let status = '';
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/logoutRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/logoutSuccess':
          status = AuthReducer.status;
          AsyncStorage.removeItem(constants.TOKEN);
          AsyncStorage.removeItem(constants.SignUpResponse);
          props?.navigation.navigate('SignIn');
          break;
        case 'Auth/logoutFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  function onPress(item) {
    props?.navigation.navigate('PasswordChange');
    dispatch(clearChangePasswordRequest({}));
  }
  function onPressContact(item) {
    props?.navigation.navigate('ContactUs');
    dispatch(clearContactUsRequest({}));
  }

  function onPressDelete() {
    setDeleteModal(true);
  }

  function deleteAccount() {
    if (reason.trim().length === 0) {
      setReasonError('Please enter a reason!');
      return;
    }
    dispatch(
      deleteAccountRequest({
        id: AuthReducer.getProfileRes?.data?._id,
        delete_reason: reason,
      }),
    );
  }

  useEffect(() => {
    let status = '';
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/deleteAccountRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/deleteAccountSuccess':
          status = AuthReducer.status;
          props.navigation.replace('SignIn');
          break;
        case 'Auth/deleteAccountFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  const RenderDeleteAccountModal = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={deleteModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setDeleteModal(false);
        }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderTopRightRadius: normalize(20),
              borderTopLeftRadius: normalize(20),
              paddingVertical: normalize(10),
              paddingHorizontal: normalize(10),
              // alignItems: 'center',
              // height: '50%',
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <Loader
              visible={AuthReducer?.status === 'Auth/deleteAccountRequest'}
            />
            <View
              style={{
                alignItems: 'flex-start',
                height: '100%',
                marginBottom: normalize(20),
              }}>
              {/* <View style={styles.deleteContainer}>
              <ImageBackground
                source={Icons.ellipse}
                style={styles.iconBackground}
              />
            </View> */}
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: normalize(15),
                  fontSize: normalize(22),
                  marginVertical: normalize(10),
                  fontWeight: '500',
                }}>
                Delete Account
              </Text>
              <Text
                style={{
                  marginLeft: normalize(15),
                  fontSize: normalize(14),
                }}>
                Are you sure you want to delete your account? This will
                permanently remove your account from TigerConnect
              </Text>
              <TextInputmultiple
                toptext="Reason"
                placeholder={'Please specify a reason...'}
                width="100%"
                value={reason}
                onChangeText={val => {
                  setReason(val);
                  setReasonError('');
                }}
                // onFocus={() => setIsReasonFocus(true)}
                // onBlur={() => setIsReasonFocus(false)}
                // focus={isReasonFocus}
              />
              <Text
                style={{
                  fontSize: normalize(12),
                  color: Colors.red,
                  paddingLeft: normalize(5),
                  marginTop: normalize(5),
                }}>
                {reasonError}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 'auto',
                marginBottom: normalize(20),
                // alignItems:'center',
                // marginHorizontal: normalize(20),
                width: '80%',
                // marginRight: 20,
              }}>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={deleteAccount}>
                <Text
                  style={{
                    fontSize: normalize(18),
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  Delete Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.floatingButton1}
                onPress={() => setDeleteModal(false)}>
                <Image
                  source={Icons.cross}
                  style={{width: normalize(15), height: normalize(15)}}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Loader visible={AuthReducer?.status === 'Auth/logoutRequest'} />
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={styles.top}>
        <TouchableOpacity
          style={{
            paddingRight: normalize(7),
            paddingVertical: normalize(6),
            paddingLeft: normalize(5),
            backgroundColor: 'rgba(242,124,36,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={() => props?.navigation?.goBack('')}>
          <Image
            source={Icons.less}
            style={{
              height: normalize(10),
              width: normalize(10),
              resizeMode: 'contain',
              // marginRight: 'auto',
              // marginLeft: normalize(-5),
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            width: 80,
          }}>
          <Text style={styles.txt}>Settings</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.itemsContainer}>
        {item.map(menuItem => (
          <View style={styles.item} key={menuItem.id}>
            <Image source={menuItem.icon} style={styles.itemIcon} />
            <Text style={styles.itemName}>{menuItem.name}</Text>
            {/* Wrap the rightIcon in a View for background color */}
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={() => {
                if (menuItem?.id === 1) {
                  onPressContact();
                } else if (menuItem?.id === 2) {
                  onPress();
                } else if (menuItem?.id === 3) {
                  onPressUpdate();
                } else if (menuItem?.id === 4) {
                  onPressDelete();
                } else if (menuItem?.id === 5) {
                  createTwoButtonAlert();
                }
              }}>
              <Image
                source={menuItem.rightIcon}
                style={styles.rightIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {RenderDeleteAccountModal()}
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: normalize(10),
    paddingHorizontal: normalize(20),
  },
  txt: {
    textAlign: 'center',
    color: '#1F2440',
    // marginTop: normalize(10),
    fontSize: 16,
    fontFamily: Fonts.OpenSans_Medium,
    fontWeight: '600',
    lineHeight: 21.79,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F3F3', // You can change the color to your preference
    width: '100%', // Make the line cover the whole width
    marginTop: normalize(10), // Adjust the margin based on your design
  },
  itemsContainer: {
    marginHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(25),
  },
  itemIcon: {
    width: normalize(18),
    height: normalize(18),
    marginRight: normalize(12),
  },
  itemName: {
    fontSize: 16,
    color: '#1F2440',
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Regular,
  },
  rightIcon: {
    width: normalize(10),
    height: normalize(10),
    marginLeft: 'auto', // Push the right icon to the right
  },
  rightIconContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
    position: 'absolute',
    right: 0,
    // Set the background color here
    borderRadius: 10, // Adjust as needed
    paddingRight: normalize(5),
    paddingTop: normalize(6),
    paddingBottom: normalize(7),
    paddingLeft: normalize(7), // Adjust as needed
  },
  deleteContainer: {
    alignItems: 'center',
  },
  iconBackground: {
    height: normalize(65),
    width: normalize(65),
  },
  floatingButton: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 120 : 120,
    // left:normalize(10),
    // paddingHorizontal:normalize(110),
    width: '100%',
    backgroundColor: '#F27C24',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton1: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 122 : 120,

    right: -10,
    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },
});
