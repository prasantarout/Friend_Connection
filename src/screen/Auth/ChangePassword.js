import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import TextInputItem from '../../components/TextInput';
import {Colors} from '../../themes/Colors';

let status = '';
import Loader from '../../utils/helpers/Loader';
import BtnGroup from '../../components/BtnGroup';
import CustomBackGroundComp from '../../components/CustomBackGroundComp';
import {globalConstant} from '../../utils/helpers/GlobalConstant';
import ButtonCom from '../../components/ButtonCom';
import {useDispatch, useSelector} from 'react-redux';
import {craetenewpasswordRequest, resetPasswordRequest} from '../../redux/reducer/AuthReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
export default function ChangePassword(props) { 
  const [password, setPassword] = useState('');
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordFocus, setIsConfirmPasswordFocus] = useState(false);
  const [showhide, setshowhide] = useState(true);
  const [showhide1, setshowhide1] = useState(true);
  const [email, setemail] = useState('');
  const [newpassword, setnewpassword] = useState('');
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  function changePasword() {
    if (password == '') {
      showErrorAlert('Please enter your new password');
    } else if (password.length < 8) {
      showErrorAlert('Please enter atleast 8 character new password');
    } else if (confirmPassword == '') {
      showErrorAlert('Please enter confirm password');
    } else if (password != confirmPassword) {
      showErrorAlert('New password and confirm password does not match');
    } else {
      let obj = {
        email: props?.route?.params?.email,
        password: confirmPassword,
      }; 
      // return
      connectionrequest()
        .then(() => {
          dispatch(resetPasswordRequest(obj));
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
      case 'Auth/resetPasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/resetPasswordSuccess':
        status = AuthReducer.status;
        props.navigation?.navigate('ChangePasswordSucess');
        break;
      case 'Auth/resetPasswordFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.backgroundorange,
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Loader
        visible={AuthReducer.status === 'Auth/resetPasswordRequest'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: normalize(20)}}>
          <View
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height * 0.33,
              borderBottomLeftRadius: normalize(15),
              borderBottomRightRadius: normalize(15),
              overflow: 'hidden',
              // position: 'absolute',
            }}>
            <ImageBackground
              source={Icons.tiger1}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}>
              <View
                style={{
                  height: Platform.OS == 'ios' ? normalize(25) : normalize(15),
                }}
              />
              {/* header */}
              <View
                style={{
                  marginTop: '8%',
                  flexDirection: 'row',
                  marginHorizontal: globalConstant.marginHorizontal,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                  style={{
                    height: normalize(32),
                    width: normalize(32),
                    backgroundColor: 'rgba(176,176,176,0.55)',
                    borderRadius: normalize(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Icons.rightBack}
                    style={{height: '40%', width: '40%', resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '70%',
                      height: normalize(80),
                    }}>
                    <Image
                      source={Icons.tiger}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              marginHorizontal: normalize(12),
              paddingHorizontal: normalize(12),
              paddingTop: normalize(42),
              paddingBottom: normalize(20),
              marginTop: normalize(-50),
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: Colors.white,
            }}>
            <Text style={styles.pageTitle}>
              Forgot <Text style={{color: Colors.orange}}>Password</Text>
            </Text>
            <Text style={styles.pageSubtitle}>Create new password.</Text>
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
              toptext={'New Password*'}
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
              toptext={'Confirm Password*'}
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

            <ButtonCom
              onPress={() => changePasword()}
              width={'100%'}
              backgroundColor={'#1F2440'}
              marginTop={normalize(20)}
              title={'Change Password'}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: normalize(18),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.textBlack,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(12),
    marginBottom: normalize(10),
  },
  bottomBelowText: {
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(10),
  },
  graycontainer: {
    padding: normalize(13),
    backgroundColor: 'rgba(31,36,64,0.1)',
    borderRadius: normalize(15),
  },
  graycontainerText: {
    fontSize: normalize(11),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(10),
    lineHeight: normalize(18),
  },
  orangeTextWithUnderline: {
    color: Colors.orange,
    textDecorationColor: Colors.orange,
    textDecorationLine: 'underline',
  },
  italicText: {
    fontSize: normalize(11),
    fontFamily: Fonts.OpenSans_MediumItalic,
    color: Colors.textBlack,
    textAlign: 'center',
    marginVertical: normalize(10),
    lineHeight: normalize(18),
    paddingHorizontal: normalize(10),
  },
});
