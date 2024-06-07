import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  TextInput,
  Platform,
  Switch,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState, useRef} from 'react';
import HeaderSection from '../../components/HeaderSection';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import TextInputmultiple from '../../components/TextInputmultiple';
import DropDownComponent from '../../components/DropDownComponent';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  pollListRequest,
  pollSubmitRequest,
} from '../../redux/reducer/PollReducer';
import {
  postListRequest,
  postSubmitRequest,
} from '../../redux/reducer/PostReducer';
import CameraPicker from '../../components/CameraPicker';
import constants from '../../utils/helpers/constants';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImagePicker from 'react-native-image-crop-picker';
import CustomChip from '../../components/CustomChip';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import Loader from '../../utils/helpers/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import TextInputItem from '../../components/TextInput';
import VideoThumbnails from '../../components/VideoThumbnails';
import Video from 'react-native-video';
import VideoPicker from '../../components/VideoPicker';
import {navigationRef} from '../../utils/helpers/RootNavigation';

const AddPostCreatePostStep1 = ({navigation}) => {
  const [focused, setIsFocus] = useState(true);
  const [activeTab, setActiveTab] = useState('Friends');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab1, setActiveTab1] = useState('male');
  const [profileModal, setProfileModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [reason, setReason] = useState('');
  const [fullName, setFullName] = useState('');
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const [isNameFocus, setIsNameFocus] = useState(false);
  const [isTag, setIsTag] = useState('');
  const [isGroupPost, setIsGroup] = useState(null);
  const [isTagFocus, setIsTagFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [usernamefocus, setusernamefocus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [cameraPicker, setCameraPicker] = useState(false);
  const [expertise, setExpertise] = useState([]);
  const [addScenario, setAddScenario] = useState(false);
  const [scenarioText, setScenarioText] = useState('');
  const [scenarioErr, setScenarioErr] = useState('');
  const [scenarioFocus, setScenarioFocus] = useState(false);
  const [scenarioList, setScenarioList] = useState([]);
  const pollReducer = useSelector(state => state.PollReducer);
  const [seletedImage, setSeletedImage] = useState(null);
  const [cameraSelect, setCameraSelect] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoSelect, setIsVideoSelect] = useState(false);
  const [isPhotoSelect, setIsPhotoSelect] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Photos');
  const [videoPicker, setVideoPicker] = useState(false);
  const [VideoPicObj1, setVideoPicObj1] = useState([]);
  const videoPlayer = useRef(null);

  const postReducer = useSelector(state => state.PostReducer);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };
  const toggleSwitch1 = () => {
    setIsEnabled1(previousState => !previousState);
  };
  const handleInputChange = text => {
    setInputValue(text);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() !== '') {
      setChips([...chips, inputValue?.trim()]);
      setInputValue('');
    }
  };

  const handleMediaSelect = mediaId => {
    setSelectedMedia(mediaId);
  };
  const handleTabPress1 = tab => {
    setActiveTab1(tab);
  };

  const onLoad = data => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    // setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  const handleTabPress = tab => {
    setActiveTab(tab);
    setIsPosting(false);
    setIsPolling(true);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const selectOption = option => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
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
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);

  const getImages = async () => {
    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
      CameraRoll.getPhotos({
        first: 5000,
        assetType: 'Photos',
      })
        .then(result => {
          let imagaeArr = [];
          let imagaeArr1 = [];
          result?.edges?.map(edges => {
            imagaeArr?.push(edges?.node?.image);
            imagaeArr1?.push(edges?.node);
          });
          console.log(result, 'dsdjhsd');
          setAllPhotos([...allPhotos, ...imagaeArr]);
          setAllPhotos1([...allPhotos1, ...imagaeArr1]);
        })
        .catch(error => {});
    } catch (error) {
      console.error('getImages>> error', error);
    }
  };

  const [allPhotos, setAllPhotos] = useState([
    {
      extension: null,
      fileSize: 0,
      filename: '0',
      height: 0,
      playableDuration: null,
      uri: null,
      width: 0,
    },
  ]);
  const [allPhotos1, setAllPhotos1] = useState([]);
  const [renderPhoto, setRenderPhoto] = useState([
    {
      name: '0',
      type: null,
      uri: null,
    },
  ]);

  useEffect(() => {
    let tempArr = [];
    allPhotos1?.forEach((item, index) => {
      let obj = {
        name: item?.image?.uri?.replace(/^.*[\\\/]/, ''),
        type: item?.type,
        uri: index === 0 ? null : item?.image?.uri,
      };
      tempArr?.push(obj);
    });
    setRenderPhoto(tempArr);
  }, [allPhotos1]);

  React.useEffect(() => {
    getImages();
  }, []);
  React.useEffect(() => {
    if (allPhotos?.length > 1) {
      setSeletedImage(allPhotos[1]);
    }
    if (renderPhoto?.length > 1) {
      setSeletedImage(renderPhoto[1]);
    }
    //  setSeletedImage()
  }, [allPhotos, renderPhoto]);

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
      obj.append('is_group_post', isGroupPost !== null ? true : false);
      obj.append(
        'group_id',
        isGroupPost !== null ? isGroupPost?.group_id : null,
      );
      obj.append(
        'media_url',
        VideoPicObj1?.length > 0
          ? VideoPicObj1[0]
          : {
              uri:
                cameraSelect !== false ? seletedImage?.path : seletedImage?.uri,
              type:
                cameraSelect !== false
                  ? seletedImage?.mime
                  : seletedImage?.type !== undefined
                    ? seletedImage?.type
                    : `image/${seletedImage?.extension}`,
              name:
                cameraSelect !== false
                  ? seletedImage?.path?.replace(/^.*[\\\/]/, '')
                  : seletedImage?.name !== undefined &&
                      seletedImage?.name !== '' &&
                      seletedImage?.name !== null
                    ? seletedImage?.name
                    : seletedImage?.name === undefined
                      ? 'demo'
                      : seletedImage?.filename?.split('.')[0],
            },
      );
      // console.log(obj, '>>>>>>dsadkhjdk');
      // console.log(VideoPicObj1,">>>>>>>>>>res")
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
  const handlePollSubmit = () => {
    if (fullName.trim().length === 0) {
      showErrorAlert('Please enter poll name');
      return;
    }
    if (scenarioList?.length < 2) {
      showErrorAlert('Please add atleast 2 scenario');
      return;
    }
    const uniqueScenarios = new Set(scenarioList);
    if (uniqueScenarios.size !== scenarioList.length) {
      showErrorAlert('Please make sure all scenarios are unique');
      return;
    }

    let obj = new FormData();
    obj?.append('title', fullName);
    scenarioList?.forEach((_scenario, _index) =>
      obj?.append(`scenario[${_index}]`, _scenario),
    );
    connectionrequest()
      .then(() => {
        dispatch(pollSubmitRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
        // console.log('66', err);
      });
  };

  useEffect(() => {
    let status = '';
    if (status == '' || pollReducer.status != status) {
      switch (pollReducer.status) {
        case 'Poll/pollSubmitRequest':
          status = pollReducer.status;
          break;
        case 'Poll/pollSubmitSuccess':
          status = pollReducer.status;
          setIsPosting(false);
          navigation?.replace('PostedSuccess');
          break;
        case 'Poll/pollSubmitFailure':
          status = pollReducer.status;
          break;
      }
    }
  }, [pollReducer?.status]);

  useEffect(() => {
    let status = '';
    if (status == '' || postReducer.status != status) {
      switch (postReducer.status) {
        case 'Post/postSubmitRequest':
          status = postReducer.status;
          break;
        case 'Post/postSubmitSuccess':
          status = postReducer.status;
          navigation?.replace('PostedSuccess');
          setIsPosting(false);
          break;
        case 'Post/postSubmitFailure':
          status = postReducer.status;
          break;
      }
    }
  }, [postReducer?.status]);

  const RenderAddScenarioModal = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={addScenario}
        style={{
          width: '100%',
          alignSelf: 'center',
          margin: 0,
        }}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setAddScenario(false);
        }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderTopRightRadius: normalize(20),
              borderTopLeftRadius: normalize(20),
              paddingVertical: normalize(10),
              paddingHorizontal: normalize(10),
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View
              style={{
                alignItems: 'flex-start',
                height: '100%',
                marginBottom: normalize(20),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  marginLeft: normalize(15),
                  fontSize: normalize(22),
                  marginVertical: normalize(10),
                  fontWeight: '500',
                }}>
                Add Scenario
              </Text>
              <TextInputItem
                toptext="Enter Scenario"
                placeholder={'Enter your scenario'}
                value={scenarioText}
                onChangeText={val => {
                  setScenarioText(val);
                  setScenarioErr('');
                }}
                onFocus={() => setScenarioFocus(true)}
                onBlur={() => setScenarioFocus(false)}
                focus={scenarioFocus}
              />
              <Text
                style={{
                  fontSize: normalize(12),
                  color: Colors.red,
                  paddingLeft: normalize(5),
                  marginTop: normalize(5),
                }}>
                {scenarioErr}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 'auto',
                marginBottom: normalize(20),

                width: '80%',
              }}>
              <TouchableOpacity
                style={styles.floatingModalButton}
                onPress={() => {
                  if (scenarioText.trim().length === 0) {
                    setScenarioErr('Please enter a scenario!');
                    return;
                  }
                  setScenarioList(prev => [...prev, scenarioText]);
                  setAddScenario(false);
                  setScenarioText('');
                  Keyboard.dismiss();
                }}>
                <Text
                  style={{
                    fontSize: normalize(18),
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  Add
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.floatingModalButton1}
                onPress={() => {
                  setAddScenario(false), setScenarioErr('');
                }}>
                <Image
                  source={Icons.cross}
                  style={{width: normalize(15), height: normalize(15)}}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  const extension =
    Platform?.OS === 'android'
      ? seletedImage?.type
      : seletedImage?.extension?.trim()?.toLowerCase()?.endsWith('.mp4');

  const CustomDropdown = ({
    toggleDropdown,
    selectedOption,
    selectOption,
    isDropdownVisible,
  }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={toggleDropdown}>
        <Text
          style={{
            fontSize: normalize(13),
            fontWeight: '600',
            fontFamily: Fonts.OpenSans_Medium,
            color: '#F27C24',
          }}>
          {selectedOption}
        </Text>
        <Image
          style={styles.arrowIcon}
          source={Icons.downArr}
          tintColor="#F27C24"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}} edges={['top']}>
      <Loader
        visible={
          postReducer?.status === 'Post/postSubmitRequest' ||
          pollReducer?.status === 'Poll/pollSubmitRequest'
        }
      />
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderSection />
      <View style={{height: '100%', flex: 4}}>
        <View style={{marginHorizontal: normalize(20)}}>
          <Text
            style={{
              fontSize: normalize(16),
              color: '#1F2440',
              fontWeight: '700',
              fontFamily: Fonts.OpenSans_Medium,
              lineHeight: normalize(21.79),
            }}>
            Post
          </Text>
          <View style={{flexDirection: 'row', marginVertical: normalize(12)}}>
            <TouchableOpacity
              style={{
                height: normalize(35),
                width: normalize(109),
                backgroundColor:
                  activeTab === 'Friends'
                    ? 'rgba(242,124,36,0.2)'
                    : Colors.white,
                borderRadius: normalize(50),
                marginRight: normalize(10),
                borderColor: '#F4F3F3',
                borderWidth: normalize(1),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleTabPress('Friends')}>
              <Text
                style={{
                  color: activeTab === 'Friends' ? Colors.orange : '#383A46',
                  fontSize: normalize(11),
                  fontFamily: Fonts.OpenSans_Medium,
                }}>
                Create Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTabPress('requests')}
              style={{
                height: normalize(35),
                width: normalize(109),
                backgroundColor:
                  activeTab != 'Friends'
                    ? 'rgba(242,124,36,0.2)'
                    : Colors.white,
                borderRadius: normalize(50),
                marginRight: normalize(10),
                borderColor: '#F4F3F3',
                borderWidth: normalize(1),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: activeTab != 'Friends' ? Colors.orange : '#383A46',
                  fontSize: normalize(11),
                  fontFamily: Fonts.OpenSans_Medium,
                }}>
                Create Poll
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'Friends' && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: isPosting ? '100%' : 0}}>
                <View style={{marginTop: normalize(10)}}>
                  {VideoPicObj1?.length > 0 &&
                    (VideoPicObj1[0]?.type === 'video/mp4' ? (
                      <VideoThumbnails
                        uriItem={VideoPicObj1[0]?.uri}
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
                    ) : (
                      <ImageBackground
                        source={{
                          uri:
                            cameraSelect !== false
                              ? seletedImage?.path
                              : seletedImage.uri,
                        }}
                        style={{
                          height: normalize(280),
                          width: '100%',
                          borderRadius: normalize(10),
                          overflow: 'hidden',
                        }}
                        resizeMode="stretch"
                      />
                    ))}

                  {!VideoPicObj1.length > 0 && seletedImage != null && (
                    <ImageBackground
                      source={{
                        uri:
                          cameraSelect !== false
                            ? seletedImage?.path
                            : seletedImage.uri,
                      }}
                      style={{
                        height: normalize(280),
                        width: '100%',
                        borderRadius: normalize(10),
                        overflow: 'hidden',
                      }}
                      resizeMode="stretch"
                    />
                  )}

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
                        {isPosting ? 'Posts' : 'Select'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {isPosting && (
                        <Image
                          style={[styles.arrowIcon, {right: 2}]}
                          source={Icons.globe}
                        />
                      )}
                      <Text
                        style={{
                          fontSize: normalize(13),
                          fontWeight: isPosting ? '400' : '600',
                          fontFamily: Fonts.OpenSans_Medium,
                          color: isPosting ? '#1F2440' : '#F27C24',
                        }}>
                        {isPosting ? (
                          'Public'
                        ) : (
                          <View>
                            <CustomDropdown
                              toggleDropdown={toggleDropdown}
                              selectedOption={selectedOption}
                              selectOption={selectOption}
                              isDropdownVisible={isDropdownVisible}
                            />
                            {/* Dropdown content */}
                            {isDropdownVisible && (
                              <View
                                style={{
                                  right: 2,
                                  borderRadius: 5,
                                  backgroundColor: '#fff',
                                  elevation: 4,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                  }}
                                  onPress={() => {
                                    selectOption('Photos'),
                                      setIsVideoSelect(false);
                                    setIsPhotoSelect(true);
                                  }}>
                                  <Text>Photos</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                  }}
                                  onPress={() => {
                                    selectOption('Videos'),
                                      setVideoPicker(true),
                                      setIsPhotoSelect(false);
                                  }}>
                                  <Text>Videos</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={{marginTop: normalize(10)}}>
                    {isPosting ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <TextInputmultiple
                          toptext={'Description'}
                          placeholder={'Eg: University Group 2022'}
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
                      </View>
                    ) : (
                      <View style={{flex: 1}}>
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          numColumns={3}
                          data={
                            Platform?.OS === 'android' ? renderPhoto : allPhotos
                          }
                          contentContainerStyle={{
                            paddingBottom: normalize(180),
                          }}
                          renderItem={({item, index}) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  if (index === 0) {
                                    ImagePicker.openCamera({
                                      width: 300,
                                      height: 500,
                                      cropping: true,
                                      mediaType: 'any',
                                    })
                                      .then(response => {
                                        setCameraSelect(true);
                                        setIsPosting(true);
                                        setSeletedImage(response);
                                        props?.navigation?.navigate(
                                          'CreateStoryStep2',
                                          {
                                            selectedImg: response,
                                          },
                                        );
                                      })
                                      .catch(err => console.log(err));
                                  } else {
                                    setSeletedImage(item);
                                    setCameraSelect(false);
                                  }
                                }}
                                style={{
                                  height: normalize(110),
                                  width: '31.5%',
                                  borderRadius: normalize(10),
                                  marginBottom: normalize(5),
                                  overflow: 'hidden',
                                  marginHorizontal: '1%',
                                  backgroundColor: Colors.lightOrange,
                                }}>
                                {item.uri == null ? (
                                  <View style={{flex: 1}}>
                                    <View
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Image
                                        source={Icons.camera}
                                        style={{
                                          height: '30%',
                                          width: '30%',
                                          resizeMode: 'contain',
                                          tintColor: Colors.orange,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          fontSize: normalize(12),
                                          color: Colors.orange,
                                          fontFamily: Fonts.OpenSans_SemiBold,
                                          position: 'absolute',
                                          bottom: normalize(5),
                                          left: normalize(8),
                                        }}>
                                        Camera
                                      </Text>
                                    </View>
                                  </View>
                                ) : extension && extension === 'video/mp4' ? (
                                  <Video
                                    onEnd={onEnd}
                                    onLoad={onLoad}
                                    onLoadStart={onLoadStart}
                                    poster={item?.uri}
                                    posterResizeMode={'cover'}
                                    // onProgress={onProgress}
                                    // paused={paused}
                                    ref={ref => (videoPlayer.current = ref)}
                                    resizeMode={'cover'}
                                    source={{uri: item?.uri}}
                                    // style={styles.backgroundVideo}
                                  />
                                ) : (
                                  <Image
                                    source={{uri: item.uri}}
                                    style={{
                                      height: '100%',
                                      width: '100%',
                                      resizeMode: 'cover',
                                    }}
                                  />
                                )}

                                {index != 0 &&
                                  item.uri == seletedImage?.uri && (
                                    <View
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        position: 'absolute',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Image
                                        source={Icons.check}
                                        style={{
                                          height: '50%',
                                          width: '50%',
                                          resizeMode: 'contain',
                                          tintColor: Colors.white,
                                        }}
                                      />
                                    </View>
                                  )}
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>

              {isPosting ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                    width: '80%',
                    // marginRight: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => {
                      setIsPosting(true), MediaPostItem();
                    }}>
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
                    onPress={() => {
                      setIsPosting(false),
                        setVideoPicObj1([]),
                        setIsPhotoSelect(true),
                        setIsVideoSelect(false);
                      setSelectedOption('Photos');
                    }}>
                    <Image
                      source={Icons.cross}
                      style={{width: normalize(15), height: normalize(15)}}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    marginRight: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => setIsPosting(true)}>
                    <Text
                      style={{
                        fontSize: normalize(18),
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          {activeTab === 'requests' && (
            <>
              {isPolling ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: Platform.OS == 'android' ? 280 : 210,
                  }}>
                  <View style={{marginTop: normalize(10)}}>
                    <TextInputmultiple
                      toptext={'Poll Name'}
                      placeholder={'Enter Post Name'}
                      placeholderTextColor={'#383A46'}
                      width="100%"
                      fullNameFlag={6}
                      value={fullName}
                      onChangeText={val => setFullName(val)}
                      onFocus={() => setIsNameFocus(true)}
                      onBlur={() => setIsNameFocus(false)}
                      focus={isNameFocus}
                    />
                    {scenarioList.map((_scenario, _index) => {
                      return (
                        <View style={styles.scenarioList}>
                          <View style={styles.stackedText}>
                            <Text style={styles.mutedText}>
                              Scenario {_index + 1}
                            </Text>
                            <Text style={styles.primaryText}>{_scenario}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              setScenarioList(prev =>
                                prev.filter((_, idx) => idx !== _index),
                              )
                            }>
                            <Image
                              source={Icons.deletePost}
                              style={{
                                width: normalize(20),
                                height: normalize(20),
                                resizeMode: 'contain',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                    <Pressable
                      style={styles.scenarioList}
                      onPress={() => setAddScenario(true)}>
                      <View style={styles.stackedText}>
                        <Text style={[styles.primaryText, {marginTop: 0}]}>
                          Add Scenario
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setAddScenario(true)}>
                        <Image
                          source={Icons.addPost}
                          style={{
                            width: normalize(20),
                            height: normalize(20),
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    </Pressable>
                  </View>
                </ScrollView>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 280}}>
                  <View style={{marginTop: normalize(10)}}>
                    <TextInputmultiple
                      toptext={'Full Name'}
                      placeholder={'Enter Full Name'}
                      placeholderTextColor={'#383A46'}
                      width="100%"
                      fullNameFlag={6}
                      value={fullName}
                      onChangeText={val => setFullName(val)}
                      onFocus={() => setIsNameFocus(true)}
                      onBlur={() => setIsNameFocus(false)}
                      focus={isNameFocus}
                    />

                    <DropDownComponent
                      isrightimage={Icons.down}
                      toptext={'Major'}
                      placeholder={'Username'}
                      width="100%"
                      flag={2}
                      value={'Enter class of major domain'}
                      focus={usernamefocus}
                    />
                  </View>
                  <View style={{marginTop: normalize(15)}}>
                    <View>
                      <Text
                        style={{
                          fontSize: normalize(15),
                          fontWeight: '600',
                          lineHeight: 21.7,
                          fontFamily: Fonts.OpenSans_Medium,
                        }}>
                        Privacy Settings
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontFamily: Fonts.OpenSans_Medium,
                          fontSize: normalize(12),
                          color: '#1F2440',
                        }}>
                        Post to random students
                      </Text>
                      <Switch
                        trackColor={{
                          false: '#f4f3f4',
                          true: 'rgba(242,124,36,0.2)',
                        }}
                        thumbColor={isEnabled ? '#F27C24' : '#1F2440'}
                        ios_backgroundColor="#f4f3f4"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: normalize(12),
                      }}>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontFamily: Fonts.OpenSans_Medium,
                          fontSize: normalize(12),
                          color: '#1F2440',
                        }}>
                        Post to album
                      </Text>
                      <Switch
                        trackColor={{
                          false: '#f4f3f4',
                          true: 'rgba(242,124,36,0.2)',
                        }}
                        thumbColor={isEnabled1 ? '#F27C24' : '#1F2440'}
                        ios_backgroundColor="#f4f3f4"
                        onValueChange={toggleSwitch1}
                        value={isEnabled1}
                        style={{transformX: [{scale: 1.2}]}}
                      />
                    </View>
                  </View>
                </ScrollView>
              )}
              {isPolling ? (
                <View
                  style={{
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={handlePollSubmit}>
                    <Text
                      style={{
                        fontSize: normalize(18),
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      Create Poll
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    // marginRight: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => setIsPolling(true)}>
                    <Text
                      style={{
                        fontSize: normalize(18),
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {/* Add Scenario Modal */}

      {RenderAddScenarioModal()}

      <CameraPicker
        pickerVisible={cameraPicker}
        multiple={true}
        onBackdropPress={() => setCameraPicker(false)}
        btnClick_cameraUpload={imgObj => {
          setProfilePicObj(imgObj);
          setProfilePicUri(imgObj.uri);
          setCameraPicker(false);
          // UploadProfile(imgObj);
        }}
        btnClick_galeryUpload={imgObj => {
          // console.log(imgObj, '>>>>>>>>>>>>>');
          setProfilePicObj(imgObj);
          setProfilePicUri(imgObj.uri);
          setCameraPicker(false);
          // UploadProfile(imgObj);
        }}
      />
      <VideoPicker
        pickerVisible={videoPicker}
        onBackdropPress={() => setVideoPicker(false)}
        btnClick_TakeVideoUpload={videoObj => {
          setVideoPicObj1([...VideoPicObj1, videoObj]); // Update VideoPicObj1 using the setVideoPicObj1 function
          setVideoPicker(false);
          setIsPosting(true);
        }}
        btnClick_VideogaleryUpload={videoObj => {
          let a = [];
          videoObj?.map(item => {
            a.push(item);
          });
          setVideoPicObj1([...VideoPicObj1, ...a]); // Update VideoPicObj1 using the setVideoPicObj1 function
          setVideoPicker(false);
          setIsPosting(true);
        }}
        multiple={true}
      />
    </SafeAreaView>
  );
};

export default AddPostCreatePostStep1;

const styles = StyleSheet.create({
  tabButton: {
    padding: normalize(10),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(40),
    borderColor: '#F4F3F3',
    backgroundColor: Colors.white,
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',

    // Adjust the margin as needed
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 11111,
    bottom: Platform.OS === 'ios' ? 120 : 120,
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
    bottom: Platform.OS === 'ios' ? 122 : 120,
    right: -70,

    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },

  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  friendContainer: {
    width: (Dimensions.get('window').width - normalize(50)) / 2, // Calculate width based on screen width and margin
    alignItems: 'center',
    // marginHorizontal: normalize(10),
    marginTop: normalize(15),
  },
  friendImage: {
    width: '100%', // Make the image take the full width of the container
    height: normalize(120),
    borderRadius: normalize(10),
    // marginLeft:10
  },
  arrowIcon: {
    // Adjust the styles for the down arrow icon
    width: normalize(15),
    height: normalize(15),
    marginTop: 1,
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: normalize(5),
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '400',
  },
  friendStatus: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '400',
  },
  scrollViewContent: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingBottom: 250,
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(5),
    right: normalize(5),
    padding: normalize(5),
    borderRadius: normalize(5),
  },
  boxIcon: {
    width: normalize(20),
    height: normalize(20),
  },
  mediaContainer: {
    flex: 1,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  mediaImageContainer: {
    flex: 1,
    overflow: 'hidden',
    // Optional: Add border radius for a rounded look
  },
  selectedMediaContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
  },
  mediaImage: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  mediaList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedMediaContainer: {
    // Add background color when selected
    backgroundColor: 'rgba(242,124,36,0.2)', // Adjust color and alpha as needed
  },
  selectedMediaImageContainer: {
    // Add background color when selected
    backgroundColor: 'rgba(242,124,36,0.2)', // Adjust color and alpha as needed
  },
  selectIconContainer: {
    position: 'absolute',
    alignItems: 'center',

    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,124,36,0.3)',
  },
  selectIcon: {
    width: normalize(15),
    height: normalize(15),
    justifyContent: 'center',
    tintColor: '#FFFFFF',
  },
  arrowIcon: {
    // Adjust the styles for the down arrow icon
    width: 15,
    height: 15,
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  scenarioList: {
    height: normalize(62),
    width: '100%',
    borderRadius: normalize(8),
    backgroundColor: Colors.white,
    borderColor: Colors.borderColor,
    borderWidth: normalize(1),
    marginTop: normalize(15),
    padding: normalize(11),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalize(15),
  },
  stackedText: {
    marginRight: 'auto',
  },
  mutedText: {
    color: '#A0A0A0',
    fontFamily: Fonts.Nunito_Regular,
    fontSize: normalize(12),
    marginTop: normalize(9),
  },
  primaryText: {
    color: '#383A46',
    fontSize: normalize(13),
    fontFamily: Fonts.OpenSans_Medium,
    marginTop: normalize(7),
  },
  floatingModalButton: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 120 : 120,
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
  floatingModalButton1: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 122 : 120,

    right: -10,
    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },
});
