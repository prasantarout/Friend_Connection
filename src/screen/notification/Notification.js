import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import {useDispatch, useSelector} from 'react-redux';
import {notificationlistRequest} from '../../redux/reducer/AuthReducer';
import moment from 'moment';
let status = '';
const Notification = props => {
  const [subject, setSubject] = useState('');
  const [isSubjectFocus, setIsSubjectFocus] = useState(false);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [statement, setStatement] = useState('');
  const [isStatementFocus, setIsStatementFocus] = useState(false);
  const dispatch = useDispatch();
  const [page, setpage] = useState(1);
  const [data, setdata] = useState([]);

  useEffect(() => {
    let data = {
      page: page,
      perpage: 5,
      search: '',
    };
    connectionrequest()
      .then(() => {
        dispatch(notificationlistRequest(data));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
        // console.log('66',err)
      });
  }, []);

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

  function renderItem({item, index}) {
    console.log(item,">>>>>>>.")
    return (
      <View
        style={{flexDirection: 'row', width: '100%', marginTop: normalize(20)}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: normalize(20),
          }}
          onPress={() => {
            if (item?.type!=='event') {
              return;
            } else {
              props?.navigation.navigate('EventDetails', {
                eventId: item?.event_id,
              });
            }
          }}>
          <View style={{width: '24%'}}>
            <Image
              source={Icons.notificationemail}
              style={{
                width: '100%',
                height: normalize(50),
                resizeMode: 'contain',
              }}
            />
            {/* {item?.read && (
            <View
              style={{
                width: normalize(12),
                height: normalize(12),
                backgroundColor: 'green',
                borderRadius: normalize(6),
                position: 'absolute',
                right: normalize(2),
                borderWidth: normalize(2),
                borderColor: 'white',
                top: -normalize(5),
              }}
            />
          )} */}
          </View>
          <View style={{width: '74%', marginLeft: '2%'}}>
            <Text
              style={{
                fontFamily: Fonts.OpenSans_Medium,
                color: Colors.black,
                fontSize: normalize(11),
              }}>
              {''}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: Fonts.OpenSans_Light,
                color: Colors.black,
                fontSize: normalize(10),
              }}>
              {item?.notification_message}
            </Text>
            <Text
              style={{
                alignSelf: 'flex-end',
                fontFamily: Fonts.OpenSans_Regular,
                fontSize: normalize(10),
                color: '#A0A0A0',
              }}>
              {moment(item?.createdAt).format('HH:MM a')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function onENdFunction() {
    let data = {
      page: page + 1,
      perpage: 5,
      search: '',
    };

    connectionrequest()
      .then(() => {
        dispatch(notificationlistRequest(data));
      })
      .catch(err => {});
    setpage(page + 1);
  }
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/notificationlistRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/notificationlistSuccess':
        status = AuthReducer.status;
        console.log(AuthReducer?.notificationlistRes);
        AuthReducer?.notificationlistRes?.page == 1
          ? setdata(AuthReducer?.notificationlistRes?.data)
          : setdata([...data, ...AuthReducer?.notificationlistRes?.data]);

        break;
      case 'Auth/notificationlistFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
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
          <Text style={styles.txt}>Notification</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>

      {data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          style={{width: '90%', alignSelf: 'center'}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: normalize(30)}}
          onEndReached={() => {
            AuthReducer.status != 'Auth/notificationlistRequest' &&
              AuthReducer?.notificationlistRes?.page <
                AuthReducer?.notificationlistRes?.pages &&
              //  setpage(page+1),
              onENdFunction();
          }}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: normalize(14),
              fontFamily: Fonts.OpenSans_Bold,
              color: Colors.lightGrey,
            }}>
            Not yet receive notification
          </Text>
        </View>
      )}
    </View>
  );
};
export default Notification;

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
});
