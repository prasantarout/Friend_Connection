import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Colors} from '../../themes/Colors';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import Modal from 'react-native-modal';
import ButtonCom from '../../components/ButtonCom';
import TextInputItem from '../../components/TextInput';
import EventComponent from '../../components/EventComp/EventComponent';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  EventDetailsRequest,
  EventEnrolmentRequest,
  RelatedEventRequest,
} from '../../redux/reducer/EventReducer';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
import HtmlTextComponent from '../../components/HtmlTextComponent';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helpers/Loader';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterContainer,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getChatListRequest} from '../../redux/reducer/MessagingReducer';
import socketService from '../../utils/helpers/socketService';

const {width} = Dimensions.get('window');

export default function EventDetails(props) {
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const EventReducer = useSelector(state => state?.EventReducer);
  const AuthReducer = useSelector(state => state?.AuthReducer);
  const MessagingReducer = useSelector(state => state?.MessagingReducer);
  const socket = socketService(AuthReducer.getTokenResponse);

  const scrollViewRef = useRef(null);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const [isTextInputFocus, setIsTextInputFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [shareList, setShareList] = useState([]);
  const [activeBottomSheetIndex, setActiveBottomSheetIndex] = useState(-1);

  const bottomSheetFooter = props => {
    return (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: normalize(30),
            paddingVertical: normalize(10),
            paddingBottom: normalize(24),
            borderTopWidth: normalize(1),
            borderTopColor: Colors.borderColor,
            backgroundColor: Colors.white,
          }}>
          <TouchableOpacity
            style={{
              paddingVertical: normalize(10),
              flex: 1,
              borderRadius: normalize(10),
              backgroundColor: Colors.orange,
            }}
            onPress={() => bottomSheetRef.current.close()}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.OpenSans_SemiBold,
                textAlign: 'center',
                fontSize: normalize(14),
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    );
  };

  const friendItem = ({item}) => {
    const current_user_id = AuthReducer.getProfileRes?.data?._id;

    const friend = item.users.filter(_user => _user._id !== current_user_id)[0];
    return (
      <View style={styles.friend_container}>
        <View style={styles.friend_image_container}>
          <Image
            source={
              !friend?.profile_image
                ? Icons.usernoimage
                : {
                    uri: constants?.IMAGE_URL + 'user/' + friend?.profile_image,
                  }
            }
            style={styles.friend_image}
          />
        </View>
        <Text style={styles.friend_name}>{friend?.full_name}</Text>
        <TouchableOpacity
          style={
            shareList.includes(friend?._id)
              ? styles.send_button_outline
              : styles.send_button_active
          }
          onPress={() => {
            if (!shareList.includes(friend?._id)) {
              socket.emit('send:message', {
                room_id: item.room_id,
                sender_id: current_user_id,
                event_id: EventReducer?.eventDetailsRes?.data?._id,
                chat_type: 'Event',
              });
              setShareList(prev => [...prev, friend?._id]);
            }
          }}
          disabled={shareList.includes(friend?._id)}>
          <Text
            style={
              shareList.includes(friend?._id)
                ? styles.send_button_text
                : styles.send_button_text_active
            }>
            {shareList.includes(friend?._id) ? 'Sent' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // console.log(EventReducer?.eventDetailsRes?.data[0], 'dsaevent');

  useEffect(() => {
    dispatch(getProfileRequest());
    scrollViewRef.current.scrollTo(0, 0);
  }, [isFocus, EventReducer]);

  useEffect(() => {
    let data = {
      search: searchValue,
    };
    dispatch(getChatListRequest(data));
  }, [searchValue]);


  function EnrollEvent() {
    let obj = {
      user_id: AuthReducer?.getProfileRes?.data?._id,
      event_id: EventReducer?.eventDetailsRes?.data?._id,
    };
    // console.log(obj,"dsakjd");
    // return
    dispatch(EventEnrolmentRequest(obj));
  }

  let status = '';
  if (status == '' || EventReducer.status != status) {
    switch (EventReducer.status) {
      case 'Event/EventEnrolmentRequest':
        status = EventReducer.status;
        break;
      case 'Event/EventEnrolmentSuccess':
        status = EventReducer.status;
        props?.navigation?.navigate('Event');
        break;
      case 'Event/EventEnrolmentFailure':
        status = EventReducer.status;
        break;
      case 'Messaging/getChatListRequest':
        status = MessagingReducer.status;
        break;
      case 'Messaging/getChatListSuccess':
        status = MessagingReducer.status;
        break;
      case 'Messaging/getChatListFailure':
        status = MessagingReducer.status;
        break;
    }
  }

  console.log(EventReducer?.eventDetailsRes?.data, 'response');

  const totalMembers =
    EventReducer?.eventDetailsRes?.data?.enrolledUser?.length;
  console.log(totalMembers, 'totalMembers');
  const users = EventReducer?.eventDetailsRes?.data?.enrolledUser.map(
    member => ({
      name: member?.user_details?.full_name || 'Unknown',
      image: member?.user_details?.profile_image || '',
    }),
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundorange}}
      edges={['top']}>
      <StatusBar
        translucent
        backgroundColor={'black'}
        barStyle={'light-content'}
      />
      <Loader
        visible={
          EventReducer?.status === 'Event/EventEnrolmentRequest' ||
          EventReducer?.status === 'Event/RelatedEventRequest'
        }
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{paddingBottom: normalize(15)}}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}>
        <ImageBackground
          source={
            EventReducer?.eventDetailsRes?.data &&
            EventReducer?.eventDetailsRes?.data?.event_image !== ''
              ? {
                  uri:
                    constants.IMAGE_URL +
                    'event/' +
                    EventReducer?.eventDetailsRes?.data?.event_image,
                }
              : Icons?.noImage
          }
          resizeMode="cover"
          borderBottomLeftRadius={15}
          borderBottomRightRadius={15}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.55,

            paddingHorizontal: normalize(15),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(50),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
              style={{
                height: normalize(23),
                width: normalize(23),
                backgroundColor: 'rgba(242,124,36,0.2)',
                borderRadius: normalize(7),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Icons.rightBack}
                style={{height: '40%', width: '40%', resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View
          style={{marginHorizontal: normalize(15), marginTop: normalize(25)}}>
          <Text
            numberOfLines={3}
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
              maxWidth: normalize(200),
            }}>
            {EventReducer?.eventDetailsRes?.data &&
              EventReducer?.eventDetailsRes?.data?.eventName !== undefined &&
              EventReducer?.eventDetailsRes?.data?.eventName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginTop: normalize(4),
            }}>
            <Text
              style={{
                fontSize: normalize(12),
                fontFamily: Fonts.OpenSans_Regular,
                color: Colors.textBlack,
                opacity: 0.7,
              }}>
              {EventReducer?.eventDetailsRes?.data &&
                EventReducer?.eventDetailsRes?.data?.eventLocation !==
                  undefined &&
                EventReducer?.eventDetailsRes?.data?.eventLocation}
            </Text>
            <Text
              style={{
                fontSize: normalize(11),
                fontFamily: Fonts.OpenSans_Regular,
                color: Colors.textBlack,
              }}>
              {moment(
                EventReducer?.eventDetailsRes?.data &&
                  EventReducer?.eventDetailsRes?.data?.date,
              ).format('llll')}
            </Text>
          </View>

          <View
            style={{
              width: Dimensions.get('window').width,
              height: normalize(1),
              marginVertical: normalize(18),
              marginLeft: -normalize(15),
              backgroundColor: Colors.borderColor1,
            }}
          />

          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
            }}>
            Description
          </Text>
          <HtmlTextComponent
            htmlContent={
              EventReducer?.eventDetailsRes?.data &&
              EventReducer?.eventDetailsRes?.data?.description
            }
          />
          {/* <Text
            style={{
              marginTop: normalize(4),
              fontSize: normalize(14),
              fontFamily: Fonts.OpenSans_Regular,
              color: Colors.textBlack,
            }}>
            {}
          </Text> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: normalize(20)
            }}>
            {users?.length > 0 &&
              users?.slice(0, 3)?.map((user, index) => (
                <Image
                  source={
                    user?.image !== ''
                      ? {
                          uri: constants?.IMAGE_URL + 'user/' + user.image,
                        }
                      : Icons?.userProfile
                  }
                  style={{
                    height: normalize(30),
                    width: normalize(30),
                    resizeMode: 'contain',
                    borderWidth:2,
                    borderRadius: 50,
                    borderColor:Colors?.backgroundMedium,
                    marginLeft: index > 0 ? normalize(-12) : 5,
                  }}
                  key={index}
                />
              ))}
            {totalMembers > 3 && (
              <Text style={{fontSize: normalize(12), color: '#383A46'}}>
                +{totalMembers - 3}
              </Text>
            )}
            {users?.length > 0 && (
              <Text
                numberOfLines={1}
                style={{
                  color: '#383A46',
                  fontSize: normalize(12),
                  marginLeft: normalize(5),
                  maxWidth: normalize(230),
                  fontFamily: Fonts.OpenSans_Regular,
                }}>
                {totalMembers === 1
                  ? `${users?.length > 0 && users[0]?.name} is here`
                  : totalMembers === 2
                    ? `${
                        users?.length > 0 && users[0]?.name
                      } and 1 connection are here`
                    : `${users?.length > 0 && users[0]?.name} and ${
                        totalMembers - 1
                      } connections are here`}
              </Text>
            )}
          </View>

          <View
            style={{
              height: normalize(38),
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop:normalize(15)
            }}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '80%',
                backgroundColor: Colors.lightOrange,
                borderRadius: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={
                EventReducer?.eventDetailsRes?.data &&
                EventReducer?.eventDetailsRes?.data?.isEnrolled === true
              }
              onPress={() => EnrollEvent()}>
              <Text
                style={{
                  color: Colors.orange,
                  fontSize: normalize(14),
                  fontFamily: Fonts.OpenSans_Bold,
                }}>
                {EventReducer?.eventDetailsRes?.data &&
                EventReducer?.eventDetailsRes?.data?.isEnrolled === true
                  ? 'Enrolled'
                  : 'Enroll'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: '100%',
                width: normalize(38),
                backgroundColor: Colors.textBlack,
                borderRadius: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setActiveBottomSheetIndex(0)}>
              <Image
                source={Icons.share}
                style={{height: '50%', width: '50%', resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          {/* Post */}

          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
              marginVertical: normalize(15),
            }}>
            Related Events
          </Text>
          {EventReducer.RelatedEventRes?.data?.length ? (
            EventReducer.RelatedEventRes?.data?.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    props.navigation.navigate('EventDetails');
                    dispatch(EventDetailsRequest({id: item?._id}));
                    dispatch(
                      RelatedEventRequest({
                        event_id: item?._id,
                        page: 1,
                        perpage: 10,
                      }),
                    );
                  }}
                  key={index}
                  style={{
                    marginBottom: normalize(10),
                  }}>
                  <ImageBackground
                    source={
                      !!item?.event_image
                        ? {
                            uri:
                              constants.IMAGE_URL +
                              'event/' +
                              item?.event_image,
                          }
                        : Icons?.noImage
                    }
                    style={{
                      height: normalize(160),
                      width: '100%',
                      borderRadius: normalize(10),
                      overflow: 'hidden',
                    }}></ImageBackground>
                  {/* details */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: normalize(5),
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: normalize(13),
                          fontFamily: Fonts.OpenSans_SemiBold,
                          color: Colors.textBlack,
                        }}>
                        {item?.eventName}
                      </Text>
                      <Text
                        style={{
                          marginTop: normalize(2),
                          fontSize: normalize(11),
                          fontFamily: Fonts.OpenSans_Regular,
                          color: Colors.textBlack,
                          opacity: 0.8,
                        }}>
                        {item?.eventLocation}
                      </Text>
                      <Text
                        style={{
                          marginTop: normalize(3),
                          fontSize: normalize(12),
                          fontFamily: Fonts.OpenSans_Regular,
                          color: Colors.textBlack,
                        }}>
                        {moment(item?.data).format('llll')}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View
              style={{
                height: normalize(120),
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.OpenSans_Medium,
                  fontSize: normalize(12),
                  color: '#bbb',
                }}>
                No Related Events Found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={activeBottomSheetIndex}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            enableTouchThrough={false}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            // style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
            opacity={0.4}
            onPress={() => setActiveBottomSheetIndex(-1)}
          />
        )}
        footerComponent={bottomSheetFooter}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enablePanDownToClose
        onClose={() => setActiveBottomSheetIndex(-1)}>
        <SafeAreaView style={{flex: 1}} edges={isTextInputFocus ? ['top'] : []}>
          <BottomSheetView style={{paddingHorizontal: normalize(10), flex: 1}}>
            <View style={{flexDirection: 'row', gap: normalize(5)}}>
              <BottomSheetTextInput
                style={{
                  borderColor: Colors.borderColor,
                  borderWidth: 1,
                  padding: normalize(8),
                  paddingHorizontal: normalize(10),
                  borderRadius: normalize(10),
                  flex: 1,
                  // marginTop: 8,
                  // marginBottom: 10,
                  // borderRadius: 10,
                  // fontSize: 16,
                  // lineHeight: 20,
                  // padding: 8,
                  backgroundColor: 'rgba(151, 151, 151, 0.25)',
                }}
                onFocus={() => setIsTextInputFocus(true)}
                onBlur={() => setIsTextInputFocus(false)}
                placeholder="Search..."
                placeholderTextColor="#333"
                value={searchValue}
                onChangeText={text => setSearchValue(text)}
              />
              {isTextInputFocus && (
                <TouchableOpacity
                  style={{padding: normalize(5)}}
                  onPress={() => {
                    bottomSheetRef.current.snapToIndex(0);
                    Keyboard.dismiss();
                    setSearchValue('');
                  }}>
                  <Text
                    style={{
                      color: '#333',
                      fontFamily: Fonts.OpenSans_SemiBold,
                      fontSize: normalize(12),
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <BottomSheetFlatList
              data={MessagingReducer?.chatListRes?.data}
              // contentContainerStyle={{flex: 1}}
              style={{flex: 1, marginTop: normalize(10)}}
              keyExtractor={item => item._id}
              renderItem={friendItem}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}
            />
          </BottomSheetView>
        </SafeAreaView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: normalize(45),
    width: '47%',
    borderRadius: normalize(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    borderColor: Colors.borderColor1,
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: Colors.textBlack,
    fontFamily: Fonts.OpenSans_Bold,
  },
  buttonIcon: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'cover',
  },

  container_wrapper: {
    marginTop: normalize(20),
  },
  header: {
    marginVertical: normalize(10),
  },
  icon_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: normalize(65),
    width: normalize(65),
  },
  profilePicture: {
    height: normalize(50),
    width: normalize(50),
    position: 'absolute',
    top: normalize(7),
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
  backgroundImage: {
    width: '100%',
    height: normalize(180),
    marginTop: normalize(10),
    // borderRadius: normalize(10),
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(10),
    width: '60%',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionCount: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: 'gray',
  },
  actionIcon: {
    width: normalize(15),
    height: normalize(15),
  },
  desc: {
    fontSize: normalize(12),
    width: '100%',
    color: '#1F2440',
    textAlign: 'justify',
    fontFamily: Fonts.OpenSans_Medium,
  },
  time: {
    fontSize: normalize(12),
    color: '#1F2440',
    lineHeight: normalize(13.26),
    fontFamily: Fonts.OpenSans_Regular,
    marginTop: normalize(10),
  },
  blueText: {
    color: '#2196F3',
  },
  friendContainer: {
    marginHorizontal: normalize(5),
    alignItems: 'center',
    marginTop: normalize(10),
  },
  friendImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(10), // Make it a square with rounded corners
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.08)', // Semi-transparent black background
    padding: normalize(5),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '600',
  },
  friendStatus: {
    color: Colors.backgroundLight,
    fontSize: normalize(10),
    fontWeight: '400',
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    bottom: normalize(5),
    // fontWeight:'600'
  },

  friend_container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(5),
    paddingVertical: normalize(10),
    borderBottomColor: Colors.shadowColor,
    borderBottomWidth: 0.8,
    gap: normalize(10),
  },

  friend_image_container: {
    flex: 0.17,
    aspectRatio: 1,
    borderRadius: normalize(50),
    // borderColor: Colors.borderColor1,
    // borderWidth: normalize(1),
  },
  friend_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: normalize(50),
  },
  friend_name: {
    fontFamily: Fonts.OpenSans_Medium,
    fontSize: normalize(12),
    flex: 1,
    color: '#333',
  },
  send_button_active: {
    padding: normalize(5),
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    backgroundColor: Colors.orange,
    borderRadius: normalize(5),
  },
  send_button_outline: {
    padding: normalize(4),
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    borderColor: Colors.orange,
    borderWidth: normalize(1),
    backgroundColor: Colors.white,
    borderRadius: normalize(5),
  },
  send_button_text_active: {
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.white,
  },
  send_button_text: {
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.orange,
  },
});
