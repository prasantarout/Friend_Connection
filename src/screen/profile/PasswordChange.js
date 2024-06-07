import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import ButtonCom from '../../components/ButtonCom';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import {craetenewpasswordRequest} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../utils/helpers/Loader';
import { navigationRef } from '../../utils/helpers/RootNavigation';

const PasswordChange = props => {
  const [password, setPassword] = useState('');
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordFocus, setIsConfirmPasswordFocus] = useState(false);
  const [showhide, setshowhide] = useState(true);
  const [showhide1, setshowhide1] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  function changePasword() {
    if (password == '') {
      showErrorAlert('Please enter your current password');
    } else if (password.length < 8) {
      showErrorAlert('not a valid password,current password have 8 characters');
    } else if (confirmPassword == '') {
      showErrorAlert('Please enter new password');
    } else if (confirmPassword.length < 8) {
      showErrorAlert('Please enter atleast 8 character new password');
    } else {
      let obj = {
        old_password: password,
        password: confirmPassword,
      };
      connectionrequest()
        .then(() => {
          dispatch(craetenewpasswordRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
          // console.log('66',err)
        });
    }
  }
  let status = '';
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/craetenewpasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/craetenewpasswordSuccess':
        status = AuthReducer.status;
        props.navigation?.navigate('Setting');
        break;
      case 'Auth/craetenewpasswordFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader
        visible={AuthReducer.status === 'Auth/craetenewpasswordRequest'}
      />
      <View style={styles.top}>
        <TouchableOpacity
          style={{
            height: normalize(40),
            width: normalize(40),
            backgroundColor: 'rgba(242,124,36,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={() => props?.navigation?.goBack('')}>
          <Image
            source={Icons.less}
            style={{
              height: normalize(15),
              width: normalize(15),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            // width:100,
          }}>
          <Text style={styles.txt}>Change Password</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.itemsContainer}>
        {/* <TextInputItem
          toptext={'Old Password*'}
          placeholder={'**********'}
          value={oldPassword}
          onChangeText={val => setOldPassword(val)}
          isSecure={showhide}
          isrightimage={true}
          rightimagepress={() => setshowhide(!showhide)}
          showhide={showhide}
          onFocus={() => setIsPasswordFocus(true)}
          onBlur={() => setIsPasswordFocus(false)}
          focus={isPasswordFocus}
        /> */}
        <TextInputItem
          toptext={'Current Password*'}
          placeholder={'**********'}
          value={password}
          onChangeText={val => setPassword(val)}
          isSecure={showhide}
          isrightimage={true}
          rightimagepress={() => setshowhide(!showhide)}
          showhide={showhide}
          onFocus={() => setIsPasswordFocus(true)}
          onBlur={() => setIsPasswordFocus(false)}
          focus={isPasswordFocus}
        />
        <TextInputItem
          toptext={'New Password*'}
          placeholder={'**********'}
          value={confirmPassword}
          onChangeText={val => setConfirmPassword(val)}
          isSecure={showhide1}
          isrightimage={true}
          rightimagepress={() => setshowhide1(!showhide1)}
          showhide={showhide1}
          onFocus={() => setIsConfirmPasswordFocus(true)}
          onBlur={() => setIsConfirmPasswordFocus(false)}
          focus={isConfirmPasswordFocus}
        />
        <Text
          onPress={() => {
            props.navigation?.navigate('ForgetPassword');
          }}
          style={{
            fontSize: normalize(12),
            fontFamily: Fonts.OpenSans_Regular,
            color: Colors.textBlack,
            textAlign: 'left',
            marginTop: normalize(12),
            marginBottom: normalize(0),
            marginLeft: normalize(5),
          }}>
          Forgot Password?
        </Text>
        <ButtonCom
          width={'100%'}
          backgroundColor={'#1F2440'}
          marginTop={normalize(20)}
          title={'Change Password'}
          onPress={changePasword}
        />
      </View>
    </View>
  );
};

export default PasswordChange;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform?.OS == 'android' ? normalize(35) : 20,
    marginHorizontal: normalize(20),
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
    marginBottom: normalize(15),
  },
  itemIcon: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(10),
  },
  itemName: {
    fontSize: 16,
    color: '#1F2440',
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Regular,
  },
  rightIcon: {
    width: normalize(15),
    height: normalize(15),
    marginLeft: 'auto', // Push the right icon to the right
  },
  rightIconContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
    position: 'absolute',
    right: 0,
    // Set the background color here
    borderRadius: 5, // Adjust as needed
    padding: 5, // Adjust as needed
  },
});
