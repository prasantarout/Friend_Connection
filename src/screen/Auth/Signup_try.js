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
  TextInput,
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
export default function SignUp(props) {
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

  return (
    <CustomBackGroundComp headerType={'text'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, backgroundColor: 'red'}}>
        <TextInput placeholder="sdm,jf kashfdhkj" />
        {[0, 1, 2, 3, 4, 5].map((item, index) => {
          return (
            <TouchableOpacity
            //  onPress={()=>props?.navigation?.navigate('TabNavigator')}
            >
              <View
                style={{
                  height: normalize(154),
                  width: '100%',
                  backgroundColor: index % 2 == 0 ? 'yellow' : 'blue',
                }}>
                <TextInput
                  placeholder="sdm,jf kashfdhkj"
                  style={{backgroundColor: 'pink', height: 60, width: '100%'}}
                />
              </View>
            </TouchableOpacity>
          );
        })}
        <View
          style={{
            height: normalize(154),
            width: '100%',
            backgroundColor: 'teal',
            marginBottom: 200,
          }}>
          <TextInput
            placeholder="sdm,jf kashfdhkj"
            style={{backgroundColor: 'gray', height: 60, width: '100%'}}
          />
        </View>
      </KeyboardAvoidingView>
    </CustomBackGroundComp>
  );
}

const styles = StyleSheet.create({
  headerimage: {
    width: normalize(60),
    height: normalize(70),
    resizeMode: 'stretch',
    position: 'absolute',
    right: normalize(-5),
    top: 0,
  },
  head1sttext: {
    fontSize: normalize(18),
    fontFamily: Fonts.Nunito_Medium,
    color: Colors.black,
    marginTop: normalize(35),
  },
  head2ndtext: {
    color: Colors.textcolor,
    fontFamily: Fonts.Nunito_Regular,
    fontSize: normalize(12),
    width: '80%',
    textAlign: 'center',
    marginTop: normalize(10),
  },
  txtdonthaveaccount: {
    fontSize: normalize(13),
    fontFamily: Fonts.Nunito_Regular,
    color: Colors.textblackcolor,
    fontWeight: '600',
  },
});
