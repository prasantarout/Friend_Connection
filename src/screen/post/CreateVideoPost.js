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
  Pressable,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import {Fonts} from '../../themes/ImagePath';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImagePicker from 'react-native-image-crop-picker';
import CustomChip from '../../components/CustomChip';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import Loader from '../../utils/helpers/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import VideoPicker from '../../components/VideoPicker';
import VideoThumbnails from '../../components/VideoThumbnails';

const CreateVideoPost = props => {
  // console.log(props?.route?.params?.postGroupId, '>>>>>>>itemdsakj');

  const [selectedMedia, setSelectedMedia] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [usernamefocus, setusernamefocus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [cameraPicker, setCameraPicker] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [videoPicker, setVideoPicker] = useState(false);
  const [VideoPicObj1, setVideoPicObj1] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [isPhotoSelect, setIsPhotoSelect] = useState(false);
  const [isVideoSelect, setIsVideoSelect] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Photos');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const postReducer = useSelector(state => state.PostReducer);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  let mediaData = [
    {
      id: 1,
      icon: Icons.uni1,
      icon2: Icons.correct,
    },
    {
      id: 2,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 3,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 4,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 5,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 6,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 7,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 8,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 9,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 10,
      icon: Icons.uni1,
      icon2: Icons.correct,
    },
    {
      id: 11,
      icon: Icons.uni3,
      icon2: Icons.correct,
    },
    {
      id: 12,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 13,
      icon: Icons.uni1,
      icon2: Icons.correct,
    },
    {
      id: 14,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 15,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
    {
      id: 16,
      icon: Icons.uni2,
      icon2: Icons.correct,
    },
  ];
  const handleMediaSelect = mediaId => {
    setSelectedMedia(mediaId);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const selectOption = option => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  const getImages = async () => {
    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
      CameraRoll.getPhotos({first: 5000, assetType: 'Photos'})
        .then(result => {
          // console.log(result, 'getImages>> res');
          let imagaeArr = [];
          let imagaeArr1 = [];
          result.edges.map(edges => {
            imagaeArr.push(edges.node.image);
            imagaeArr1?.push(edges.node);
          });
          // console.log(imagaeArr1, '>>>>>>Dsadj');
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
      tempArr.push(obj);
    });
    setRenderPhoto(tempArr);
  }, [allPhotos1]);

  const [seletedImage, setSeletedImage] = useState(null);
  const [cameraSelect, setCameraSelect] = useState(false);

  React.useEffect(() => {
    getImages();
  }, []);
  React.useEffect(() => {
    if (allPhotos.length > 1) {
      setSeletedImage(allPhotos[1]);
    }
    if (renderPhoto?.length > 1) {
      setSeletedImage(renderPhoto[1]);
    }
  
    //  setSeletedImage()
  }, [allPhotos, renderPhoto]);


  useFocusEffect(
    React?.useCallback(()=>{
      setIsPosting(false);
      setSelectedOption('Photos');
      if (renderPhoto?.length > 1) {
        setSeletedImage(renderPhoto[1]);
      }
    },[isFocus])
  )


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
            style={{height: '100%', width: '48%', backgroundColor: '#D9D9D9'}}
          />
          {/* <View
            style={{height: '100%', width: '32%', backgroundColor: '#D9D9D9'}}
          /> */}
        </View>
        <View style={{marginHorizontal: normalize(18), paddingTop: 10}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform?.OS == 'android' ? 210 : 210,
            }}>
            <View style={{marginTop: normalize(10)}}>
              { seletedImage != null && (
                <ImageBackground
                  source={{
                    uri:
                      cameraSelect !== false
                        ? seletedImage?.path
                        : seletedImage?.uri,
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
                                selectOption('Photos'), setIsVideoSelect(false);
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
              <View style={{flex: 1, marginTop: normalize(20)}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  numColumns={3}
                  data={Platform?.OS === 'android' ? renderPhoto : allPhotos}
                  contentContainerStyle={{paddingBottom: normalize(150)}}
                  renderItem={({item, index}) => {
                    return (
                      <Pressable
                        onPress={() => {
                          if (index === 0) {
                            ImagePicker.openCamera({
                              width: 300,
                              height: 500,
                              cropping: true,
                              mediaType: 'photo',
                            })
                              .then(response => {
                                setSeletedImage(response);
                                setCameraSelect(false);
                                props.navigation.navigate(
                                  'CreateVideoPostStep1',
                                  {
                                    selectedImg: response,
                                    groupId: props?.route?.params?.postGroupId,
                                    type: props?.route?.params?.type,
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
                          <View
                            style={{
                              flex: 1,
                            }}>
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

                        {index != 0 && item.uri == seletedImage?.uri && (
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
                      </Pressable>
                    );
                  }}
                />
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // alignItems:'center',
              marginHorizontal:
                Platform?.OS === 'android' ? normalize(15) : normalize(20),
              bottom: Platform?.OS === 'android' ? normalize(30) : 10,
              width: '70%',
            }}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() =>
                props?.navigation?.navigate('CreateVideoPostStep1', {
                  imageUrl: seletedImage,
                  groupId: props?.route?.params?.postGroupId,
                })
              }>
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
        <VideoPicker
          pickerVisible={videoPicker}
          onBackdropPress={() => setVideoPicker(false)}
          btnClick_TakeVideoUpload={videoObj => {
            setVideoPicObj1([...VideoPicObj1, videoObj]); // Update VideoPicObj1 using the setVideoPicObj1 function
            setVideoPicker(false);
            setIsPosting(true);
            let tempArr=[];
            tempArr?.push(videoObj);
            props.navigation.navigate('CreateVideoPostStep1', {
              selectedImg:tempArr,
              groupId: props?.route?.params?.postGroupId,
              type: props?.route?.params?.type,
            });
          }}
          btnClick_VideogaleryUpload={videoObj => {
            let a = [];
            videoObj?.map(item => {
              a.push(item);
            });
            setVideoPicObj1([...VideoPicObj1, ...a]); // Update VideoPicObj1 using the setVideoPicObj1 function
            setVideoPicker(false);
            setIsPosting(true);
            props.navigation.navigate('CreateVideoPostStep1', {
              selectedImg: videoObj,
              groupId: props?.route?.params?.postGroupId,
              type: props?.route?.params?.type,
            });
          }}
          multiple={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateVideoPost;

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
    width: normalize(15),
    height: normalize(15),
    marginTop: 1,
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  scrollViewContent: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingBottom: 100,
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
    bottom: Platform.OS === 'ios' ? normalize(82) : normalize(85),
    right: -70,

    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },
});
