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
  Linking,
  Platform,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../themes/Colors';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {globalConstant} from '../../utils/helpers/GlobalConstant';
import {FlatList} from 'react-native';
import Modal from 'react-native-modal';
import TextInputmultiple from '../../components/TextInputmultiple';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import Toast from '../../utils/helpers/Toast';
import {
  tigerAcceptFriedRequest,
  tigerFriedRequest,
  tigerFriendDetailsRequest,
  tigerFriendSuggestionByProfileRequest,
  tigerFriendSuggestionRequest,
  tigerRejectFriedRequest,
  tigerUnFriedRequest,
  userDetailsRequest,
} from '../../redux/reducer/FriendReducer';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import socketService from '../../utils/helpers/socketService';
import Video from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import {getVideoThumbnail} from '../../components/VideoThumbnails';
import socket from '../../utils/helpers/socketService';
import {getChatListRequest} from '../../redux/reducer/MessagingReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import moment from 'moment';

let status = '';

const FriendMediaItem = ({item}) => {
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (item.post_media_details[0]?.media_type === 'video/mp4') {
        const res = await getVideoThumbnail(
          constants.IMAGE_URL +
            'post/media/' +
            item.post_media_details[0]?.media_url,
        );
        setThumbnail(res);
      } else {
        setThumbnail(
          constants.IMAGE_URL +
            'post/media/' +
            item.post_media_details[0]?.media_url,
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <View
      style={{
        width: '31%',
        // height: normalize(105),
        aspectRatio: 4 / 4.5,
        marginBottom: normalize(12),
        borderRadius: normalize(10),
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading ? (
        <ActivityIndicator color={Colors.orange} size={'small'} />
      ) : (
        <>
          <Image
            source={
              !!item.post_media_details[0]?.media_url
                ? {
                    uri: thumbnail,
                  }
                : Icons.noImage
            }
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          {item.post_media_details[0]?.media_type === 'video/mp4' && (
            <Image
              source={Icons.play}
              style={{
                width: normalize(10),
                aspectRatio: 1,
                resizeMode: 'contain',
                position: 'absolute',
                top: normalize(-10),
                right: normalize(7),
              }}
            />
          )}
        </>
      )}
    </View>
  );
};

export default function FriendProfileDetails(props) {
  const {type, id} = props.route.params;
  const [isRejectRequest, setIsRejectRequest] = useState(false);
  const [reason, setReason] = useState('');
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const FriendReducer = useSelector(state => state.FriendReducer);
  const MessagingReducer = useSelector(state => state.MessagingReducer);
  const [userDetails, setUserDetails] = useState(null);
  const [chatList, setChatList] = useState([]);
  const socket = socketService(AuthReducer.getTokenResponse);
  const callNumber = phone => {
    // console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };
  // console.log('userDetails1>>', userDetails);

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

  useFocusEffect(
    useCallback(() => {
      let data = {
        user_id: props?.route?.params?.id,
      };
      connectionrequest()
        .then(() => {
          dispatch(userDetailsRequest(data));
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }, [props?.route?.params?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      connectionrequest()
        .then(() => {
          dispatch(
            getChatListRequest({
              search: '',
            }),
          );
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }, []),
  );

  // useEffect(() => {
  //   let data = {
  //     user_id: props?.route?.params?.id,
  //   };
  //   connectionrequest()
  //     .then(() => {
  //       dispatch(userDetailsRequest(data));
  //     })
  //     .catch(err => {
  //       Toast('Please connect To Internet');
  //     });
  // }, [props?.route?.params?.id]);
  useEffect(() => {
    if (FriendReducer.UserDetailsRes?.data?._id) {
      const data = {
        page: 1,
        perpage: 10,
        user_id: FriendReducer.UserDetailsRes?.data?._id,
        // class: FriendReducer.UserDetailsRes?.data?.class?._id,
        degree: FriendReducer.UserDetailsRes?.data?.degree?._id,
        education_stream:
          FriendReducer.UserDetailsRes?.data?.education_stream?._id,
      };
      connectionrequest()
        .then(() => dispatch(tigerFriendSuggestionRequest(data)))
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }
  }, [FriendReducer.UserDetailsRes?.data?._id]);

  const onMessageListUpdate = chat => {
    // console.log(chat);
    const chatList_copy = chatList.filter(
      _chat => _chat.room_id !== chat.room_id,
    );
    // console.log(chatList_copy);
    setChatList([chat, ...chatList_copy]);
  };

  useEffect(() => {
    socket.on(
      `${AuthReducer.getProfileRes?.data?._id}_updated_chat_list`,
      onMessageListUpdate,
    );

    return () => {
      socket.removeEventListener(
        `${AuthReducer.getProfileRes?.data?._id}_updated_chat_list`,
        onMessageListUpdate,
      );
    };
  }, [AuthReducer.getProfileRes]);

  useEffect(() => {
    if (status == '' || MessagingReducer.status != status) {
      switch (MessagingReducer.status) {
        case 'Messaging/getChatListRequest':
          status = MessagingReducer.status;
          break;
        case 'Messaging/getChatListSuccess':
          setChatList(
            MessagingReducer.chatListRes.data
              .slice()
              .sort(
                (a, b) =>
                  moment(b?.recent_chat_date)?.format('x') -
                  moment(a?.recent_chat_date)?.format('x'),
              ) || [],
          );
          status = MessagingReducer.status;
          break;
        case 'Messaging/getChatListFailure':
          status = MessagingReducer.status;
          break;
      }
    }
  }, [MessagingReducer.status]);

  console.log(chatList, '>>>>>>DSdddd');

  // friend
  let whenFriend = [
    {
      icon: Icons.callBlue,
      title: 'Call',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        Linking.openURL(`tel:${FriendReducer.UserDetailsRes?.data?.phone}`);
        // callNumber('112336454545');
      },
    },
    {
      icon: Icons.msgOrange,
      title: 'Message',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        props?.navigation.navigate('MessagingRoom', {
          name: `${FriendReducer.UserDetailsRes?.data?.first_name} ${FriendReducer.UserDetailsRes?.data?.last_name}`,
          room_id: FriendReducer.UserDetailsRes?.data?.chat_room_id,
          profile_image: FriendReducer.UserDetailsRes?.data.profile_image,
          isblock: chatList[0]?.is_block,
          block_by: chatList[0]?.block_by,
        });
      },
    },
    {
      icon: Icons.unfriend,
      title: 'Unfriend',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        dispatch(
          tigerUnFriedRequest({
            id: FriendReducer.UserDetailsRes?.data?.fr_id,
          }),
        );
      },
    },
  ];

  // no_request_from_any_side
  let whenSuggestionFriend = [
    {
      icon: Icons.friendRequest,
      title: 'Friend Request',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        let data = {
          to_user_id: props?.route?.params?.id,
        };
        connectionrequest()
          .then(() => {
            dispatch(tigerFriedRequest(data));
          })
          .catch(err => {
            Toast('Please connect To Internet');
          });
        // console.log('kokokokokok');
      },
    },
  ];

  console.log(FriendReducer.UserDetailsRes?.data);

  // request_by_friend
  let whenRequested = [
    {
      icon: Icons.requestedAccept,
      title: 'Accept',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        dispatch(
          tigerAcceptFriedRequest({
            fr_id: FriendReducer.UserDetailsRes?.data?.fr_id,
          }),
        );
      },
    },
    {
      icon: Icons.requestedCancel,
      title: 'Reject',
      isIconButton: true,
      buttonColor: '',
      onPress: () => {
        setIsRejectRequest(true);
      },
    },
  ];
  // request_by_me
  let whenRequestedByMe = [
    {
      icon: '',
      title: 'Cancel Request',
      isIconButton: false,
      buttonColor: 'red',
      onPress: () => {
        let data = {
          to_user_id: props?.route?.params?.id,
        };
        connectionrequest()
          .then(() => {
            dispatch(tigerFriedRequest(data));
          })
          .catch(err => {
            Toast('Please connect To Internet');
          });
      },
    },
  ];
  const whichArr = status => {
    if (status == 'no_request_from_any_side') {
      return whenSuggestionFriend;
    } else if (status == 'friend') {
      return whenFriend;
    } else if (status == 'request_by_me') {
      return whenRequestedByMe;
    } else if (status == 'request_by_friend') {
      return whenRequested;
    } else if (status == 'error') {
      return [];
    } else {
      return [];
    }
  };
  const requestCancelModal = () => {
    return (
      <Modal
        avoidKeyboard={true}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={isRejectRequest}
        style={{
          width: '100%',
          alignSelf: 'center',
          margin: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setReason('');
          setIsRejectRequest(false);
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
            height: normalize(255),
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginVertical: normalize(10),
            }}>
            <TextInputmultiple
              toptext={'Reason of Rejection'}
              placeholder={'Enter Reason'}
              width="100%"
              value={reason}
              onChangeText={val => setReason(val)}
              onFocus={() => setIsReasonFocus(true)}
              onBlur={() => setIsReasonFocus(false)}
              focus={isReasonFocus}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: normalize(20),
            }}>
            <TouchableOpacity
              onPress={() => {
                if (reason.trim('') == '') {
                  Toast('Please enter the reason');
                } else {
                  dispatch(
                    tigerRejectFriedRequest({
                      fr_id: FriendReducer.UserDetailsRes?.data?.fr_id,
                      // reason,
                    }),
                  );
                }
              }}
              activeOpacity={0.1}
              style={{
                width: '81%',
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
                Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setReason('');
                setIsRejectRequest(false);
              }}
              activeOpacity={0.1}
              style={{
                width: normalize(45),
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
    );
  };
  const profileStatus = data => {
    if (data.friendship_status == null && data.from_user_id == null) {
      return 'no_request_from_any_side';
    } else if (data.friendship_status == 'Accepted') {
      return 'friend';
    } else if (data.friendship_status == 'Rejected') {
      return 'no_request_from_any_side';
    } else if (
      data.friendship_status == 'Pending' &&
      data.from_user_id == AuthReducer.getProfileRes.data._id
    ) {
      return 'request_by_me';
    } else if (
      data.friendship_status == 'Pending' &&
      data.from_user_id != AuthReducer.getProfileRes.data._id
    ) {
      return 'request_by_friend';
    } else {
      return 'error';
    }
  };

  if (status == '' || FriendReducer.status != status) {
    switch (FriendReducer.status) {
      case 'Friend/userDetailsRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/userDetailsSuccess':
        status = FriendReducer.status;
        setReason('');
        setIsRejectRequest(false);
        setUserDetails(FriendReducer.UserDetailsRes.data);
        break;
      case 'Friend/userDetailsFailure':
        status = FriendReducer.status;
        break;
      //tigerFriedRequest
      case 'Friend/tigerFriedRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriedSuccess':
        status = FriendReducer.status;
        let data = {
          user_id: props?.route?.params?.id,
        };
        dispatch(userDetailsRequest(data));

        break;
      case 'Friend/tigerFriedFailure':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriendSuggestionByProfileRequest':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriendSuggestionByProfileSuccess':
        status = FriendReducer.status;
        break;
      case 'Friend/tigerFriendSuggestionByProfileFailure':
        status = FriendReducer.status;
        break;
    }
  }

  useEffect(() => {
    // debugger;
    if (
      FriendReducer.status == 'Friend/tigerAcceptFriedSuccess' ||
      FriendReducer.status == 'Friend/tigerRejectFriedSuccess' ||
      FriendReducer.status == 'Friend/tigerUnFriedSuccess'
    ) {
      dispatch(
        userDetailsRequest({
          user_id: props?.route?.params?.id,
        }),
      );
    }
  }, [FriendReducer.status]);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundorange}}>
        <MyStatusBar translucent />

        <Loader
          visible={
            FriendReducer.status == 'Friend/userDetailsRequest' ||
            FriendReducer.status == 'Friend/tigerFriedRequest' ||
            FriendReducer.status == 'Friend/tigerAcceptFriedRequest' ||
            FriendReducer.status == 'Friend/tigerRejectFriedRequest' ||
            FriendReducer.status == 'Friend/tigerUnFriedRequest' ||
            FriendReducer.status ==
              'Friend/tigerFriendSuggestionByProfileRequest'
          }
        />
        <StatusBar
          translucent
          // backgroundColor={
          //   isRejectRequest ? 'rgba(0, 0, 0, 0.7)' : 'transparent'
          // }
          barStyle={'dark-content'}
        />

        <ScrollView
          bounces={false}
          contentContainerStyle={{paddingBottom: normalize(15)}}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={
              FriendReducer.UserDetailsRes?.data?.profile_image == ''
                ? Icons.usernoimage
                : {
                    uri:
                      constants.IMAGE_URL +
                      'user/' +
                      FriendReducer.UserDetailsRes?.data?.profile_image,
                  }
            }
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height * 0.55,

              paddingHorizontal: normalize(15),
              borderRadius: normalize(15),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            blurRadius={10}
            resizeMode="cover">
            <ImageBackground
              source={
                FriendReducer.UserDetailsRes?.data?.profile_image == ''
                  ? Icons.usernoimage
                  : {
                      uri:
                        constants.IMAGE_URL +
                        'user/' +
                        FriendReducer.UserDetailsRes?.data?.profile_image,
                    }
              }
              resizeMode={
                FriendReducer.UserDetailsRes?.data?.profile_image == ''
                  ? 'cover'
                  : 'contain'
              }
              borderRadius={15}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height * 0.55,

                paddingHorizontal: normalize(15),
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.goBack();
                }}
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  backgroundColor: 'rgba(176,176,176,0.55)',
                  borderRadius: normalize(8),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: normalize(50),
                }}>
                <Image
                  source={Icons.rightBack}
                  style={{height: '40%', width: '40%', resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <View style={{flex: 1}} />
              {FriendReducer.UserDetailsRes?.data?.friendship_status ==
                'Accepted' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: normalize(23),
                  }}>
                  <Image
                    source={Icons.account}
                    style={{
                      height: normalize(25),
                      width: normalize(25),
                      resizeMode: 'contain',
                      marginRight: normalize(6),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: normalize(15),
                      fontFamily: Fonts.OpenSans_Medium,
                      color: Colors.white,
                      opacity: 0.7,
                    }}>
                    Friends
                  </Text>
                </View>
              )}
            </ImageBackground>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                bottom: normalize(-20),
                right: normalize(15),
              }}>
              {FriendReducer.UserDetailsRes?.data != null &&
                whichArr(profileStatus(FriendReducer.UserDetailsRes?.data)).map(
                  (item, index) => {
                    return item.isIconButton ? (
                      <TouchableOpacity
                        key={index}
                        onPress={item.onPress}
                        style={[
                          styles.iconButton,
                          {
                            marginRight:
                              index ==
                              whichArr(
                                profileStatus(
                                  FriendReducer.UserDetailsRes?.data,
                                ),
                              ).length -
                                1
                                ? 0
                                : normalize(6),
                          },
                        ]}>
                        <Image
                          source={item.icon}
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'cover',
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={item.onPress}
                        style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>{item.title}</Text>
                      </TouchableOpacity>
                    );
                  },
                )}
            </View>
          </ImageBackground>

          <View
            style={{marginHorizontal: normalize(15), marginTop: normalize(25)}}>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
              }}>
              {FriendReducer.UserDetailsRes?.data?.first_name}{' '}
              {FriendReducer.UserDetailsRes?.data?.last_name}
            </Text>
            <Text
              style={{
                marginTop: normalize(4),
                fontSize: normalize(14),
                fontFamily: Fonts.OpenSans_Regular,
                color: Colors.textBlack,
                opacity: 0.7,
              }}>
              {FriendReducer.UserDetailsRes?.total_followers} Followers |
              {/* {FriendReducer.UserDetailsRes?.data?.class?.title}{' '} */}
              {`Class of ${FriendReducer.UserDetailsRes?.data?.graduation_date}`}{' '}
              {/* {FriendReducer.UserDetailsRes?.data?.graduation_date} */}
              {/* {FriendReducer.UserDetailsRes?.data
                ?.is_studying_in_the_university === 'Yes' && 'Current Student'} */}
              , {FriendReducer.UserDetailsRes?.data?.degree?.title} in{' '}
              {FriendReducer.UserDetailsRes?.data?.education_stream?.title}
            </Text>
            <View
              style={{
                height: normalize(1),
                width: Dimensions.get('window').width,
                backgroundColor: '#F4F3F3',
                marginLeft: normalize(-15),
                marginVertical: normalize(15),
              }}
            />
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
              }}>
              About
            </Text>
            <Text
              style={{
                marginTop: normalize(4),
                fontSize: normalize(14),
                fontFamily: Fonts.OpenSans_Regular,
                color: Colors.textBlack,
              }}>
              {FriendReducer.UserDetailsRes?.data?.biography}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginVertical: normalize(15)}}>
              {FriendReducer.UserDetailsRes?.data?.expertise_area?.map(
                (item, index) => (
                  <View
                    key={index}
                    style={{
                      height: normalize(35),
                      width: normalize(90),
                      borderRadius: normalize(7),
                      marginRight: normalize(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: normalize(1),
                      borderColor: Colors.borderColor,
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(12),
                        fontFamily: Fonts.OpenSans_Regular,
                        color: Colors.textBlack,
                      }}>
                      {item}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>

            {/* media */}

            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
                marginBottom: normalize(15),
              }}>
              Media
            </Text>

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: normalize(10),
              }}>
              {FriendReducer.UserDetailsRes?.data?.post_media.length > 0 ? (
                FriendReducer.UserDetailsRes?.data?.post_media?.map(item => {
                  return <FriendMediaItem item={item} key={item._id} />;
                })
              ) : (
                <View
                  style={{
                    flex: 1,
                    height: normalize(150),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#bbb',
                      fontSize: normalize(12),
                      marginBottom: normalize(25),
                      fontFamily: Fonts.OpenSans_Medium,
                    }}>
                    {FriendReducer.UserDetailsRes?.data?.first_name} hasn't
                    posted anything yet...
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: normalize(5),
              }}>
              <View>
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontFamily: Fonts.OpenSans_SemiBold,
                    color: Colors.textBlack,
                    // marginBottom: normalize(15),
                  }}>
                  Suggested Friends
                </Text>
              </View>
              {FriendReducer.FriendSuggestionRes?.data?.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    props?.navigation?.navigate('TabNavigator', {
                      screen: 'Friend',
                    })
                  }>
                  <Text
                    style={{
                      fontSize: normalize(13),
                      fontWeight: '600',
                      fontFamily: Fonts.OpenSans_Medium,
                      color: '#F27C24',
                    }}>
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              {FriendReducer.FriendSuggestionRes?.data?.length > 0 ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {FriendReducer.FriendSuggestionRes?.data?.map(
                    (item, index) => (
                      <TouchableOpacity
                        style={styles.friendContainer}
                        key={index}
                        onPress={() =>
                          props.navigation.push('FriendProfileDetails', {
                            id: item?._id,
                            type: 'Suggestion',
                          })
                        }>
                        <Image
                          source={
                            !item?.profile_image
                              ? Icons.usernoimage
                              : {
                                  uri:
                                    constants?.IMAGE_URL +
                                    'user/' +
                                    item?.profile_image,
                                }
                          }
                          style={styles.friendImage}
                        />
                        <View
                          style={[
                            styles.boxContainer,
                            {backgroundColor: '#F27C24'},
                          ]}>
                          <Image
                            source={Icons?.box}
                            style={{
                              width: normalize(11),
                              height: normalize(11),
                            }}
                          />
                        </View>
                        <View style={styles.infoContainer}>
                          <Text style={styles.friendName}>
                            {item.full_name}
                          </Text>
                          <Text style={styles.friendStatus}>
                            {`Class of ${item?.graduation_date}`}
                          </Text>
                          {/* {console.log(item,">>>>>>>>ress!!!!")} */}
                        </View>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginLeft: normalize(40),
                    marginTop: normalize(20),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: normalize(15),
                      color: Colors.backgroundDark,
                    }}>
                    No suggested friends found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
        {requestCancelModal()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendContainer: {
    marginRight: normalize(10),
    alignItems: 'center',
    marginTop: normalize(10),
    flexDirection: 'row',
  },
  friendImage: {
    width: normalize(100),
    height: normalize(110),
    borderRadius: normalize(10), // Make it a square with rounded corners
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    padding: normalize(5),
    borderRadius: normalize(5),
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
  buttonContainer: {
    height: normalize(40),
    paddingHorizontal: normalize(15),
    backgroundColor: 'red',
    borderRadius: normalize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.white,
  },
  iconButton: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(40) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
