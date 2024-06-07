import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import HeaderSection from '../../components/HeaderSection';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import Modal from 'react-native-modal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  matchfriendlistRequest,
  matchrequestlistRequest,
  matchsuggestionlistRequest,
  tigermatchjoinRequest,
} from '../../redux/reducer/MatchReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import constants from '../../utils/helpers/constants';
import {ImageBackground} from 'react-native';
let status = '';
let status1 = '';
import Toast from '../../utils/helpers/Toast';
import Loader from '../../utils/helpers/Loader';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useStickyHeaderScrollProps} from 'react-native-sticky-parallax-header';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const TigerMatch = () => {
  const navigation = useNavigation();
  const [focused, setIsFocus] = useState(true);
  const [activeTab, setActiveTab] = useState('Suggestion');
  const [modalVisible, setModalVisible] = useState(true);
  const [activeTab1, setActiveTab1] = useState('male');
  const [profileModal, setProfileModal] = useState(false);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const MatchReducer = useSelector(state => state.MatchReducer);
  const [loading, setloading] = useState(false);
  // const [page,setpage]=useState(1)
  // const  = useSelector(state => state.);
  const handleTabPress1 = tab => {
    setActiveTab1(tab);
  };
  const [confirm, setConfirm] = useState(true);
  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  const [suggestionmatch, setsuggestionmatch] = useState([]);
  const [matchList, setmatchList] = useState([]);
  const [pendingmatchlist, setpendingmatchlist] = useState([]);

  const {width: windowWidth} = useWindowDimensions();
  const {
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    scrollHeight,
    scrollValue,
    scrollViewRef,
    // useStickyHeaderScrollProps is generic and need to know
    // which component (ScrollView, FlatList<ItemT> or SectionList<ItemT, SectionT>)
    // will be enhanced with sticky scroll props
  } = useStickyHeaderScrollProps({
    parallaxHeight: 20,
    snapStartThreshold: 50,
    snapStopThreshold: 100,
    snapToEdge: true,
  });

  function matchlistrequest(page) {
    // tigerFriendListingRequest
    let data = {
      search: '',
      page: page,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(matchfriendlistRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }
  function matchpendinglist(page) {
    let data = {
      search: '',
      page: page,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(matchrequestlistRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }
  function matchSugesstionlist(page) {
    let data = {
      search: '',
      page: page,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(matchsuggestionlistRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }
  if (status == '' || MatchReducer.status != status) {
    switch (MatchReducer.status) {
      case 'Match/matchsuggestionlistRequest':
        status = MatchReducer.status;
        break;
      case 'Match/matchsuggestionlistSuccess':
        status = MatchReducer.status;
        // console.log(MatchReducer?.matchsuggestionlistResponse);
        if (MatchReducer?.matchsuggestionlistResponse?.page == 1) {
          setsuggestionmatch(MatchReducer?.matchsuggestionlistResponse?.data);
        } else {
          setsuggestionmatch([
            ...suggestionmatch,
            ...MatchReducer?.matchsuggestionlistResponse?.data,
          ]);
        }

        // setsuggestionfriend(MatchReducer?.frindSuggestionByProfileRes?.data);
        break;
      case 'Match/matchsuggestionlistFailure':
        status = MatchReducer.status;
        break;

      case 'Match/matchrequestlistRequest':
        status = MatchReducer.status;
        break;
      case 'Match/matchrequestlistSuccess':
        status = MatchReducer.status;
        // console.log(MatchReducer?.matchrequestlistResponse);
        if (MatchReducer?.matchrequestlistResponse?.page == 1) {
          setpendingmatchlist(MatchReducer?.matchrequestlistResponse?.data);
        } else {
          setpendingmatchlist([
            ...pendingmatchlist,
            ...MatchReducer?.matchrequestlistResponse?.data,
          ]);
        }

        break;
      case 'Match/matchrequestlistFailure':
        status = MatchReducer.status;
        break;

      case 'Match/matchfriendlistRequest':
        status = MatchReducer.status;
        break;
      case 'Match/matchfriendlistSuccess':
        status = MatchReducer.status;
        // console.log(MatchReducer?.matchfriendlistResponse);
        if (MatchReducer?.matchfriendlistResponse?.page == 1) {
          setmatchList(MatchReducer?.matchfriendlistResponse?.data);
        } else {
          setmatchList([
            ...matchList,
            ...MatchReducer?.matchfriendlistResponse?.data,
          ]);
        }

        break;
      case 'Match/matchfriendlistFailure':
        status = MatchReducer.status;
        break;

      case 'Match/tigermatchjoinRequest':
        status = MatchReducer.status;
        setloading(true);
        break;
      case 'Match/tigermatchjoinSuccess':
        status = MatchReducer.status;
        dispatch(getProfileRequest());
        // setFriendList(MatchReducer?.friendListingRes?.data);
        break;
      case 'Match/tigermatchjoinFailure':
        status = MatchReducer.status;
        break;
      // case 'Match/tigerFriendListingRequest':
      //   status = MatchReducer.status;
      //   break;
      // case 'Match/tigerFriendListingSuccess':
      //   status = MatchReducer.status;
      //   // setFriendList(MatchReducer?.friendListingRes?.data);
      //   break;
      // case 'Match/tigerFriendListingFailure':
      //   status = MatchReducer.status;
      //   break;

      // case 'Match/tigerFriedListingRequest':
      //   status = MatchReducer.status;
      //   break;
      // case 'Match/tigerFriedListingSuccess':
      //   status = MatchReducer.status;
      //   // console.log(MatchReducer?.friendRequestListingRes?.data);
      //   // setpendingfriendlist(MatchReducer?.friendRequestListingRes?.data);
      //   break;
      // case 'Match/tigerFriedListingFailure':
      //   status = MatchReducer.status;
      //   break;
    }
  }
  if (status1 == '' || AuthReducer.status != status1) {
    switch (AuthReducer.status) {
      case 'Auth/getProfileRequest':
        status1 = AuthReducer.status;
        break;
      case 'Auth/getProfileSuccess':
        status1 = AuthReducer.status;
        setConfirm(true);
        setModalVisible(false);
        setloading(false);
        // dispatch(getProfileRequest());
        // props.navigation?.navigate('MyProfile');
        break;
      case 'Auth/getProfileFailure':
        status1 = AuthReducer.status;
        break;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      matchSugesstionlist(1);
      matchpendinglist(1);
      matchlistrequest(1);
      // friendSugesstionlist();
      // friendlistrequest();
      // friendpendinglist();
    }, []),
  );

  function tigermatchjoinfunction() {
    let data = {
      user_id: AuthReducer?.getProfileRes?.data?._id,
      gender: activeTab1,
    };
    connectionrequest()
      .then(() => {
        // console.log(data);
        dispatch(tigermatchjoinRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
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

  const RenderProfile = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={profileModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setProfileModal(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderTopRightRadius: normalize(20),
            borderTopLeftRadius: normalize(20),
            paddingVertical: normalize(10),
            alignItems: 'center',
            height: normalize(350),
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}></View>
      </Modal>
    );
  };

  function onENdFunction() {
    console.log('hihiih');
    activeTab === 'Suggestion'
      ? matchSugesstionlist(MatchReducer?.matchsuggestionlistResponse?.page + 1)
      : activeTab === 'matches'
        ? matchlistrequest(MatchReducer?.matchfriendlistResponse?.page + 1)
        : matchpendinglist(MatchReducer?.matchrequestlistResponse?.page + 1);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}} edges={['top']}>
      {/* <Loader /> */}
      <Loader
        visible={
          MatchReducer?.status == 'Match/matchsuggestionlistRequest' ||
          MatchReducer?.status == 'Match/tigermatchjoinRequest' ||
          AuthReducer.status === 'Auth/getProfileRequest' ||
          loading
        }
      />
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {AuthReducer?.getProfileRes?.data?.is_join_match ? (
        <>
          <HeaderSection />
          <View style={{height: '100%', flex: 4}}>
            <View
              style={{
                marginHorizontal: normalize(20),
                paddingTop: normalize(10),
              }}>
              <Text
                style={{
                  fontSize: normalize(14),
                  color: '#1F2440',
                  fontWeight: '600',
                  fontFamily: Fonts.OpenSans_Medium,
                  lineHeight: normalize(21.79),
                }}>
                Tiger Matches
              </Text>
              <View style={{flexDirection: 'row', marginTop: normalize(12)}}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor:
                        activeTab === 'Suggestion'
                          ? 'rgba(242,124,36,0.2)'
                          : Colors.white,
                    },
                  ]}
                  onPress={() => {
                    handleTabPress('Suggestion'), matchSugesstionlist(1);
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '500',
                      lineHeight: normalize(19.07),
                      color: activeTab === 'Suggestion' ? '#F27C24' : '#292D32',
                    }}>
                    Suggestion
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor:
                        activeTab === 'matches'
                          ? 'rgba(242,124,36,0.2)'
                          : Colors.white,
                      marginLeft: normalize(8),
                    },
                  ]}
                  onPress={() => {
                    handleTabPress('matches'), matchlistrequest(1);
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '500',
                      lineHeight: normalize(19.07),
                      color: activeTab === 'matches' ? '#F27C24' : '#292D32',
                    }}>
                    Matches
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor:
                        activeTab === 'requests'
                          ? 'rgba(242,124,36,0.2)'
                          : Colors.white,
                      marginLeft: normalize(8),
                    },
                  ]}
                  onPress={() => {
                    handleTabPress('requests'), matchpendinglist(1);
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '500',
                      lineHeight: normalize(19.07),
                      color: activeTab === 'requests' ? '#F27C24' : '#383A46', // Change color for 'Matches' text in 'Requests' tab
                    }}>
                    Requests
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#F4F3F3',
              borderRadius: 15,
              overflow: 'hidden',
              marginTop: normalize(15),
            }}>
            <TextInput
              style={{
                flex: 1,
                padding: normalize(15),
                fontSize: normalize(14),
              }}
              placeholder="Search"
            />
            <Image
              source={Icons.search}
              style={{
                height: normalize(25),
                width: normalize(25),
                marginRight: normalize(10),
              }}
            />
          </View> */}
              <View style={{marginTop: normalize(10)}}>
                {activeTab === 'Suggestion' && (
                  <FlatList
                    ListEmptyComponent={() => (
                      <Text style={styles.noData}>No Data found</Text>
                    )}
                    data={suggestionmatch}
                    // keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{
                      justifyContent: 'space-between',
                    }}
                    onEndReached={() => {
                      MatchReducer.status !=
                        'Match/matchsuggestionlistRequest' &&
                        MatchReducer?.matchsuggestionlistResponse?.page <
                          MatchReducer?.matchsuggestionlistResponse?.pages &&
                        //  setpage(page+1),
                        onENdFunction();
                    }}
                    renderItem={({item, index}) => (
                      <View
                        // key={index}
                        style={{
                          paddingVertical: normalize(5),
                          width: '48%',
                          marginBottom: normalize(10),
                          position: 'relative',
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.friendContainer,
                            {
                              marginTop: 0,
                            },
                          ]}
                          onPress={() => {
                            navigation.navigate('TigerMatchProfile', {
                              id: item?._id,
                              data: suggestionmatch,
                              in: index,
                            });
                          }}>
                          <Image
                            source={
                              item?.profile_image == ''
                                ? Icons.usernoimage
                                : {
                                    uri:
                                      constants?.IMAGE_URL +
                                      'user/' +
                                      item?.profile_image,
                                  }
                            }
                            style={[
                              styles.friendImage,
                              {
                                resizeMode:
                                  item?.profile_image == ''
                                    ? 'contain'
                                    : 'stretch',
                              },
                            ]}
                          />
                          <LinearGradient
                            colors={['transparent', '#00000060']}
                            start={{x: 0.5, y: 0}}
                            end={{x: 0.5, y: 1}}
                            // locations={[0, 1]}
                            // useAngle
                            style={styles.infoContainer}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: normalize(14),
                                fontWeight: '700',
                                lineHeight: normalize(19.07),
                                fontFamily: Fonts.OpenSans_Light,
                                // color: '#1F2440',
                                color: Colors.white,
                                maxWidth: '90%',
                              }}>
                              {item?.first_name + ' ' + item?.last_name}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: normalize(11),
                                fontWeight: '400',
                                lineHeight: normalize(13.62),
                                fontFamily: Fonts.OpenSans_Medium,
                                // color: '#1F2440',
                                color: Colors.white,
                                maxWidth: '90%',
                                marginTop: normalize(3),
                              }}>
                              {/* {item?.is_studying_in_the_university == 'Yes'
                                ? 'Current student'
                                : ''} */}
                              {`Class of ${item?.graduation_date}`}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
                {activeTab === 'matches' && (
                  <FlatList
                    data={matchList}
                    ListEmptyComponent={() => (
                      <Text style={styles.noData}>No Data found</Text>
                    )}
                    // keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => {
                      MatchReducer.status != 'Match/matchfriendlistRequest' &&
                        MatchReducer?.matchfriendlistResponse?.page <
                          MatchReducer?.matchfriendlistResponse?.pages &&
                        //  setpage(page+1),
                        onENdFunction();
                    }}
                    columnWrapperStyle={{
                      justifyContent: 'space-between',
                    }}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.friendContainer}
                        // onPress={() =>
                        //   navigation.navigate('TigerMatchProfile')
                        // }
                        onPress={() => {
                          navigation.navigate('TigerMatchProfile', {
                            id: item?._id,
                            data: matchList,
                            in: index,
                          });
                        }}>
                        <Image
                          source={
                            item?.profile_image == ''
                              ? Icons.usernoimage
                              : {
                                  uri:
                                    constants?.IMAGE_URL +
                                    'user/' +
                                    item?.profile_image,
                                }
                          }
                          style={[
                            styles.friendImage,
                            {
                              resizeMode:
                                item?.profile_image == ''
                                  ? 'contain'
                                  : 'stretch',
                            },
                          ]}
                        />
                        {/* <View
                          style={[
                            styles.boxContainer,
                            {backgroundColor: '#64B956'},
                          ]}>
                          <TouchableOpacity>
                            <Image
                              source={Icons.wish}
                              style={{
                                width: normalize(12),
                                height: normalize(12),
                              }}
                            />
                          </TouchableOpacity>
                        </View> */}
                        <View style={styles.infoContainer}>
                          <Text style={styles.friendName}>
                            {item?.first_name + ' ' + item?.last_name}
                          </Text>
                          <Text style={styles.friendStatus}>
                            {/* {item?.is_studying_in_the_university == 'Yes'
                              ? 'Current student'
                              : ''} */}
                            {`Class of ${item?.graduation_date}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
              {activeTab === 'requests' && (
                <FlatList
                  data={pendingmatchlist}
                  ListEmptyComponent={() => (
                    <Text style={styles.noData}>No Data found</Text>
                  )}
                  // keyExtractor={item => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.scrollViewContent}
                  showsVerticalScrollIndicator={false}
                  onEndReached={() => {
                    MatchReducer.status != 'Match/matchrequestlistRequest' &&
                      MatchReducer?.matchrequestlistResponse?.page <
                        MatchReducer?.matchrequestlistResponse?.pages &&
                      //  setpage(page+1),
                      onENdFunction();
                  }}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  renderItem={({item, index}) => (
                    <View
                      // key={index}
                      style={{
                        paddingVertical: normalize(5),
                        width: '48%',
                        marginBottom: normalize(10),
                      }}>
                      <TouchableOpacity
                        style={[
                          styles.friendContainer,
                          {
                            marginTop: 0,
                          },
                        ]}
                        // onPress={() => {
                        //   navigation.navigate('FriendProfileDetails', {
                        //     id: item?.user_details?._id
                        //   });
                        // }
                        onPress={() => {
                          navigation.navigate('TigerMatchProfile', {
                            id: item?._id,
                            data: pendingmatchlist,
                            in: index,
                          });
                        }}>
                        <Image
                          source={
                            item?.profile_image == ''
                              ? Icons.usernoimage
                              : {
                                  uri:
                                    constants?.IMAGE_URL +
                                    'user/' +
                                    item?.profile_image,
                                }
                          }
                          style={[
                            styles.friendImage,
                            {
                              resizeMode:
                                item?.profile_image == ''
                                  ? 'contain'
                                  : 'stretch',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <View style={{marginTop: 10}}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(14),
                            fontWeight: '700',
                            lineHeight: normalize(19.07),
                            fontFamily: Fonts.OpenSans_Light,
                            color: '#1F2440',
                            maxWidth: '90%',
                          }}>
                          {item?.first_name + ' ' + item?.last_name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(11),
                            fontWeight: '400',
                            lineHeight: normalize(13.62),
                            fontFamily: Fonts.OpenSans_Medium,
                            color: '#1F2440',
                            maxWidth: '90%',
                          }}>
                          Student of {item?.degree_start_date},{' '}
                          {item?.degree?.title} in{' '}
                          {item?.education_stream?.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: normalize(10),
                            fontWeight: '400',
                            lineHeight: normalize(13.62),
                            fontFamily: Fonts.OpenSans_Light,
                            color: '#1F2440',
                          }}>
                          {item?.phone}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </>
      ) : (
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating={true}
          isVisible={true}
          style={{width: '100%', alignSelf: 'center', margin: 0}}
          animationInTiming={800}
          animationOutTiming={1000}
          onBackdropPress={() => {
            // setModalVisible(false), setConfirm(true);
          }}>
          <View
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
              alignItems: 'center',
              height: normalize(350),
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            {confirm !== false ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  source={Icons.right}
                  style={{
                    width: normalize(50),
                    height: normalize(50),
                    resizeMode: 'contain',
                  }}
                />
                <View style={{width: '49%', marginVertical: 20}}>
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontFamily: Fonts?.Poppins_Medium,
                      color: ' rgba(31, 36, 64, 1)',
                      textAlign: 'center',
                    }}>
                    Do You Want To {''}
                    <Text
                      style={{
                        fontSize: normalize(15),
                        fontFamily: Fonts?.Poppins_Medium,
                        color: ' rgba(242, 124, 36, 1)',
                        textAlign: 'center',
                      }}>
                      Join Tiger Match
                    </Text>
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: normalize(13),
                    fontFamily: Fonts?.OpenSans_Medium,
                    color: ' rgba(56, 58, 70, 1)',
                    textAlign: 'center',
                    fontWeight: '400',
                    lineHeight: normalize(18),
                    maxWidth: '80%',
                  }}>
                  {/* Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. */}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 0.9,
                }}>
                <View style={{width: '49%', marginVertical: 20}}>
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontFamily: Fonts?.Poppins_Medium,
                      color: ' rgba(31, 36, 64, 1)',
                      textAlign: 'center',
                      textTransform: 'capitalize',
                    }}>
                    select{' '}
                    <Text
                      style={{
                        fontSize: normalize(14),
                        fontFamily: Fonts?.Poppins_Medium,
                        color: ' rgba(242, 124, 36, 1)',
                        textAlign: 'center',
                        textTransform: 'capitalize',
                      }}>
                      Gender
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    marginLeft: normalize(15),
                  }}>
                  <TouchableOpacity
                    style={{
                      marginRight: 20,
                      height: normalize(120),
                      paddingHorizontal: 20,
                      width: normalize(100),
                      backgroundColor:
                        activeTab1 === 'male'
                          ? 'rgba(242,124,36,0.1)'
                          : 'transparent',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleTabPress1('male')}>
                    <Image
                      source={Icons.female}
                      style={{
                        width: normalize(40),
                        height: normalize(40),
                        tintColor: activeTab1 === 'male' ? '#F27C24' : 'black',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          activeTab1 === 'male'
                            ? '#F27C24'
                            : 'rgba(56, 58, 70, 1)',
                        textTransform: 'capitalize',
                        fontFamily: Fonts.OpenSans_Medium,
                      }}>
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginRight: 20,
                      height: normalize(120),
                      paddingHorizontal: 20,
                      width: normalize(100),
                      backgroundColor:
                        activeTab1 === 'female'
                          ? 'rgba(242,124,36,0.2)'
                          : 'transparent',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleTabPress1('female')}>
                    <Image
                      source={Icons.male}
                      style={{
                        width: normalize(40),
                        height: normalize(40),
                        tintColor:
                          activeTab1 === 'female' ? '#F27C24' : 'black',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          activeTab1 === 'female'
                            ? '#F27C24'
                            : 'rgba(56, 58, 70, 1)',
                        textTransform: 'capitalize',
                        fontFamily: Fonts.OpenSans_Medium,
                      }}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: normalize(20),
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (confirm == false) {
                    tigermatchjoinfunction();
                    // navigation.navigate('TigerMatchProfile')
                  } else {
                    setConfirm(false);
                  }
                }}
                activeOpacity={0.1}
                style={{
                  width: '65%',
                  height: normalize(45),
                  alignSelf: 'center',
                  marginTop: normalize(10),
                  marginBottom: normalize(10),
                  backgroundColor: 'rgba(242, 124, 36, 1)',
                  borderRadius: normalize(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(18),
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  {confirm !== false ? 'Confirm' : 'Continue'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate('Home');
                }}
                activeOpacity={0.1}
                style={{
                  width: '20%',
                  height: normalize(45),
                  alignSelf: 'center',
                  marginLeft: normalize(15),
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
        </Modal>
      )}
      {/* {RenderButton()} */}
      {/* {RenderProfile()} */}
    </SafeAreaView>
  );
};

export default TigerMatch;

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
  friendContainer: {
    width: (Dimensions.get('window').width - normalize(50)) / 2, // Calculate width based on screen width and margin
    alignItems: 'center',
    // marginHorizontal: normalize(10),
    marginTop: normalize(15),
    aspectRatio: 4 / 5,
  },
  friendImage: {
    width: '100%', // Make the image take the full width of the container
    // height: normalize(120),
    flex: 1,
    // resizeMode: 'cover',
    borderRadius: normalize(10),
    // marginLeft:10
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0,0,0,0.20)',
    padding: normalize(12),
    paddingBottom: normalize(10),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    // marginLeft: normalize(8),
    height: '55%',
    justifyContent: 'flex-end',
    bottom: normalize(5),
  },
  friendName: {
    fontSize: normalize(14),
    fontWeight: '700',
    lineHeight: normalize(19.07),
    fontFamily: Fonts.OpenSans_Light,
    // color: '#1F2440',
    color: Colors.white,
    maxWidth: '90%',
  },
  friendStatus: {
    color: 'white',
    fontSize: normalize(10),
    fontWeight: '400',
  },
  scrollViewContent: {
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingBottom: 250,
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    padding: normalize(5),
    borderRadius: normalize(5),
  },
  boxIcon: {
    width: normalize(20),
    height: normalize(20),
  },
  noData: {
    marginTop: '50%',
    textAlign: 'center',
    fontSize: normalize(14),
    fontWeight: '700',
    fontFamily: Fonts.OpenSans_Light,
    color: Colors.lightGrey,
  },
});
