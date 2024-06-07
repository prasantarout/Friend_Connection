import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  TextInput,
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
import DropDownComponent from '../../components/DropDownComponent';
import showErrorAlert from '../../utils/helpers/Toast';
import {groupCreateRequest} from '../../redux/reducer/GroupReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../utils/helpers/Loader';
import { navigationRef } from '../../utils/helpers/RootNavigation';

const CreatedGroupStep2 = props => {
  let privacyItem = [
    {id: 1, title: 'Public'},
    {id: 2, title: 'Private'},
  ];
  const [isPrivacySelectDownOpen, setIsPrivacySelectDropDownOpen] =
    useState(false);
  const [privacySelect, setPrivacySelect] = useState({id: 1, title: 'Public'});

  const dispatch = useDispatch();

  const groupReducer = useSelector(state => state.GroupReducer);

  


  let obj = {
    privacy: privacySelect,
    group_name: props?.route?.params?.data?.groupName,
    group_of_class: props?.route?.params?.groupClassId,
    group_moto: props?.route?.params?.data?.groupMoto,
    user_name: props?.route?.params?.data?.userName,
    groupImage: props?.route?.params?.thumbnail,
  };
  function ValidatePrivacy() {
    if (privacySelect === '') {
      showErrorAlert('Please select privacy setting');
      return;
    } else {
      connectionrequest()
        .then(() => {
          const formData = new FormData();
          formData.append('group_name', props?.route?.params?.data?.groupName);
          formData.append('group_of_class', props?.route?.params?.groupClassId);
          formData.append('group_moto', props?.route?.params?.data?.groupMoto);
          formData.append('user_name', props?.route?.params?.data?.userName);
          formData.append('privacy_setting', privacySelect.title);
          formData.append('thumbnail', props?.route?.params?.thumbnail);
          // return
          dispatch(groupCreateRequest(formData));
        })
        .catch(err => {
          console.log(err);
          showErrorAlert('Please connect To Internet');
          // console.log('66', err);
        });
    }
  }

  useEffect(() => {
    let status = '';
    if (status == '' || groupReducer.status != status) {
      switch (groupReducer.status) {
        case 'Group/groupCreateRequest':
          status = groupReducer.status;
          break;
        case 'Group/groupCreateSuccess':
          status = groupReducer.status;
          props.navigation.replace('CreateGroupSucess', {
            groupId: groupReducer?.groupCreateRes,
          });
          break;
        case 'Group/groupCreateFailure':
          status = groupReducer.status;
          ``;
          break;
      }
    }
  }, [groupReducer?.status]);

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
  // const groupCreateSuccess = () => {
  //   let obj = {
  //     group_name: props?.route?.params?.item?.groupName,
  //     group_of_class: props?.route?.params?.item?.groupOfClass,
  //     user_name: props?.route?.params?.item?.userName,
  //     group_moto: props?.route?.params?.item?.groupMoto,
  //     thumbnail: props?.route?.params?.item?.groupImage,
  //     privacy_setting:privacySelect.title,
  //   };
  //   connectionrequest()
  //     .then(() => {
  //       dispatch(groupCreateRequest(obj));
  //     })
  //     .catch(err => {
  //       showErrorAlert('Please connect To Internet');
  //     });
  // };

  // console.log(privacySelect);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <Loader visible={groupReducer.status === 'Group/groupCreateRequest'} />
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
            style={{
              height: '100%',
              width: '32%',
              backgroundColor: Colors.orange,
            }}
          />
          <View
            style={{height: '100%', width: '32%', backgroundColor: '#D9D9D9'}}
          />
        </View>
        <View style={{marginHorizontal: normalize(15), flex: 1}}>
          <Text
            style={{
              fontSize: normalize(15),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
              marginTop: normalize(15),
            }}>
            Group Privacy
          </Text>

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
            privacyFlagItem={35}
          />

          <View style={{flex: 1}} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(10),
              marginBottom: normalize(10),
            }}>
            <TouchableOpacity
              onPress={() => {
                ValidatePrivacy();
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
                Create
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatedGroupStep2;

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
