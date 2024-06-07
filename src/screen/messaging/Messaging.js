import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {SafeAreaView} from 'react-native';
import {ImageBackground} from 'react-native';
import connectionrequest from '../../utils/helpers/NetInfo';

import socket from '../../utils/helpers/socketService';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getChatListRequest} from '../../redux/reducer/MessagingReducer';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
import socketService from '../../utils/helpers/socketService';
import {navigationRef} from '../../utils/helpers/RootNavigation';
// import Toast from '../../utils/helpers/Toast';

const Messaging = props => {
  const [subject, setSubject] = useState('');
  const [isSubjectFocus, setIsSubjectFocus] = useState(false);

  const [statement, setStatement] = useState('');
  const [chatList, setChatList] = useState([]);
  const [value, setvalue] = useState('');
  let status = '';
  const MessagingReducer = useSelector(state => state.MessagingReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const dispatch = useDispatch();
  const socket = socketService(AuthReducer.getTokenResponse);

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
      connectionrequest()
        .then(() => {
          dispatch(
            getChatListRequest({
              search: value,
            }),
          );
          setFetchedOnce(true);
        })
        .catch(err => {
          Toast('Please connect To Internet');
        });
    }, [value]),
  );

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

  console.log(chatList,">>>>>>Reddh")

  function renderItem({item, index}) {
    const current_user_id = AuthReducer.getProfileRes?.data?._id;

    const friend = item.users.filter(_user => _user._id !== current_user_id)[0];

    const unseen_msg = Boolean(item.unseen_count);
    return (
      <TouchableOpacity
        onPress={() =>
          props?.navigation?.navigate('MessagingRoom', {
            room_id: item?.room_id,
            name: friend?.full_name,
            profile_image: friend?.profile_image,
            isblock:item?.is_block,
            block_by:item?.block_by,
            // roomfor:item?.room_for
          })
        }
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: normalize(20),
          alignItems: 'center',
        }}>
        <View style={{width: normalize(42), aspectRatio: 1 / 1}}>
          <Image
            source={
              friend?.profile_image !== '' &&
              friend?.profile_image !== undefined &&
              friend?.profile_image !== null
                ? {
                    uri: constants?.IMAGE_URL + 'user/' + friend?.profile_image,
                  }
                : Icons.userProfile
            }
            style={{
              width: '100%',
              // height: normalize(40),
              flex: 1,
              resizeMode: 'cover',
              borderRadius: 50,
            }}
          />
        </View>
        <View style={{flex: 1, marginLeft: '4%'}}>
          <Text
            style={{
              fontFamily: unseen_msg
                ? Fonts.OpenSans_Bold
                : Fonts.OpenSans_SemiBold,
              color: unseen_msg ? Colors.black : '#333',
              fontSize: normalize(11),
              marginBottom: normalize(5),
              textTransform:'capitalize'
            }}>
            {friend?.full_name}
            <Text style={{color:Colors.theme}}> {' ('+item?.room_for+')'}</Text>
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: unseen_msg
                ? Fonts.OpenSans_Medium
                : Fonts.OpenSans_Regular,
              color: unseen_msg ? '#555' : '#A0A0A0',
              fontSize: normalize(11),
              width: '80%',
            }}>
            {item?.recent_chat_sender === AuthReducer.getProfileRes.data._id &&
              'You: '}
            {item?.recent_chat_type === 'Event'
              ? 'Event'
              : item?.recent_chat_text ||
                item.recent_chat_file?.[0]?.type
                  .split('/')[0]
                  .charAt(0)
                  .toUpperCase() +
                  item.recent_chat_file?.[0]?.type.split('/')[0].slice(1) ||
                null}
          </Text>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            
          </View> */}
          {/* <Text style={{alignSelf:'flex-end',fontFamily:Fonts.OpenSans_Regular,
            fontSize:normalize(10),color:'#A0A0A0'}}>{item?.time}</Text> */}
        </View>
        <View style={{alignItems: 'flex-end', alignSelf: 'flex-end'}}>
          {unseen_msg && (
            <View style={styles.unseen_badge}>
              <Text style={styles.unseen_badge_text}>
                {item.unseen_count.toLocaleString('en-US')}
              </Text>
            </View>
          )}
          <Text
            style={{
              alignSelf: 'flex-end',
              fontFamily: Fonts.OpenSans_Regular,
              fontSize: normalize(10),
              color: unseen_msg ? Colors.orange : '#A0A0A0',
            }}>
            {item?.recent_chat_date
              ? moment(item?.recent_chat_date).calendar(null, {
                  sameDay: 'hh:mm A',
                  lastDay: '[Yesterday]',
                  lastWeek: 'dddd',
                  sameElse: 'DD/MM/YYYY',
                })
              : null}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const renderNoDataFound = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: normalize(240),
        }}>
        <Text style={{color: Colors.placeholder, fontSize: normalize(14)}}>
          No Friends Found
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader
        visible={
          !fetchedOnce &&
          MessagingReducer.status === 'Messaging/getChatListRequest'
        }
      />
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
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
            <Text style={styles.txt}>Message</Text>
          </View>
          {/* Horizontal line below the title and icon */}
          <View></View>
        </View>
        {/* <View style={styles.horizontalLine}></View> */}
        <View
          style={{
            height: normalize(40),
            width: '90%',
            borderRadius: normalize(12),
            // backgroundColor: props.backgroundColor,
            borderColor: Colors.borderColor,
            borderWidth: normalize(1),
            marginTop: normalize(20),
            // marginBottom: props.marginBottom,
            // marginVertical: props.marginVertical,
            // padding: normalize(11),
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: normalize(15),
            alignSelf: 'center',
            paddingRight: normalize(3),
            marginBottom: normalize(8),
          }}>
          <TouchableOpacity style={{marginRight: normalize(5)}}>
            <Image
              source={Icons.inputsearch}
              style={{
                width: normalize(15),
                height: normalize(15),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View style={{width: '82%'}}>
            <TextInput
              style={{
                color: '#383A46',
                fontSize: normalize(13),
                fontFamily: Fonts.OpenSans_Regular,
                // fontWeight: '600',
              }}
              placeholder={'Search here.....'}
              placeholderTextColor="#909090"
              value={value}
              maxLength={props.maxLength}
              onChangeText={text => {
                setvalue(text);
              }}
            />
          </View>
        </View>
        <FlatList
          data={chatList?.filter(_chat => _chat.recent_chat_date)}
          renderItem={renderItem}
          style={{width: '90%', alignSelf: 'center', flex: 1}}
          contentContainerStyle={{paddingBottom: normalize(30)}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderNoDataFound}
          keyboardDismissMode="interactive"
          keyExtractor={item => item._id}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Messaging;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform?.OS == 'android' ? normalize(40) : normalize(20),
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
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F3F3', // You can change the color to your preference
    width: '100%', // Make the line cover the whole width
    marginTop: normalize(10), // Adjust the margin based on your design
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  itemIcon: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(10),
  },
  itemName: {
    fontSize: 16,
    color: '#1F2440',
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Regular,
  },
  rightIcon: {
    width: normalize(15),
    height: normalize(15),
    marginLeft: 'auto', // Push the right icon to the right
  },
  rightIconContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
    position: 'absolute',
    right: 0,
    // Set the background color here
    borderRadius: 5, // Adjust as needed
    padding: 5, // Adjust as needed
  },
  unseen_badge: {
    height: normalize(15),
    // aspectRatio: 1 / 1,
    minWidth: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(4),
    backgroundColor: Colors.orange,
    borderRadius: normalize(50),
    marginBottom: normalize(10),
  },
  unseen_badge_text: {
    color: Colors.white,
    fontSize: normalize(10),
    fontFamily: Fonts.OpenSans_Medium,
  },
});
