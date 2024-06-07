import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import React, {useEffect, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import CameraPicker from '../../components/CameraPicker';
import showErrorAlert from '../../utils/helpers/Toast';
import DropDownComponent from '../../components/DropDownComponent';
import {classListRequest} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import TextInputmultiple from '../../components/TextInputmultiple';

const CreatedGroup = props => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [email, setEmail] = useState('');
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [phone, setPhone] = useState('');
  const [isPhoneFocus, setIsPhoneFocus] = useState(false);
  const [isGroupOfFocus, setIsGroupOfFocus] = useState(false);
  const [isGroupMotoFocus, setIsGroupMotoFocus] = useState(false);
  const [cameraPicker, setCameraPicker] = useState(false);
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [IsClass, setIsClass] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [isClassDropDownOpen, setIsClassDropDownOpen] = useState(false);
  const dispatch = useDispatch();
  const [groupData, setGroupData] = useState({
    groupName: '',
    groupOfClass: IsClass?.title !== '' ? IsClass?.title : '',
    userName: '',
    groupMoto: '',
    // groupOfClassId:IsClass?._id
  });

  useEffect(() => {
    dispatch(classListRequest());
  }, []);

  // console.log(IsClass, '>>>>>>>res');

  // console.log(typeof ProfilePicObj, '>>>>>obj');
  function ValidateGroup() {
    if (groupData.groupName == '') {
      showErrorAlert('Group name is required');
      return;
    }
    // if (groupData.groupOfClass == '') {
    //   showErrorAlert('Group of class is required');
    //   return;
    // }
    if (groupData.userName == '') {
      showErrorAlert('User name is required');
      return;
    }
    if (groupData?.groupMoto == '') {
      showErrorAlert('Group Moto is required');
      return;
    }
    if (ProfilePicObj == '') {
      showErrorAlert('group thumbnail Pic is required');
    } else {
      props.navigation.navigate('CreatedGroupStep2', {
        data: groupData,
        thumbnail: ProfilePicObj,
        groupClassId: IsClass?._id,
      });
    }
  }

  const handleInputChange = (field, value) => {
    setGroupData(prevState => ({...prevState, [field]: value}));
  };

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false;
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        {/* header */}
        <View style={styles.top}>
          <TouchableOpacity
            style={{
              height: normalize(20),
              width: normalize(20),
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
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              // width: 0,
            }}>
            <Text style={styles.txt}>Create Group</Text>
          </View>
          {/* Horizontal line below the title and icon */}
          <View></View>
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: normalize(3),
            marginTop: normalize(23),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: '100%',
              width: '32%',
              backgroundColor: Colors.orange,
            }}
          />
          <View
            style={{height: '100%', width: '32%', backgroundColor: '#D9D9D9'}}
          />
          <View
            style={{height: '100%', width: '32%', backgroundColor: '#D9D9D9'}}
          />
        </View>
        <View style={{marginHorizontal: normalize(15)}}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
                marginTop: normalize(15),
              }}>
              Create Group Details
            </Text>

            <TextInputItem
              toptext={'Group name'}
              placeholder={'Enter Group name'}
              width="100%"
              value={groupData.groupName}
              onChangeText={val => handleInputChange('groupName', val)}
              onFocus={() => setIsEmailFocus(true)}
              onBlur={() => setIsEmailFocus(false)}
              focus={isEmailFocus}
            />
            {/* <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Group of Class'}
              width={'100%'}
              value={IsClass ? IsClass?.title : 'Select Class'}
              onPress={() => {
                setIsClassDropDownOpen(!isClassDropDownOpen);
              }}
              onSelectData={res => {
                setIsClass(res.item);
                handleInputChange('groupOfClass', res.item?.title);
                setIsClassDropDownOpen(false);
              }}
              type="dropdown"
              isOpenDropDown={isClassDropDownOpen}
              drpDownArr={AuthReducer?.classListRes?.data}
              isGroupClassSelect={12}
            /> */}
            <TextInputItem
              toptext={'Enter User Name'}
              placeholder={'User Name'}
              width="100%"
              value={groupData.userName}
              onChangeText={val => handleInputChange('userName', val)}
              onFocus={() => setIsGroupOfFocus(true)}
              onBlur={() => setIsGroupOfFocus(false)}
              focus={isGroupOfFocus}
            />
            <TextInputItem
              toptext={'Group Moto'}
              placeholder={'Enter Group Moto'}
              width="100%"
              value={groupData.groupMoto}
              onChangeText={val => handleInputChange('groupMoto', val)}
              onFocus={() => setIsGroupMotoFocus(true)}
              onBlur={() => setIsGroupMotoFocus(false)}
              focus={isGroupMotoFocus}
              multiline={true}
            />

            <TouchableOpacity
              style={{
                width: '100%',
                height: normalize(85),
                marginTop: normalize(15),
                borderRadius: normalize(10),
                borderColor: Colors.borderColor,
                borderWidth: normalize(1),
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: normalize(15),
              }}
              onPress={() => setCameraPicker(true)}>
              <Image
                source={
                  ProfilePicUri !== '' ? {uri: ProfilePicUri} : Icons.gallery
                }
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  resizeMode: 'cover',
                  marginRight: normalize(10),
                }}
              />

              <View style={{}}>
                <Text
                  style={{
                    fontSize: normalize(13),
                    fontFamily: Fonts.OpenSans_Regular,
                    color: Colors.textBlack,
                    fontWeight: '500',
                  }}>
                  Upload Group Thumbnail
                </Text>
                <Text
                  style={{
                    fontSize: normalize(11),
                    fontFamily: Fonts.OpenSans_Regular,
                    color: Colors.textBlack,
                  }}>
                  Maximum size 5MB
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: normalize(10),
                marginBottom: normalize(80),
              }}>
              <TouchableOpacity
                onPress={() => {
                  ValidateGroup();
                }}
                activeOpacity={0.1}
                style={{
                  width: '80%',
                  height: normalize(45),
                  marginTop: normalize(10),
                  marginBottom: normalize(10),
                  backgroundColor: Colors.orange,
                  borderRadius: normalize(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(16),
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  props.navigation.goBack();
                }}
                activeOpacity={0.1}
                style={{
                  width: normalize(45),
                  height: normalize(45),
                  alignSelf: 'center',
                  marginLeft: normalize(10),
                  borderRadius: normalize(10),
                  backgroundColor: 'rgba(31, 36, 64, 1)',
                  justifyContent: 'center',
                  borderColor: Colors.background,
                  borderWidth: 2,
                  alignItems: 'center',
                }}>
                <Image
                  source={Icons.cross}
                  style={{width: normalize(15), height: normalize(15)}}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <CameraPicker
          pickerVisible={cameraPicker}
          multiple={false}
          onBackdropPress={() => setCameraPicker(false)}
          btnClick_cameraUpload={imgObj => {
            setProfilePicObj(imgObj);
            setProfilePicUri(imgObj.uri);
            setCameraPicker(false);
            // UploadProfile(imgObj);
          }}
          btnClick_galeryUpload={imgObj => {
            setProfilePicObj(imgObj);
            setProfilePicUri(imgObj.uri);
            setCameraPicker(false);
            // UploadProfile(imgObj);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatedGroup;

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
});
