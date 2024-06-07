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
  SafeAreaView,
  Pressable,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import HeaderSection from '../../components/HeaderSection';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import TextInputmultiple from '../../components/TextInputmultiple';
import DropDownComponent from '../../components/DropDownComponent';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {postListRequest} from '../../redux/reducer/PostReducer';
import CameraPicker from '../../components/CameraPicker';
import constants from '../../utils/helpers/constants';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const AddPostCreatePostStep1 = () => {
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
  const [isTagFocus, setIsTagFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [usernamefocus, setusernamefocus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [cameraPicker, setCameraPicker] = useState(false);
  const postReducer = useSelector(state => state.PostReducer);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(postListRequest());
  }, [isFocus]);

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
      setChips([...chips, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleMediaSelect = mediaId => {
    setSelectedMedia(mediaId);
  };
  const handleTabPress1 = tab => {
    setActiveTab1(tab);
  };
  const [confirm, setConfirm] = useState(true);
  const handleTabPress = tab => {
    setActiveTab(tab);
    setIsPosting(false);
    setIsPolling(false);
  };
 


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
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderSection />
      <View style={{flex: 5.5}}>
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
                contentContainerStyle={{paddingBottom: isPosting ? '70%' : 0}}>
                <View style={{marginTop: normalize(10)}}>
                  {/* <ImageBackground
                    source={Icons.extra7}
                    style={{
                      height: normalize(280),
                      width: '100%',
                      borderRadius: normalize(10),
                      overflow: 'hidden',
                    }}
                    resizeMode="stretch"
                  /> */}

                  <Pressable
                    onPress={() => setCameraPicker(true)}
                    style={{
                      height: normalize(120),
                      width: '100%',
                      borderRadius: normalize(10),
                      backgroundColor: 'red',
                      borderColor: Colors.black,
                      borderWidth: normalize(1),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Upload File</Text>
                  </Pressable>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: normalize(10),
                    }}>
                    {[0, 1, 2, 3, 4].map(() => {
                      return (
                        <View
                          style={{
                            height: normalize(110),
                            width: '32%',
                            borderRadius: normalize(10),
                            backgroundColor: 'red',
                            marginBottom: normalize(5),
                          }}></View>
                      );
                    })}
                  </View>
                  {isPosting && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalize(12),
                      }}>
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
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.6,
                        }}
                        onPress={() => setCameraPicker(true)}>
                        <Image
                          style={[
                            styles.arrowIcon,
                            {right: 2, tintColor: Colors.black},
                          ]}
                          source={Icons.globe}
                        />
                        <Text
                          style={{
                            fontSize: normalize(13),
                            // fontWeight: isPosting ? '400' : '600',
                            fontFamily: Fonts.OpenSans_Medium,
                            color: Colors.black,
                          }}>
                          Public
                        </Text>
                        <Image
                          style={{
                            width: normalize(15),
                            height: normalize(15),
                            resizeMode: 'contain',
                            tintColor: Colors.black,
                            marginTop: normalize(3),
                            marginLeft: normalize(3),
                          }}
                          source={Icons.downArr}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

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
                        />
                        <TextInputmultiple
                          toptext={'Tags'}
                          placeholder={'Economics'}
                          placeholderTextColor={'#383A46'}
                          width="100%"
                          flag={2}
                          height="80%"
                          value={inputValue}
                          onChangeText={text => setInputValue(text)}
                          // onEndEditing={handleInputSubmit}
                          onFocus={() => setIsTagFocus(true)}
                          onBlur={() => setIsTagFocus(false)}
                          focus={isTagFocus}
                        />
                        <DropDownComponent
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
                        />
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
                    ) : (
                      <FlatList
                        data={ProfilePicObj?.length > 0 ? ProfilePicObj : []}
                        keyExtractor={item => item?.id?.toString()}
                        numColumns={4}
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{
                          justifyContent: 'space-between',
                        }}
                        renderItem={({item}) => (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              style={[styles.mediaContainer]}
                              onPress={() => handleMediaSelect(item.id)}>
                              {/* Change the container to View */}
                              <View style={[styles.mediaImageContainer]}>
                                <ImageBackground
                                  source={item.icon}
                                  style={styles.mediaImage}
                                />
                              </View>
                              {selectedMedia === item.id && (
                                <View style={styles.selectIconContainer}>
                                  <Image
                                    style={styles.selectIcon}
                                    source={{uri: item?.uri}}
                                  />
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    )}
                  </View>
                </View>
              </ScrollView>

              {isPosting ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems:'center',
                    // marginHorizontal: normalize(20),
                    width: '80%',
                    // marginRight: 20,
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
                      Post
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.floatingButton1}
                    onPress={() => setIsPosting(false)}>
                    <Image
                      source={Icons.cross}
                      style={{width: normalize(15), height: normalize(15)}}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    // marginHorizontal: normalize(20),
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

                  {/* <TouchableOpacity style={styles.floatingButton1}>
                  <Image
                    source={Icons.cross}
                    style={{width: normalize(15), height: normalize(15)}}
                  />
                </TouchableOpacity> */}
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
                      toptext={'Scenario 1'}
                      placeholder={'Username'}
                      width="100%"
                      flag={4}
                      value={'Describe Scenario'}
                      // onChangeText={val => setusername(val)}
                      // onFocus={() => setusernamefocus(true)}
                      // onBlur={() => setusernamefocus(false)}
                      focus={usernamefocus}
                    />
                    <DropDownComponent
                      isrightimage={Icons.down}
                      toptext={'Scenario 2'}
                      placeholder={'Username'}
                      width="100%"
                      flag={4}
                      value={'Describe Scenario'}
                      // onChangeText={val => setusername(val)}
                      // onFocus={() => setusernamefocus(true)}
                      // onBlur={() => setusernamefocus(false)}
                      focus={usernamefocus}
                    />
                    <DropDownComponent
                      isrightimage={Icons.down}
                      toptext={'Scenario 3'}
                      placeholder={'Username'}
                      width="100%"
                      flag={6}
                      value={'Describe Scenario'}
                      // onChangeText={val => setusername(val)}
                      // onFocus={() => setusernamefocus(true)}
                      // onBlur={() => setusernamefocus(false)}
                      focus={usernamefocus}
                    />
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
                    {/* <DropDownComponent
                      isrightimage={Icons.down}
                      toptext={'Class of Year'}
                      placeholder={'Enter Class of Year'}
                      width="100%"
                      flag={2}
                      value={'Enter Class of Year'}
                      // onChangeText={val => setusername(val)}
                      // onFocus={() => setusernamefocus(true)}
                      // onBlur={() => setusernamefocus(false)}
                      focus={usernamefocus}
                    /> */}
                    <DropDownComponent
                      isrightimage={Icons.down}
                      toptext={'Major'}
                      placeholder={'Username'}
                      width="100%"
                      flag={2}
                      value={'Enter class of major domain'}
                      // onChangeText={val => setusername(val)}
                      // onFocus={() => setusernamefocus(true)}
                      // onBlur={() => setusernamefocus(false)}
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
                        // marginTop: normalize(5),
                        // bottom:normalize(15)
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
                        // style={{transform: [{scale: 0.8}]}}
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
                      {/* <View style={{ width:50, height: 30 }}>  */}
                      <Switch
                        trackColor={{
                          false: '#f4f3f4',
                          true: 'rgba(242,124,36,0.2)',
                        }}
                        thumbColor={isEnabled1 ? '#F27C24' : '#1F2440'}
                        ios_backgroundColor="#f4f3f4"
                        onValueChange={toggleSwitch1}
                        value={isEnabled1}
                        // style={{height:80,width:50}}
                        style={{transformX: [{scale: 1.2}]}}
                      />
                      {/* </View> */}
                    </View>
                    {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems:'center',
                    // marginHorizontal: normalize(20),
                    width: '80%',
                    // marginRight: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButtonForPoll}
                    onPress={() => setIsPosting(true)}>
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
                    onPress={() => setIsPosting(false)}>
                    <Image
                      source={Icons.cross}
                      style={{width: normalize(15), height: normalize(15)}}
                    />
                  </TouchableOpacity>
                </View> */}
                  </View>
                </ScrollView>
              )}
              {isPolling ? (
                <View
                  style={{
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    // alignItems:'center',
                    // marginHorizontal: normalize(20),
                    width: '100%',
                    // marginRight: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => {
                      setIsPolling(true);
                      handleTabPress('Friends');
                    }}>
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

                  {/* <TouchableOpacity
                    style={styles.floatingButton1}
                    onPress={() => setIsPosting(false)}>
                    <Image
                      source={Icons.cross}
                      style={{width: normalize(15), height: normalize(15)}}
                    />
                  </TouchableOpacity> */}
                </View>
              ) : (
                <View
                  style={{
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    // alignItems:'center',
                    // marginHorizontal: normalize(20),
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

                  {/* <TouchableOpacity
                  style={styles.floatingButton1}
                  onPress={() => setIsPosting(false)}>
                  <Image
                    source={Icons.cross}
                    style={{width: normalize(15), height: normalize(15)}}
                  />
                </TouchableOpacity> */}
                </View>
              )}
            </>
          )}
        </View>
      </View>
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
});
