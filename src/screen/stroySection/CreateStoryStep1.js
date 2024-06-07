import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
  PermissionsAndroid,
  AppState,
  BackHandler,
} from 'react-native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import React, {useEffect, useRef, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import {Pressable} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {requestExternalStoreageRead} from '../../utils/helpers/StoragePermission';
import {Linking} from 'react-native';
import showErrorAlert from '../../utils/helpers/Toast';
import {useFocusEffect} from '@react-navigation/native';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const CreateStoryStep1 = props => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [seletedImage, setSeletedImage] = useState(null);
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
  const [dummyAllPhotos, setDummyAllPhotos] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  const [loader, setLoader] = useState(false);

  const getImages = async () => {
    try {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }

      setLoader(true);
      CameraRoll.getPhotos({first: 5000, assetType: 'Photos'})
        .then(result => {
          setLoader(true);
          let imagaeArr = [];
          result.edges.map(edges => {
            imagaeArr.push(edges.node.image);
          });
          setAllPhotos([...allPhotos, ...imagaeArr]);
          setLoader(false);
        })
        .catch(error => {
          console.error('getImmages 1>>', error);
        });
    } catch (error) {
      console.error('getImmages>>', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getImages();
    }, []),
  );

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

  // console.log('appStateVisible>>>', appStateVisible);
  const onPressCamera = () => {
    try {
      ImagePicker.openCamera({
        width: 300,
        height: 500,
        cropping: true,
        mediaType: 'photo',
      })
        .then(response => {
          props.navigation.navigate('CreateStoryStep2', {
            selectedImg: {
              name: `tigerConnect_${moment().unix()}${Math.floor(
                Math.random() * 10000,
              )}`,
              type: response.mime.split('/')[1],
              uri: response.path,
            },
          });
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.error('onPressCamera>>', error);
    }
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
          }}>
          <Text style={styles.txt}>Create Story</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>

      <View style={{marginHorizontal: normalize(15), flex: 1}}>
        {loader ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={3}
            data={dummyAllPhotos}
            contentContainerStyle={{}}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  if (index === 0) {
                    onPressCamera();
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
                {index == 0 ? (
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
                          bottom: normalize(10),
                          // left: normalize(8),
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                        }}>
                        Camera
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{height: '100%', width: '100%'}} />
                )}
              </Pressable>
            )}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={3}
            data={allPhotos}
            contentContainerStyle={{}}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  if (index === 0) {
                    onPressCamera();
                  } else {
                    setSeletedImage(item);
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
            )}
          />
        )}
      </View>
      {seletedImage != null && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: normalize(0),
            marginBottom: normalize(8),
            marginHorizontal: normalize(15),
          }}>
          <TouchableOpacity
            onPress={() => {
              let ext = '';
              if (seletedImage.extension == null) {
                let a = seletedImage.uri.split('.');
                ext = a[a.length - 1];
              } else {
                ext = seletedImage.extension;
              }

              props.navigation.navigate('CreateStoryStep2', {
                selectedImg: {
                  name: `tigerConnect_${moment().unix()}${Math.floor(
                    Math.random() * 10000,
                  )}`,
                  type: ext,
                  uri: seletedImage.uri,
                },
              });
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
      )}
    </SafeAreaView>
  );
};

export default CreateStoryStep1;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform?.OS == 'android' ? normalize(35) : 20,
    marginHorizontal: normalize(15),
    marginBottom: normalize(15),
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
    bottom: 100,
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
  floatingButton1: {
    position: 'absolute',
    zIndex: 11111,
    bottom: 100,
    right: 16,
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
});
