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
import connectionrequest from '../../utils/helpers/NetInfo';
import {forgotpasswordRequest} from '../../redux/reducer/AuthReducer';
import showErrorAlert from '../../utils/helpers/Toast';
export default function ForgetPassword(props) {
  const [email, setemail] = useState('');
  const [showhide, setshowhide] = useState(true);
  const [password, setpassword] = useState('');
  const [rememberbtn, setrememberbtn] = useState(false);
  const [phone, setphone] = useState('');
  const [username, setusername] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [showhide1, setshowhide1] = useState(true);
  const [confirmpasswordfocus, setconfirmpasswordfocus] = useState(false);
  const height1 = Dimensions.get('window').height;
  const [usernamefocus, setusernamefocus] = useState(false);
  const [passwordfocus, setpasswordfocus] = useState(false);
  let headerType = 'icon';

  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    function resetpassword() {
    if (email == '') {
      showErrorAlert('Please enter your email');
    } else if (!regex.test(email)) {
      showErrorAlert('Please enter correct email');
    } else {
      let obj = {
        email: email.toLowerCase(),
      };
      connectionrequest()
        .then(() => {
          //console.log(obj);
          dispatch(forgotpasswordRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
    // props.navigation.navigate('ForgetPasswordOtp')
  }

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/forgotpasswordRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/forgotpasswordSuccess':
        status = AuthReducer.status;
        props.navigation?.navigate('ForgotPasswordOtpVerify',{email:email});
        break;
      case 'Auth/forgotpasswordFailure':
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
      <Loader visible={AuthReducer.status === 'Auth/forgotpasswordRequest'} />
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
            <Text style={styles.pageSubtitle}>
              Enter email address to get OTP
            </Text>
            <TextInputItem
              toptext={'Email Address*'}
              placeholder={'Enter Email Address'}
              width="100%"
              value={email}
              onChangeText={val => setemail(val)}
              onFocus={() => setusernamefocus(true)}
              onBlur={() => setusernamefocus(false)}
              focus={usernamefocus}
            />
            <ButtonCom
              onPress={() =>resetpassword()}
              width={'100%'}
              backgroundColor={'#1F2440'}
              marginTop={normalize(20)}
              marginBottom={normalize(13)}
              title={'Continue'}
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
