import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  TextInput,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import React, {useEffect, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import DropDownComponent from '../../components/DropDownComponent';
import {tigerFriendListingRequest} from '../../redux/reducer/FriendReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
import GroupReducer, {
  getGroupInviteDetailsRequest,
  groupCreateRequest,
  groupInvitationRequest,
} from '../../redux/reducer/GroupReducer';
import Loader from '../../utils/helpers/Loader';
import {navigationRef} from '../../utils/helpers/RootNavigation';

const CreatedGroupStep3 = props => {
  const [value, setvalue] = useState('');
  const [friendList, setFriendList] = useState([]);
  const FriendReducer = useSelector(state => state.FriendReducer);
  const GroupReducer = useSelector(state => state.GroupReducer);
  // console.log(GroupReducer?.groupInviteFriendListRes?.data, 'dsadjsdasjgcda');
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const [invitedFriends, setInvitedFriends] = useState([]);
  // console.log(props?.route?.params?.item, '<<<<<<<<<,ress');

  useEffect(() => {
    let status = '';
    if (status == '' || FriendReducer.status != status) {
      switch (FriendReducer.status) {
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
      }
    }
  }, [FriendReducer?.status]);

  useEffect(() => {
    let status = '';
    if (status == '' || GroupReducer.status != status) {
      switch (GroupReducer.status) {
        case 'Group/groupCreateRequest':
          status = GroupReducer.status;
          break;
        case 'Group/groupCreateSuccess':
          status = GroupReducer.status;
          // props.navigation.navigate('CreateGroupSucess');
          break;
        case 'Group/groupCreateFailure':
          status = GroupReducer.status;
          break;
        case 'Group/groupInvitationSuccess':
          status = GroupReducer.status;
          setInvitedFriends(prev =>
            !prev.includes(GroupReducer.groupSendInvitationRes?.data?.user_id)
              ? [...prev, GroupReducer.groupSendInvitationRes?.data?.user_id]
              : prev,
          );
          friendlistrequest();
          break;
        case 'Group/groupInvitationFailure':
          status = GroupReducer.status;
          break;
      }
    }
  }, [GroupReducer?.status]);

  function friendlistrequest() {
    // tigerFriendListingRequest
    let data = {
      search:value,
      group_id: props?.route?.params?.groupId,
      page: 1,
      perpage: 100,
    };
    // console.log(props?.route?.params);

    dispatch(getGroupInviteDetailsRequest(data));
  }

  useEffect(() => {
    friendlistrequest();
  }, [isFocus,value]);

  function SendInvitation(item) {
    let obj = {
      group_id: GroupReducer?.groupCreateRes?.data?.[0]?._id,
      user_id: item?._id,
    };
    // console.log(obj, '<<<<<<<<<<<<<<<<<<<<<<<');
    dispatch(groupInvitationRequest(obj));
  }

  //
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
      <Loader visible={GroupReducer?.status === 'Group/groupCreateRequest'} />
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
            <Text style={styles.txt}>Create Group</Text>
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
              width: '32%',
              backgroundColor: Colors.orange,
            }}
          />
          <View
            style={{
              height: '100%',
              width: '32%',
              backgroundColor: Colors.orange,
            }}
          />
          <View
            style={{
              height: '100%',
              width: '32%',
              backgroundColor: Colors.orange,
            }}
          />
        </View>
        <View style={{marginHorizontal: normalize(15), flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(15),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: normalize(15),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
              }}>
              Invite Friends
            </Text>
            {invitedFriends?.length > 0 && (
              <Text
                style={{
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_SemiBold,
                  color: Colors.orange,
                }}>
                {invitedFriends?.length} Invited
              </Text>
            )}
          </View>

          <View
            style={{
              height: normalize(48),
              width: '100%',
              borderRadius: normalize(12),
              borderColor: props?.focus ? Colors.orange : Colors.borderColor,
              borderWidth: normalize(1),
              marginVertical: normalize(15),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: normalize(15),
              alignSelf: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '82%'}}>
              <TextInput
                style={{
                  color: '#383A46',
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_Regular,
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
            <Image
              source={Icons.inputsearch}
              style={{
                width: normalize(15),
                height: normalize(15),
                resizeMode: 'contain',
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={GroupReducer?.groupInviteFriendListRes?.data}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.placeholder,
                      fontSize: normalize(14),
                    }}>
                    No Friends to invite...
                  </Text>
                </View>
              }
              renderItem={({item, index}) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      height: normalize(67),
                      marginBottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: normalize(1),
                    }}>
                    <View
                      style={{
                        height: normalize(67),
                        width: normalize(70),
                        borderRadius: normalize(10),
                        overflow: 'hidden',
                      }}>
                      <Image
                        style={{
                          height: '100%',
                          width: '100%',
                          resizeMode: 'cover',
                          borderWidth: 1,
                          borderRadius: 20,
                        }}
                        source={
                          item?.friend_details?.profile_image !== ''
                            ? {
                                uri:
                                  constants?.IMAGE_URL +
                                  'user/' +
                                  item?.friend_details?.profile_image,
                              }
                            : Icons.usernoimage
                        }
                      />
                    </View>
                    <View style={{flex: 1, paddingHorizontal: normalize(10)}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: normalize(12),
                          fontFamily: Fonts.OpenSans_SemiBold,
                          color: Colors.textBlack,
                        }}>
                        {item?.friend_details?.first_name}{' '}
                        {item?.friend_details?.last_name}
                      </Text>
                      {item?.friend_details?.is_studying_in_the_university ===
                      'Yes' ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(11),
                            fontFamily: Fonts.OpenSans_Regular,
                            color: Colors.textBlack,
                          }}>
                          {item?.friend_details?.degree?.title}
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: normalize(11),
                            fontFamily: Fonts.OpenSans_Regular,
                            color: Colors.textBlack,
                          }}>
                          {item?.friend_details?.degree?.title} of{' '}
                          {moment(item?.friend_details?.friend_since)?.format(
                            'YYYY',
                          )}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={{
                        height: normalize(30),
                        width: normalize(55),
                        backgroundColor:
                          item?.isInvited === true
                            ? 'rgba(100,185,86,0.2)'
                            : '#64B956',
                        borderRadius: normalize(8),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => SendInvitation(item?.friend_details)}>
                      <Text
                        style={{
                          color:
                            item?.isInvited === true ? '#64B956' : Colors.white,
                          fontSize: normalize(12),
                          fontFamily: Fonts.OpenSans_Regular,
                        }}>
                        {item?.isInvited === true ? 'Invited' : 'Invite'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(0),
              marginBottom: normalize(8),
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Groups', {goToCreatedGroups: true});
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
                Done
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Groups', {goToCreatedGroups: true});
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatedGroupStep3;

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
});
