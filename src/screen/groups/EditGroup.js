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
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import {
  getGroupDetailsRequest,
  updategroupRequest,
} from '../../redux/reducer/GroupReducer';
import Loader from '../../utils/helpers/Loader';
import {useIsFocused} from '@react-navigation/native';
let status = '';

const EditGroup = props => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const GroupReducer = useSelector(state => state.GroupReducer);

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
  const isFocus = useIsFocused();
  let privacyItem = [
    {id: 1, title: 'Public'},
    {id: 2, title: 'Private'},
  ];
  const [isPrivacySelectDownOpen, setIsPrivacySelectDropDownOpen] =
    useState(false);
  const [privacySelect, setPrivacySelect] = useState({id: 1, title: 'Public'});
  const [thumbnail, setthumbnail] = useState('');
  const [backstatus, setbackstatus] = useState(false);

  const [groupData, setGroupData] = useState({
    groupName: '',
    groupOfClass: IsClass?.title !== '' ? IsClass?.title : '',
    userName: '',
    groupMoto: '',
    // groupOfClassId:IsClass?._id
  });
  console.log(GroupReducer?.getGroupDetails?.data);
  useEffect(() => {
    handleInputChange(
      'groupName',
      GroupReducer?.getGroupDetails?.data?.group_name,
    );
    handleInputChange(
      'userName',
      GroupReducer?.getGroupDetails?.data?.user_name,
    );
    handleInputChange(
      'groupMoto',
      GroupReducer?.getGroupDetails?.data?.group_moto,
    );
    setPrivacySelect(
      GroupReducer?.getGroupDetails?.data?.privacy_setting == 'Private'
        ? privacyItem[1]
        : privacyItem[0],
    );
    setthumbnail(GroupReducer?.getGroupDetails?.data?.thumbnail);
    setIsClass(GroupReducer?.getGroupDetails?.data?.group_of_class);
    handleInputChange(
      'groupOfClass',
      GroupReducer?.getGroupDetails?.data?.group_of_class?.title,
    );
    // handleInputChange('groupName', GroupReducer?.getGroupDetails?.data?.group_moto)

    connectionrequest()
      .then(() => {
        dispatch(classListRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }, []);
  // console.log(IsClass, '>>>>>>>res');

  // console.log(typeof ProfilePicObj, '>>>>>obj');
  function ValidateGroup() {
    if (groupData.groupName == '') {
      showErrorAlert('Group name is required');
      return;
    }
    //  else if (groupData.groupOfClass == '') {
    //     showErrorAlert('Group of class is required');
    //     return;
    //   }
    else if (groupData.userName == '') {
      showErrorAlert('User name is required');
      return;
    } else if (groupData?.groupMoto == '') {
      showErrorAlert('Group Moto is required');
      return;
    } else {
      let data = new FormData();
      data.append('group_name', groupData.groupName);
      data.append('group_of_class', IsClass?._id);
      data.append('user_name', groupData.userName);
      data.append('group_moto', groupData.groupMoto);
      data.append('privacy_setting', privacySelect.title);
      data.append('id', GroupReducer?.getGroupDetails?.data?._id);
      {
        ProfilePicObj != '' && data.append('thumbnail', ProfilePicObj);
      }

      connectionrequest()
        .then(() => {
          dispatch(updategroupRequest(data));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
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

  if (isFocus) {
    if (status == '' || GroupReducer.status != status) {
      switch (GroupReducer.status) {
        case 'Group/updategroupRequest':
          status = GroupReducer.status;
          break;
        case 'Group/updategroupSuccess':
          status = GroupReducer.status;
          setbackstatus(true);
          dispatch(
            getGroupDetailsRequest({
              group_id: GroupReducer?.getGroupDetails?.data?._id,
            }),
          );
          break;
        case 'Group/updategroupFailure':
          status = GroupReducer.status;
          break;

        case 'Group/getGroupDetailsRequest':
          status = GroupReducer.status;
          break;
        case 'Group/getGroupDetailsSuccess':
          status = GroupReducer.status;
          backstatus && props?.navigation?.goBack();
          break;
        case 'Group/getGroupDetailsFailure':
          status = GroupReducer.status;
          break;
      }
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Loader
        visible={
          GroupReducer?.status === 'Group/updategroupRequest' ||
          GroupReducer?.status === 'Group/getGroupDetailsRequest'
        }
      />
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
            <Text style={styles.txt}>Edit Group</Text>
          </View>
          {/* Horizontal line below the title and icon */}
          <View></View>
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
              Edit Group Details
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
              placeholder={'john@gmail.com '}
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

            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Privacy Settings'}
              width="100%"
              value={privacySelect ? privacySelect?.title : 'select privacy'}
              rightimagetintColor={Colors.black}
              onPress={() => {
                setIsPrivacySelectDropDownOpen(!isPrivacySelectDownOpen);
              }}
              onSelectData={res => {
                setIsPrivacySelectDropDownOpen(false);
                setPrivacySelect(res?.item);
              }}
              type="dropdown"
              isOpenDropDown={isPrivacySelectDownOpen}
              drpDownArr={privacyItem}
              isGroupClassSelect={12}
              // privacyFlagItem={35}
              // isGraduationSelect={20}
              // isUserTypeSelect={7}
              isDegreeSelect={6}
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
                  ProfilePicUri !== ''
                    ? {uri: ProfilePicUri}
                    : thumbnail !== '' &&
                        thumbnail !== null &&
                        thumbnail !== undefined
                      ? {uri: constants.IMAGE_URL + 'group/' + thumbnail}
                      : Icons.gallery
                }
                style={{
                  height: normalize(50),
                  width: normalize(50),
                  resizeMode: 'cover',
                  marginRight: normalize(10),
                  borderRadius: normalize(10),
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
                  Change Group Thumbnail
                </Text>
                <Text
                  style={{
                    fontSize: normalize(11),
                    fontFamily: Fonts.OpenSans_Regular,
                    color: Colors.textBlack,
                  }}>
                  Maximumsize 5MB
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
                  Update Group
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

export default EditGroup;

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
