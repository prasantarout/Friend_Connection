import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Pressable,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderSection from '../../components/HeaderSection';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import RoundProfileStatus from '../../components/RoundProfileStatus';
import LandingPage from '../../components/landingPage/LandingPage';
import normalize from '../../utils/helpers/dimen';
import {horizontalScale} from '../../utils/helpers/dimen1';
import EventComponent from '../../components/EventComp/EventComponent';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  getProfileRequest,
  getTokenRequest,
} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import HomeReducer, {getAllFeedRequest} from '../../redux/reducer/HomeReducer';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import {
  deletePollRequest,
  pollListRequest,
  pollOwnRequest,
  pollVoteRequest,
} from '../../redux/reducer/PollReducer';
import moment from 'moment';
import constants from '../../utils/helpers/constants';
import {tigerFriendSuggestionByProfileRequest} from '../../redux/reducer/FriendReducer';
import {
  DetailsHeaderScrollView,
  StickyHeaderScrollView,
  TabbedHeaderList,
  useStickyHeaderScrollProps,
} from 'react-native-sticky-parallax-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import connectionrequest from '../../utils/helpers/NetInfo';
import PopupMenu from '../../components/PopupMenu';

const Home = () => {
  const PostReducer = useSelector(state => state?.PostReducer);
  const PollReducer = useSelector(state => state?.PollReducer);
  const [rendering, setRendering] = useState(true);
  const [isPopupMenuVisible, setIsPopupMenuVisible] = useState(false);

  const [selectedButtonId, setSelectedButtonId] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 100;
  const isFocus = useIsFocused();
  const HomeReducer=useSelector(state=>state.HomeReducer);
  const AuthReducer=useSelector(state=>state.AuthReducer);

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

  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getProfileRequest());
      dispatch(
        getAllFeedRequest({
          page: 1,
          perpage: 100,
        }),
      );

      dispatch(
        tigerFriendSuggestionByProfileRequest({
          page: 1,
          perpage: 20,
        }),
      );
      dispatch(getTokenRequest());
    }, []),
  );

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp();
      },
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const status = PollReducer.status;
    switch (status) {
      case 'Poll/pollVoteSuccess':
        dispatch(
          pollListRequest({
            page: 1,
            perpage: 100,
            list_type: 'own',
          }),
        );
        dispatch(
          pollListRequest({
            page: 1,
            perpage: 100,
            list_type: 'others',
          }),
        );
        break;
    }
  }, [PollReducer.status]);

  const buttonArr = [
    {
      id: 1,
      title: 'Posts',
    },
    {
      id: 2,
      title: 'Polls',
    },
  ];

  // pop up menu delete functionality
  const handleMoreIconClick = () => {
    setIsPopupMenuVisible(!isPopupMenuVisible);
  };

  const handleEditOption = () => {
    setIsPopupMenuVisible(false);
  };

  const handleDeleteOption = deleteId => {
    setIsPopupMenuVisible(false);
    deletePoll(deleteId);
  };

  const handleClosePopupMenu = () => {
    setIsPopupMenuVisible(false);
  };

  const deletePoll = deleteId => {
    let obj = {
      poll_id: deleteId,
    };
    connectionrequest()
      .then(() => {
        dispatch(deletePollRequest(obj));
      })
      .catch(err => {
        console.log(err);
      });
  };
  let status = '';
  useEffect(() => {
    if (status == '' || PollReducer.status != status) {
      switch (PollReducer.status) {
        case 'Poll/deletePollRequest':
          status = PollReducer.status;
          break;
        case 'Poll/deletePollSuccess':
          status = PollReducer.status;
          dispatch(
            pollListRequest({
              page: 1,
              perpage: 100,
              list_type: 'others',
            }),
          );
          dispatch(
            pollOwnRequest({
              page: 1,
              perpage: 100,
              list_type: 'own',
            }),
          );
          break;
        case 'Poll/deletePollFailure':
          status = PollReducer.status;
          break;
      }
    }
  }, [PollReducer.status]);

  const renderPollItem = ({item}) => {
    const user_id = AuthReducer?.getProfileRes?.data?._id;
    const handlePollClick = pollScenarioId => {
      let obj = {
        poll_scenario_id: pollScenarioId,
        user_id: user_id,
      };
    
      dispatch(
        pollVoteRequest({
          poll_scenario_id: pollScenarioId,
          user_id: user_id,
        })
      );
    
      // Refresh the poll list after voting
      dispatch(
        pollListRequest({
          page: 1,
          perpage: 100,
          list_type: 'others',
        })
      );
      dispatch(
        pollOwnRequest({
          page: 1,
          perpage: 100,
          list_type: 'own',
        })
      );
    };
    

    return (
      <View style={styles.header}>
        <View style={[styles.icon_wrapper]}>
          <View key={item.id} style={styles.profileContainer}>
            <ImageBackground
              source={Icons.ellipse}
              style={styles.iconBackground}
            />
            <Image
              source={
                item?.user_details?.profile_image !== '' &&
                item?.user_details?.profile_image !== undefined &&
                item?.user_details?.profile_image !== null
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        'user/' +
                        item?.user_details?.profile_image,
                    }
                  : Icons.userProfile
              }
              style={styles.profilePicture}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>{item.user_details?.full_name}</Text>
            {/* <Text style={styles.status}>{item.user_details?.user_type}</Text> */}
          </View>
          <TouchableOpacity
            style={[styles.threeDotContainer, {right: 0, position: 'absolute'}]}
            onPress={handleMoreIconClick}>
            <Image
              source={Icons.more}
              style={styles.threeDotIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <PopupMenu
            visible={isPopupMenuVisible}
            onClose={handleClosePopupMenu}
            onEdit={handleEditOption}
            onDelete={() => handleDeleteOption(item?._id)
            }
            type="poll"
          />
        </View>
        <View>
          <Text style={styles.pollTitle}>{item.title}</Text>
          {item.scenario.map((_scenario, _index) => {
            // console.log( _scenario.voting_users,"Dasdaskjd");
            return (
              <TouchableOpacity
                style={[
                  styles.option,
                  _scenario.voting_users.includes(user_id)
                    ? {
                        borderColor: 'rgba(242,124,36,0.5)',
                        backgroundColor: Colors.lightOrange,
                      }
                    : {},
                ]}
                onPress={() => handlePollClick(_scenario?._id)}>
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>
                    {String.fromCharCode(65 + _index)}
                  </Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText} numberOfLines={1}>
                    {_scenario.scenario}
                  </Text>
                  {/* {_scenario.voting_users.includes(user_id) && ( */}
                  {/* <View> */}
                  <Text style={{color: '#999'}}>
                    {_scenario.total_vote} vote
                    {_scenario.total_vote > 1 && 's'}
                  </Text>
                  {/* </View> */}
                  {/* )} */}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPollItem1 = ({item}) => {
    const user_id = AuthReducer?.getProfileRes?.data?._id;

    const handlePollClick = pollScenarioId => {
      let obj = {
        poll_scenario_id: pollScenarioId,
        user_id: user_id,
      };

      // return
      dispatch(
        pollVoteRequest({
          poll_scenario_id: pollScenarioId,
          user_id: user_id,
        }),
      );
    };

    return (
      <View style={styles.header}>
        <View style={[styles.icon_wrapper]}>
          <View key={item.id} style={styles.profileContainer}>
            <ImageBackground
              source={Icons.ellipse}
              style={styles.iconBackground}
            />
            <Image
              source={
                item?.user_details?.profile_image !== '' &&
                item?.user_details?.profile_image !== undefined &&
                item?.user_details?.profile_image !== null
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        'user/' +
                        item?.user_details?.profile_image,
                    }
                  : Icons.userProfile
              }
              style={styles.profilePicture}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>{item.user_details?.full_name}</Text>
            {/* <Text style={styles.status}>{item.user_details?.user_type}</Text> */}
          </View>
          {/* <TouchableOpacity
            style={[
              styles.threeDotContainer,
              {right: 0, position: 'absolute'},
            ]}>
            <Image
              source={Icons.more}
              style={styles.threeDotIcon}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>
        <View>
          <Text style={styles.pollTitle}>{item.title}</Text>
          {item.scenario.map((_scenario, _index) => {
            // console.log( _scenario.voting_users,"Dasdaskjd");
            return (
              <TouchableOpacity
                style={[
                  styles.option,
                  _scenario.voting_users.includes(user_id)
                    ? {
                        borderColor: 'rgba(242,124,36,0.5)',
                        backgroundColor: Colors.lightOrange,
                      }
                    : {},
                ]}
                onPress={() => handlePollClick(_scenario?._id)}>
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>
                    {String.fromCharCode(65 + _index)}
                  </Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText} numberOfLines={1}>
                    {_scenario.scenario}
                  </Text>
                  {/* {_scenario.voting_users.includes(user_id) && ( */}
                  {/* <View> */}
                  <Text style={{color: '#999'}}>
                    {_scenario.total_vote} vote
                    {_scenario.total_vote > 1 && 's'}
                  </Text>
                  {/* </View> */}
                  {/* )} */}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}} edges={['top']}>
      <Loader visible={PostReducer?.status === 'Post/postListRequest'} />
      {/* <Loader visible={PollReducer?.status === 'Poll/pollVoteRequest'} /> */}
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderSection />
      <View
        style={{
          // flex: 1,
          // height: '100%',
          flex: 1,
          // paddingTop: normalize(15),
        }}>
        <StickyHeaderScrollView
          ref={scrollViewRef}
          containerStyle={{flexGrow: 1}}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          renderHeader={() => {
            return (
              <View
                style={{marginBottom: normalize(10), backgroundColor: '#fff'}}>
                <RoundProfileStatus />
              </View>
            );
          }}
          renderTabs={() => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                borderRadius: normalize(50),
                // '#F4F3F3'
                borderColor: 'rgba(242,124,36,0.2)',
                borderWidth: normalize(1),
                marginHorizontal: normalize(20),
                marginTop: normalize(5),
                backgroundColor: Colors.white,
              }}>
              {buttonArr.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSelectedButtonId(item.id);
                      scrollViewRef.current.scrollTo(0, 0);
                      if (item?.id === 2) {
                        dispatch(
                          pollListRequest({
                            page: 1,
                            perpage: 100,
                            list_type: 'others',
                          }),
                        );
                        dispatch(
                          pollOwnRequest({
                            page: 1,
                            perpage: 100,
                            list_type: 'own',
                          }),
                        );
                      }
                    }}
                    style={{
                      // height: normalize(35),
                      // width: normalize(109),
                      paddingVertical: normalize(8),
                      flex: 1,
                      backgroundColor:
                        selectedButtonId == item.id
                          ? 'rgba(242,124,36,0.2)'
                          : 'transparent',
                      borderRadius: normalize(50),
                      // marginRight: index == 1 ? 0 : normalize(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color:
                          selectedButtonId == item.id ? Colors.orange : '#666',
                        // : '#383A46',
                        fontSize: normalize(12),
                        fontFamily:
                          selectedButtonId == item.id
                            ? Fonts.OpenSans_Bold
                            : Fonts.OpenSans_SemiBold,
                      }}>
                      {item.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          showsVerticalScrollIndicator={false}
          style={{paddingBottom: 20}}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: normalize(15),
              // marginTop: normalize(10),
            }}></View>
          {selectedButtonId === 1 ? (
            <>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: horizontalScale(20),
                }}>
                <LandingPage />
              </View>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: horizontalScale(20),
                  marginBottom: normalize(20),
                }}>
                <EventComponent />
              </View>
            </>
          ) : (
            <View>
              <>
                <FlatList
                  data={
                    PollReducer?.myOwnPollListRequestRes?.data?.length > 0
                      ? PollReducer?.myOwnPollListRequestRes?.data
                      : []
                  }
                  renderItem={renderPollItem}
                  keyExtractor={item => item?._id}
                  style={{marginHorizontal: normalize(15)}}
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: normalize(20),
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(13),
                          fontFamily: Fonts.OpenSans_Light,
                          fontWeight: '500',
                          color: Colors.lightGrey,
                        }}>
                        You have't poll yet
                      </Text>
                    </View>
                  }
                  ListHeaderComponent={
                    <Text
                      style={{marginTop: normalize(20), color: Colors.black}}>
                      Your Polls
                    </Text>
                  }
                />
                <FlatList
                  data={
                    PollReducer?.pollListRequestRes?.data?.length > 0
                      ? PollReducer?.pollListRequestRes?.data
                      : []
                  }
                  renderItem={renderPollItem1}
                  keyExtractor={item => item?._id}
                  style={{marginHorizontal: normalize(15)}}
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: normalize(20),
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(13),
                          fontFamily: Fonts.OpenSans_Light,
                          fontWeight: '500',
                          color: Colors.lightGrey,
                        }}>
                        No poll found
                      </Text>
                    </View>
                  }
                  ListHeaderComponent={
                    <Text
                      style={{marginTop: normalize(20), color: Colors.black}}>
                      Others Polls
                    </Text>
                  }
                />
              </>
            </View>
          )}
        </StickyHeaderScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    marginVertical: normalize(10),
    padding: normalize(10),
    // marginHorizontal: normalize(5),
    borderColor: Colors.backgroundLight,
    borderWidth: normalize(1),
    borderRadius: normalize(10),
  },
  icon_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
    zIndex:99999
  },

  profileContainer: {
    alignItems: 'center',
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
  iconBackground: {
    height: normalize(32),
    width: normalize(32),
  },
  profilePicture: {
    height: normalize(28),
    width: normalize(28),
    position: 'absolute',
    top: normalize(2),

    borderRadius: normalize(25),
  },
  textWrapper: {
    marginLeft: normalize(10),
  },
  name: {
    fontSize: normalize(14),
    fontWeight: '600',
    lineHeight: normalize(14),
    color: '#1F2440',
  },
  status: {
    fontSize: normalize(11),
    color: 'gray',
  },
  threeDotIcon: {
    width: normalize(16),
    height: normalize(16),
  },
  pollTitle: {
    fontSize: normalize(16),
    marginBottom: normalize(20),
  },
  option: {
    flex: 1,
    borderColor: Colors.borderColor,
    borderWidth: normalize(1),
    borderRadius: normalize(20),
    padding: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(7),
  },
  optionNumber: {
    width: normalize(20),
    height: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.orange,
    borderWidth: normalize(1),
    borderRadius: normalize(50),
    backgroundColor: Colors.white,
    marginRight: normalize(10),
  },
  optionNumberText: {
    fontSize: normalize(12),
    marginLeft: normalize(1),
    marginTop: normalize(1),
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: normalize(10),
  },
  optionText: {
    fontSize: normalize(12),
    // flex: 1,
  },
});
