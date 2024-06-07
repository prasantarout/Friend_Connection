import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList,
  ImageBackground,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import {Fonts} from '../../themes/ImagePath';
import TextInputmultiple from '../../components/TextInputmultiple';
import DropDownComponent from '../../components/DropDownComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import connectionrequest from '../../utils/helpers/NetInfo';
import PostReducer, {postSubmitRequest} from '../../redux/reducer/PostReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import CustomChip from '../../components/CustomChip';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import VideoThumbnails from '../../components/VideoThumbnails';

const CreateVideoPostStep1 = props => {
  let selectedImg = props?.route?.params.imageUrl;
  let groupId = props?.route?.params.groupId;
  let imageUrl = props?.route?.params?.selectedImg;
  let type = props?.route?.params?.type;

  console.log(imageUrl, '>>>>>>>RESDSADSP');
  // console.log(selectedImg, '>>>>>>itemValue');
  const [reason, setReason] = useState('');
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const [expertise, setExpertise] = useState([]);
  const postReducer = useSelector(state => state.PostReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  // console.log(AuthReducer?.getProfileRes?.data, '>>>>>>>response');
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const MediaPostItem = () => {
    if (reason == '') {
      showErrorAlert('Please write descriptions');
      return;
    }
    if (expertise.length === 0) {
      showErrorAlert('Please write your tags');
      return;
    } else {
      let obj = new FormData();
      obj.append('tags', expertise);
      obj.append('description', reason);
      obj.append('is_group_post', true);
      obj.append('group_id', groupId?._id);
      obj.append(
        'media_url',
        imageUrl?.length > 0
          ? imageUrl[0]
          : {
              uri: imageUrl !== undefined ? imageUrl?.path : selectedImg?.uri,
              type:
                imageUrl !== undefined
                  ? imageUrl?.mime
                  : selectedImg?.type !== undefined
                    ? selectedImg?.type
                    : `image/${selectedImg.extension}`,
              name:
                imageUrl !== undefined
                  ? imageUrl?.path?.replace(/^.*[\\\/]/, '')
                  : selectedImg?.name !== undefined
                    ? selectedImg?.name
                    : selectedImg?.name === undefined
                      ? 'demo'
                      : selectedImg?.filename?.split('.')[0],
            },
      );
      // console.log(obj, 'Dsadasdhjdjhd');
      // return;

      connectionrequest()
        .then(() => {
          dispatch(postSubmitRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
          // console.log('66', err);
        });
    }
  };
  useEffect(() => {
    let status = '';
    if (status == '' || postReducer.status != status) {
      switch (postReducer.status) {
        case 'Post/postSubmitRequest':
          status = postReducer.status;
          break;
        case 'Post/postSubmitSuccess':
          status = postReducer.status;
          props?.navigation?.navigate('PostedSuccess', {
            id: groupId?._id,
            type: type,
          });
          break;
        case 'Post/postSubmitFailure':
          status = postReducer.status;
          break;
      }
    }
  }, [postReducer?.status]);

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

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
      <Loader visible={postReducer?.status === 'Post/postSubmitRequest'} />
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
            <Text style={styles.txt}>Create Post</Text>
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
              width: '48%',
              backgroundColor: Colors.orange,
            }}
          />
          <View
            style={{
              height: '100%',
              width: '48%',
              backgroundColor: Colors.orange,
            }}
          />
          {/* <View
          style={{height: '100%', width: '32%', backgroundColor: '#D9D9D9'}}
        /> */}
        </View>
        <View style={{marginHorizontal: normalize(18), paddingTop: 10}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '70%'}}>
            <View style={{marginTop: normalize(10)}}>
              <View>
                {imageUrl && imageUrl?.[0]?.type === 'video/mp4' && (
                  <VideoThumbnails
                    uriItem={imageUrl[0]?.uri}
                    style={{
                      height: normalize(160),
                      width: '100%',
                      borderRadius: normalize(10),
                      overflow: 'hidden',
                      marginTop: 10,
                      borderWidth: 1,
                    }}
                    resizeMode="cover"
                    flagItem={15}
                  />
                )}

                {selectedImg !== undefined && (
                  <ImageBackground
                    source={{uri: selectedImg?.uri}}
                    style={{
                      height: normalize(280),
                      width: '100%',
                      borderRadius: normalize(10),
                      overflow: 'hidden',
                    }}
                    resizeMode="stretch"
                  />
                )}

                {imageUrl?.[0]?.type !== 'video/mp4' &&
                  imageUrl !== undefined && (
                    <ImageBackground
                      source={{uri: imageUrl?.path}}
                      style={{
                        height: normalize(280),
                        width: '100%',
                        borderRadius: normalize(10),
                        overflow: 'hidden',
                      }}
                      resizeMode="stretch"
                    />
                  )}
                {imageUrl?.[0]?.type !== 'video/mp4' && (
                  <View style={styles.contentContainer}>
                    <Image
                      source={
                        AuthReducer?.getProfileRes?.data?.profile_image !==
                          '' &&
                        AuthReducer?.getProfileRes?.data?.profile_image !==
                          null &&
                        AuthReducer?.getProfileRes?.data?.profile_image !==
                          undefined
                          ? {
                              uri:
                                constants?.IMAGE_URL +
                                'user/' +
                                AuthReducer?.getProfileRes?.data?.profile_image,
                            }
                          : Icons?.userProfile
                      }
                      style={styles.iconImage}
                    />
                    <View>
                      <Text
                        style={[
                          styles.text,
                          {fontWeight: '600', fontSize: normalize(12)},
                        ]}>
                        {AuthReducer?.getProfileRes?.data?.full_name}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: normalize(12),
                }}>
                <View>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: normalize(14),
                      lineHeight: normalize(19.9),
                      fontFamily: Fonts.OpenSans_Medium,
                      color: '#1F2440',
                    }}>
                    Posts
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={[styles.arrowIcon, {right: 2, color: '#1F2440'}]}
                    source={Icons.globe}
                    tintColor={'#5F6374'}
                  />

                  <Text
                    style={{
                      fontSize: normalize(13),
                      fontWeight: '600',
                      fontFamily: Fonts.OpenSans_Medium,
                      color: Colors.textlightgrey,
                    }}>
                    Public
                  </Text>
                  {/* <Image
                    style={styles.arrowIcon}
                    source={Icons.downArr}
                    tintColor={'#5F6374'}
                  /> */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F4F3F3',
                  marginTop: normalize(20),
                  width: '100%',
                }}
              />
              <View style={{marginTop: normalize(10)}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <TextInputmultiple
                    toptext={'Description'}
                    placeholder={'University Group 2022'}
                    placeholderTextColor={'#383A46'}
                    width="100%"
                    value={reason}
                    onChangeText={val => setReason(val)}
                    onFocus={() => setIsReasonFocus(true)}
                    onBlur={() => setIsReasonFocus(false)}
                    focus={isReasonFocus}
                    multiline={true}
                  />
                  <CustomChip
                    getData={res => {
                      setExpertise(res);
                    }}
                    flag={15}
                  />
                  {/* <DropDownComponent
                    isrightimage={Icons.down}
                    toptext={'Content Type'}
                    placeholder={'Username'}
                    width="100%"
                    flag={2}
                    value={'Select Content Type'}
                    // onChangeText={val => setusername(val)}
                    // onFocus={() => setusernamefocus(true)}
                    // onBlur={() => setusernamefocus(false)}
                    focus={usernamefocus}
                  /> */}
                  {/* <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                            }}>
                            {chips.map((chip, index) => (
                              <View
                                key={index}
                                style={{
                                  backgroundColor: 'red',
                                  borderRadius: 20,
                                  padding: 8,
                                  margin: 4,
                                }}>
                                <Text style={{color:'red'}}>{chip}</Text>
                              </View>
                            ))}
                          </View>
                        </View> */}
                </View>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // alignItems:'center',
              bottom:
                Platform?.OS === 'android' ? normalize(30) : normalize(30),
              // marginHorizontal: normalize(20),
              width: '80%',
              // marginRight: 20,
            }}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => MediaPostItem()}>
              <Text
                style={{
                  fontSize: normalize(18),
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.white,
                  fontWeight: '600',
                }}>
                Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingButton1}
              onPress={() => props?.navigation?.goBack('')}>
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

export default CreateVideoPostStep1;

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
  arrowIcon: {
    // Adjust the styles for the down arrow icon
    width: 15,
    height: 15,
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 11111,
    bottom: Platform.OS === 'ios' ? 100 : 100,
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
  // floatingButtonForPoll:{}
  floatingButton1: {
    position: 'absolute',
    zIndex: 11111,
    bottom: Platform.OS === 'ios' ? 100 : 100,
    right: -70,

    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: normalize(10),
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconImage: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(20),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  text: {
    color: 'white',
    marginLeft: normalize(5),
    bottom: normalize(8),
    // fontWeight:'600'
  },
});
