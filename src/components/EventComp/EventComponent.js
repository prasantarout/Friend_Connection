import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../themes/Colors';
import {Fonts, Icons} from '../../themes/ImagePath';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  EventDetailsRequest,
  EventListRequest,
} from '../../redux/reducer/EventReducer';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
const EventComponent = props => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const EventReducer = useSelector(state => state?.EventReducer);
  // console.log(EventReducer?.eventRequestListRes?.data, 'DSadsjd');
  let perPage = 10;
  useEffect(() => {
    dispatch(EventListRequest({page: currentPage, perpage: perPage}));
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.header}
      onPress={() => {
        navigationRef?.navigate('EventDetails'),
          dispatch(EventDetailsRequest({id: item?._id}));
      }}>
      <View style={styles.icon_wrapper}>
        <Image
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
          }}
        />
      </View>

      <Text
        style={{
          fontSize: normalize(14),
          fontWeight: '600',
          lineHeight: normalize(19.07),
          marginTop: 10,
          color: '#1F2440',
        }}>
        {item?.eventName}
      </Text>
      <Text style={styles.desc}>
        <Text style={styles.blueText}>{item.eventLocation}</Text>
      </Text>
      <Text style={styles.time}>{moment(item?.date).format('llll')}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: normalize(25),
        }}>
        <View>
          <Text
            style={{
              fontWeight: '600',
              fontSize: normalize(14),
              lineHeight: normalize(19.9),
              fontFamily: Fonts.OpenSans_Medium,
              color: '#1F2440',
            }}>
            Events
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigationRef?.navigate('Event')}>
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
      </View>
      <FlatList
        data={
          EventReducer?.eventRequestListRes?.data?.length > 0
            ? EventReducer?.eventRequestListRes?.data
            : []
        }
        renderItem={renderItem}
        keyExtractor={item => item?._id}
      />
    </View>
  );
};

export default EventComponent;

const styles = StyleSheet.create({
  header: {
    marginVertical: normalize(1),
  },
  backgroundImage: {
    width: '100%',
    height: normalize(180),
    marginTop: normalize(10),

    // borderRadius: normalize(10),
  },
  icon_wrapper: {
    alignItems: 'center',
    marginTop: normalize(15),
  },
  desc: {
    fontSize: normalize(10),
    width: '100%',
    color: '#1F2440',
    textAlign: 'justify',
    fontFamily: Fonts.OpenSans_Medium,
    fontWeight: '400',
  },
  time: {
    fontSize: normalize(12),
    color: '#1F2440',
    lineHeight: normalize(13.26),
    fontFamily: Fonts.OpenSans_Regular,
    marginTop: normalize(5),
  },
  blueText: {
    color: '#1F2440',
    fontSize: normalize(10),
    fontWeight: '400',
    lineHeight: normalize(13.26),
    fontFamily: Fonts.OpenSans_Light,
    marginTop: normalize(5),
  },
});
