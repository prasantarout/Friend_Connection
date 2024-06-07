import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import HeaderSection from '../../components/HeaderSection';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import Modal from 'react-native-modal';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import {
  tigerFriedListingRequest,
  tigerFriendListingRequest,
  tigerFriendSuggestionByProfileRequest,
} from '../../redux/reducer/FriendReducer';
import Loader from '../../utils/helpers/Loader';
let status = '';
import Toast from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import FriendCard from '../../components/FriendCard';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const Friend = props => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const FriendReducer = useSelector(state => state.FriendReducer);
  const [activeTab, setActiveTab] = useState('Suggestion');

  const [suggestionfriend, setsuggestionfriend] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [pendingfriendlist, setpendingfriendlist] = useState([]);
  const [search, setsearch] = useState('');

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

  if (status == '' || FriendReducer.status != status) {
    switch (FriendReducer.status) {
      case 'Friend/tigerFriendSuggestionByProfileRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriendSuggestionByProfileSuccess':
        status = FriendReducer.status;
        setsuggestionfriend(FriendReducer?.frindSuggestionByProfileRes?.data);
        break;
      case 'Friend/tigerFriendSuggestionByProfileFailure':
        status = FriendReducer.status;
        break;

      case 'Friend/tigerFriendListingRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriendListingSuccess':
        status = FriendReducer.status;
        setFriendList(FriendReducer?.friendListingRes?.data);
        break;
      case 'Friend/tigerFriendListingFailure':
        status = FriendReducer.status;
        break;

      case 'Friend/tigerFriedListingRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriedListingSuccess':
        status = FriendReducer.status;
        // console.log(FriendReducer?.friendRequestListingRes?.data);
        // console.log(FriendReducer?.friendRequestListingRes?.data, 'requestsss');
        setpendingfriendlist(FriendReducer?.friendRequestListingRes?.data);
        break;
      case 'Friend/tigerFriedListingFailure':
        status = FriendReducer.status;
        break;
    }
  }
  function friendlistrequest(val) {
    // tigerFriendListingRequest
    let data = {
      search: val,
      page: 1,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(tigerFriendListingRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  function friendpendinglist(val) {
    let data = {
      search: val,
      page: 1,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(tigerFriedListingRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }
  function friendSugesstionlist(val) {
    let data = {
      search: val,
      page: 1,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(tigerFriendSuggestionByProfileRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }
  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  useFocusEffect(
    React.useCallback(() => {
      friendSugesstionlist('');
      friendlistrequest('');
      friendpendinglist('');
      setsearch('');
    }, []),
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.white}}
      edges={['top', 'bottom']}>
      <Loader
        visible={
          FriendReducer?.status ==
            'Friend/tigerFriendSuggestionByProfileRequest' ||
          FriendReducer?.status == 'Friend/tigerFriendListingRequest'
        }
      />
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <HeaderSection />
        <View style={{height: '100%', flex: 4, paddingTop: normalize(20)}}>
          <View style={{marginHorizontal: normalize(20)}}>
            <Text
              style={{
                fontSize: normalize(14),
                color: '#1F2440',
                fontWeight: '700',
                fontFamily: Fonts.OpenSans_Medium,
                lineHeight: normalize(21.79),
              }}>
              Friends
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
                  handleTabPress('Suggestion'),
                    setsearch(''),
                    friendSugesstionlist('');
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '400',
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
                      activeTab === 'Friends'
                        ? 'rgba(242,124,36,0.2)'
                        : Colors.white,
                  },
                ]}
                onPress={() => {
                  handleTabPress('Friends'),
                    setsearch(''),
                    friendlistrequest('');
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '400',
                    lineHeight: normalize(19.07),
                    color: activeTab === 'Friends' ? '#F27C24' : '#292D32',
                  }}>
                  Friends
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
                  },
                ]}
                onPress={() => {
                  handleTabPress('requests'),
                    setsearch(''),
                    friendpendinglist('');
                }}>
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: '400',
                    lineHeight: normalize(19.07),
                    color: activeTab === 'requests' ? '#F27C24' : '#383A46', // Change color for 'Matches' text in 'Requests' tab
                  }}>
                  Requests
                </Text>
              </TouchableOpacity>
            </View>
            <View
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
                  color: '#000000',
                }}
                placeholder="Search"
                placeholderTextColor={'#A0A0A0'}
                value={search}
                onChangeText={val => setsearch(val)}
              />
              <TouchableOpacity
                onPress={() =>
                  activeTab == 'Suggestion'
                    ? friendSugesstionlist(search)
                    : activeTab == 'Friends'
                      ? friendlistrequest(search)
                      : friendpendinglist(search)
                }
                style={{marginRight: normalize(10)}}>
                <Image
                  source={Icons.search}
                  style={{
                    height: normalize(25),
                    width: normalize(25),
                  }}
                />
              </TouchableOpacity>
            </View>
            {activeTab === 'Suggestion' && (
              <FlatList
                data={suggestionfriend}
                // data={suggestedFriend}
                ListEmptyComponent={() => (
                  <Text style={styles.noData}>No Data found</Text>
                )}
                numColumns={2}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                renderItem={({item, index}) => (
                  <FriendCard type="Suggestion" item={item} index={index} />
                )}
              />
            )}
            {activeTab === 'Friends' && (
              <FlatList
                ListEmptyComponent={() => (
                  <Text style={styles.noData}>No Data found</Text>
                )}
                data={friendList}
                numColumns={2}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                renderItem={({item, index}) => (
                  // <FriendCard type="Friends" item={item} index={index} />
                  <FriendCard
                    type="Friends"
                    item={item?.friend_details}
                    index={index}
                  />
                )}
              />
            )}
            {activeTab === 'requests' && (
              <FlatList
                ListEmptyComponent={() => (
                  <Text style={styles.noData}>No Data found</Text>
                )}
                data={pendingfriendlist}
                numColumns={2}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                renderItem={({item, index}) => (
                  <FriendCard
                    type={'requests'}
                    item={item?.user_details}
                    index={index}
                  />
                )}
              />
            )}
          </View>
        </View>
        {/* {RenderButton()}
        {RenderProfile()} */}
      </View>
    </SafeAreaView>
  );
};

export default Friend;

const styles = StyleSheet.create({
  tabButton: {
    padding: normalize(10),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(40),
    borderColor: '#F4F3F3',
    backgroundColor: Colors.white,
    marginRight: normalize(10),
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',

    // Adjust the margin as needed
  },
  friendContainer: {
    width: (Dimensions.get('window').width - normalize(50)) / 2, // Calculate width based on screen width and margin
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
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor: 'rgba(0,0,0,0.08)',
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
