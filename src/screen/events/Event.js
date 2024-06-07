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
  BackHandler,
} from 'react-native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import React, {useEffect, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {ImageBackground} from 'react-native';
import {Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  EventCompletedRequest,
  EventDetailsRequest,
  EventListRequest,
  EventUpcomingRequest,
  RelatedEventRequest,
} from '../../redux/reducer/EventReducer';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const Event = props => {
  const [selectedButtonId, setSelectedButtonId] = useState(1);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const [currentPage, setCurrentPage] = useState(1);
  const EventReducer = useSelector(state => state?.EventReducer);
  let perPage = 100;

  const buttonArr = [
    {
      id: 1,
      title: 'Created',
      // fetchData: () => {
      //   dispatch(EventListRequest({page: currentPage, perpage: perPage}));
      // },
    },
    {
      id: 2,
      title: 'Upcoming',
      // fetchData: () => {
      //   dispatch(EventUpcomingRequest({page: currentPage, perpage: perPage}));
      // },
    },
    {
      id: 3,
      title: 'Completed',
      // fetchData: () => {
      //   dispatch(EventCompletedRequest({page: currentPage, perpage: perPage}));
      // },
    },
  ];

  function EventList(page) {
    let obj = {
      page: page,
      perpage: perPage,
    };
    dispatch(EventUpcomingRequest(obj));
  }

  function UpcomingEvent(page) {
    let obj = {
      page: page,
      perpage: perPage,
    };
    dispatch(EventUpcomingRequest(obj));
  }

  function CompletedEvent(page) {
    let obj = {
      page: page,
      perpage: perPage,
    };
    dispatch(EventUpcomingRequest(obj));
  }

  useEffect(() => {
    dispatch(
      EventListRequest({
        page: currentPage,
        perpage: perPage,
      }),
    );
  }, [isFocus]);

  useEffect(() => {
    let newData = [];
    switch (selectedButtonId) {
      case 1:
        dispatch(EventListRequest({page: currentPage, perpage: perPage}));
        break;
      case 2:
        dispatch(EventUpcomingRequest({page: currentPage, perpage: perPage}));
        break;
      case 3:
        dispatch(EventCompletedRequest({page: currentPage, perpage: perPage}));
        break;
      default:
        break;
    }
  }, [selectedButtonId]);

  useEffect(() => {
    let status = '';
    if (status == '' || EventReducer.status != status) {
      switch (EventReducer.status) {
        case 'Event/EventListRequest':
          status = EventReducer.status;
          break;
        case 'Event/EventListSuccess':
          status = EventReducer.status;
          if (EventReducer?.eventRequestListRes?.page === 1) {
            setCreatedEvents(EventReducer?.eventRequestListRes?.data);
          } else {
            setUpcomingEvents([
              ...createdEvents,
              ...EventReducer?.eventRequestListRes?.data,
            ]);
          }
          break;
        case 'Event/EventListFailure':
          status = EventReducer.status;
          break;

        case 'Event/EventUpcomingRequest':
          status = EventReducer.status;
          break;
        case 'Event/EventUpcomingSuccess':
          status = EventReducer.status;
          if (EventReducer?.eventUpcomingListRes?.page === 1) {
            setUpcomingEvents(EventReducer?.eventUpcomingListRes?.data);
          } else {
            setUpcomingEvents([
              ...upcomingEvents,
              ...EventReducer?.eventUpcomingListRes?.data,
            ]);
          }
          break;
        case 'Event/EventUpcomingFailure':
          status = EventReducer.status;
          break;

        case 'Event/EventCompletedRequest':
          status = EventReducer.status;
          break;
        case 'Event/EventCompletedSuccess':
          status = EventReducer.status;
          if (EventReducer?.eventUpcomingListRes?.page === 1) {
            setCompletedEvents(EventReducer?.eventCompletedRes?.data);
          } else {
            setCompletedEvents([
              ...completedEvents,
              ...EventReducer?.eventCompletedRes?.data,
            ]);
          }
          break;
        case 'Event/EventCompletedFailure':
          status = EventReducer.status;
          break;
      }
    }
  }, [EventReducer?.status]);

  function CallFlatList() {
    if (
      EventReducer.status != 'Event/EventListRequest' &&
      EventReducer?.eventRequestListRes?.page <
        EventReducer?.eventRequestListRes?.pages
    ) {
      EventList(EventReducer?.eventRequestListRes?.page + 1);
      console.log('hellodxsad');
    } else if (
      EventReducer.status != 'Event/EventUpcomingRequest' &&
      EventReducer?.eventUpcomingListRes?.page <
        EventReducer?.eventUpcomingListRes?.pages
    ) {
      UpcomingEvent(EventReducer?.eventUpcomingListRes?.page + 1);
    } else if (
      EventReducer.status != 'Event/EventCompletedRequest' &&
      EventReducer?.eventCompletedRes?.page <
        EventReducer?.eventCompletedRes?.pages
    ) {
      CompletedEvent(EventReducer?.eventCompletedRes?.pages + 1);
    }
  }

  // useEffect(() => {
  //   let newData = [];
  //   switch (selectedButtonId) {
  //     case 1:
  //       newData = EventReducer?.eventRequestListRes?.data || [];
  //       setCreatedEvents(newData);
  //       console.log(EventReducer?.eventRequestListRes, '>>>>>>>>>event');
  //       break;
  //     case 2:
  //       newData = EventReducer?.eventUpcomingListRes?.data || [];
  //       setUpcomingEvents(newData);
  //       console.log(newData, '>>>>>>>>>event');
  //       break;
  //     case 3:
  //       newData = EventReducer?.eventCompletedRes?.data || [];
  //       setCompletedEvents(newData);
  //       console.log(newData, '>>>>>>>>>completed');
  //       break;
  //     default:
  //       break;
  //   }
  // }, [EventReducer]);

  //   <Pressable
  //   onPress={() => {
  //     props.navigation.navigate('EventDetails');
  //   }}
  //   key={index}
  //   style={{
  //     marginBottom: index == 2 ? normalize(220) : normalize(10),
  //   }}>
  //   <ImageBackground
  //     source={Icons.extra5}
  //     style={{
  //       height: normalize(160),
  //       width: '100%',
  //       borderRadius: normalize(10),
  //       overflow: 'hidden',
  //     }}>
  //     {selectedButtonId == 1 && (
  //       <Image
  //         source={Icons.messageEdit}
  //         style={{
  //           height: normalize(25),
  //           width: normalize(25),
  //           position: 'absolute',
  //           right: normalize(10),
  //           top: normalize(10),
  //         }}
  //       />
  //     )}
  //   </ImageBackground>
  //   {/* details */}

  //   <View
  //     style={{
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       justifyContent: 'space-between',
  //       marginTop: normalize(5),
  //     }}>
  //     <View style={{}}>
  //       <Text
  //         style={{
  //           fontSize: normalize(13),
  //           fontFamily: Fonts.OpenSans_SemiBold,
  //           color: Colors.textBlack,
  //         }}>
  //         University Group 2022
  //       </Text>
  //       <Text
  //         style={{
  //           marginTop: normalize(2),
  //           fontSize: normalize(11),
  //           fontFamily: Fonts.OpenSans_Regular,
  //           color: Colors.textBlack,
  //           opacity: 0.8,
  //         }}>
  //         Economics | Exam Preparations
  //       </Text>
  //       <Text
  //         style={{
  //           marginTop: normalize(3),
  //           fontSize: normalize(12),
  //           fontFamily: Fonts.OpenSans_Regular,
  //           color: Colors.textBlack,
  //         }}>
  //         SUN, DEC 03 AT 20:30PM
  //       </Text>
  //     </View>
  //   </View>
  // </Pressable>

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

  const RenderItem = ({item, index}) => {
    // console.log(item, '>>>>>>>>item');
    return (
      <TouchableOpacity
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
          marginBottom:
            index ==
            (selectedButtonId === 1
              ? createdEvents.length
              : selectedButtonId === 2
                ? upcomingEvents.length
                : completedEvents.length)
              ? normalize(220)
              : normalize(10),
        }}>
        <ImageBackground
          source={
            item?.event_image !== ''
              ? {
                  uri: constants.IMAGE_URL + 'event/' + item?.event_image,
                }
              : Icons.noImage
          }
          style={{
            height: normalize(160),
            width: '100%',
            borderRadius: normalize(10),
            overflow: 'hidden',
          }}>
          {/* {selectedButtonId == 1 && (
            <Image
              source={Icons.messageEdit}
              style={{
                height: normalize(25),
                width: normalize(25),
                position: 'absolute',
                right: normalize(10),
                top: normalize(10),
              }}
            />
          )} */}
        </ImageBackground>
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
              {moment(item?.date).format('llll')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNoDataFound = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: normalize(240),
        }}>
        <Text style={{color: Colors.placeholder, fontSize: normalize(14)}}>
          No Data Found
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader visible={EventReducer?.status === 'Event/EventListRequest'} />
      <Loader visible={EventReducer?.status === 'Event/EventUpcomingRequest'} />
      <Loader
        visible={EventReducer?.status === 'Event/EventCompletedRequest'}
      />
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
          <Text style={styles.txt}>Events</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      {/* buttons */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: normalize(20),
          marginTop: normalize(25),
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {buttonArr.map((item, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  // item.fetchData();
                  setSelectedButtonId(item.id);
                }}
                style={{
                  height: normalize(35),
                  width: '31%',
                  backgroundColor:
                    selectedButtonId == item.id
                      ? 'rgba(242,124,36,0.2)'
                      : 'transparent',
                  borderRadius: normalize(50),
                  //   marginRight: index == 1 ? 0 : normalize(10),
                  marginHorizontal: index == 1 ? normalize(10) : 0,
                  borderColor: '#F4F3F3',
                  borderWidth: normalize(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color:
                      selectedButtonId == item.id ? Colors.orange : '#383A46',
                    fontSize: normalize(11),
                    fontFamily: Fonts.OpenSans_Medium,
                  }}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{marginHorizontal: normalize(20), marginTop: normalize(10)}}>
        {((selectedButtonId === 1 && createdEvents.length === 0) ||
          (selectedButtonId === 2 && upcomingEvents.length === 0) ||
          (selectedButtonId === 3 && completedEvents.length === 0)) &&
          renderNoDataFound()}
        {((selectedButtonId === 1 && createdEvents.length > 0) ||
          (selectedButtonId === 2 && upcomingEvents.length > 0) ||
          (selectedButtonId === 3 && completedEvents.length > 0)) && (
          <FlatList
            data={
              selectedButtonId === 1
                ? createdEvents
                : selectedButtonId === 2
                  ? upcomingEvents
                  : completedEvents
            }
            renderItem={RenderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item?.toString()}
            onEndReached={() => {
              CallFlatList();
              console.log('hello flatlist');
            }}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
              paddingBottom: normalize(150),
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Event;

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
