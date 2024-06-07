import {StyleSheet, Text, View, TouchableOpacity, Image,Platform} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import ButtonCom from '../../components/ButtonCom';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import { deleteAccountRequest } from '../../redux/reducer/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccount = props => {
  const [password, setPassword] = useState('');
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordFocus, setIsConfirmPasswordFocus] = useState(false);
  const [showhide, setshowhide] = useState(true);
  const [showhide1, setshowhide1] = useState(true);
  const navigation = useNavigation();
  let status = "";

  const dispatch = useDispatch();
  const AuthReducer = useSelector((state) => state.AuthReducer);

  const DeleteAccount = () => {
    if (reasonForChange === "") {
      showErrorAlert("Please mention your reason for account delete");
    } else if (reasonForChange.length < 25) {
      showErrorAlert(
        "Description at least 25 characters are required"
      );
    } else if (password === "") {
      showErrorAlert("please enter your password");
    } else {
      let obj = {
        reasonForDeleteAccount: reasonForChange,
        password: password,
      };
      connectionrequest()
        .then(() => {
          dispatch(deleteAccountRequest(obj));
        })
        .catch((err) => {
          showErrorAlert("Please connect To Internet");
        });
    }
  };
  if (status == "" || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case "Auth/deleteAccountRequest":
        status = AuthReducer.status;
        break;
      case "Auth/deleteAccountSuccess":
        status = AuthReducer.status;
        navigation.navigate("Landing");
        AsyncStorage.setItem("DELETE", JSON.stringify("true"));
        break;
      case "Auth/deleteAccountFailure":
        status = AuthReducer.status;
        break;
    }
  }



  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
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
          <Text style={styles.txt}>Delete Account</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.itemsContainer}>
        <TextInputItem
          toptext={'Reason*'}
          placeholder={'Enter Your reason'}
          value={password}
          onChangeText={val => setPassword(val)}
          isSecure={showhide}
        //   isrightimage={true}
          rightimagepress={() => setshowhide(!showhide)}
        //   showhide={showhide}
          onFocus={() => setIsPasswordFocus(true)}
          onBlur={() => setIsPasswordFocus(false)}
          focus={isPasswordFocus}
        />
        <TextInputItem
          toptext={'Email'}
          placeholder={'Enter Email'}
          value={confirmPassword}
          onChangeText={val => setConfirmPassword(val)}
        //   isSecure={showhide1}
        //   isrightimage={true}
          rightimagepress={() => setshowhide1(!showhide1)}
          showhide={showhide1}
          onFocus={() => setIsConfirmPasswordFocus(true)}
          onBlur={() => setIsConfirmPasswordFocus(false)}
          focus={isConfirmPasswordFocus}
        />
        {/* <Text
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
        </Text> */}
        <ButtonCom
          width={'100%'}
          backgroundColor={'#1F2440'}
          marginTop={normalize(20)}
          title={'Delete Account'}
        />
      </View>
    </View>
  );
};

export default DeleteAccount;

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
