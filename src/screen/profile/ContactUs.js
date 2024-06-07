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
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {useDispatch, useSelector} from 'react-redux';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import {contactUsRequest} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import { navigationRef } from '../../utils/helpers/RootNavigation';

const ContactUs = props => {
  const [subject, setSubject] = useState('');
  const [isSubjectFocus, setIsSubjectFocus] = useState(false);
  const [statement, setStatement] = useState('');
  const [isStatementFocus, setIsStatementFocus] = useState(false);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  function ContactUs() {
    if (subject == '') {
      showErrorAlert('Please type your subject');
      return;
    }
    if (statement == '') {
      showErrorAlert('Please type your statement');
      return;
    } else {
      let obj = {
        subject: subject,
        statement: statement,
      };
      connectionrequest()
        .then(() => {
          dispatch(contactUsRequest(obj));
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
      case 'Auth/contactUsRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/contactUsSuccess':
        status = AuthReducer.status;
        props.navigation?.navigate('Setting');
        break;
      case 'Auth/contactUsFailure':
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
      <Loader visible={AuthReducer.status === 'Auth/contactUsRequest'} />
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
            // width: 0,
          }}>
          <Text style={styles.txt}>Contact Us</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.itemsContainer}>
        <TextInputItem
          toptext={'Subject'}
          placeholder={'Enter Subject'}
          width="100%"
          value={subject}
          onChangeText={val => setSubject(val)}
          onFocus={() => setIsSubjectFocus(true)}
          onBlur={() => setIsSubjectFocus(false)}
          focus={isSubjectFocus}
        />

        <TextInputmultiple
          toptext={'Statement'}
          placeholder={'Enter statement'}
          width="100%"
          value={statement}
          onChangeText={val => setStatement(val)}
          onFocus={() => setIsStatementFocus(true)}
          onBlur={() => setIsStatementFocus(false)}
          focus={isStatementFocus}
        />
        <ButtonCom
          width={'100%'}
          backgroundColor={'#1F2440'}
          marginTop={normalize(20)}
          title={'Submit'}
          onPress={ContactUs}
        />
      </View>
    </View>
  );
};
export default ContactUs;

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
