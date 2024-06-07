import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Fonts, Icons} from '../themes/ImagePath';
import normalize from '../utils/helpers/dimen';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import constants from '../utils/helpers/constants';
import AuthReducer, { getProfileRequest } from '../redux/reducer/AuthReducer';
const RoundProfileStatus = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const allFeedList = useSelector(state => state?.HomeReducer?.allFeedList);
  const getProfileRes = useSelector(state => state.AuthReducer?.getProfileRes);
  const [AllUsersFeedDataWithMe, setAllUsersFeedDataWithMe] = useState([]);

  const getAllFeed = () => {
    try {
      let myFeedTemp;
      if (allFeedList?.my_status_feed != null) {
        myFeedTemp = allFeedList?.my_status_feed;
      } else {
        myFeedTemp = {
          _id: '',
          full_name: 'You',
          profile_image: getProfileRes?.data?.profile_image,
          status: [],
        };
      }
      setAllUsersFeedDataWithMe([myFeedTemp, ...allFeedList?.data]);
    } catch (error) {
      console.error('getAllFeed>>', error);
    }
  };
  useEffect(() => {
    getAllFeed();
  }, [allFeedList,getProfileRes]);



  return (
    <View style={styles.container_wrapper}>
      <ScrollView
        horizontal
        contentContainerStyle={[styles.scrollViewContent, {paddingRight: 1}]}
        showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          {/* All feeds */}
          {AllUsersFeedDataWithMe?.map((item, index) => (
            <TouchableOpacity
              key={index}
              disabled={item._id == ''}
              onPress={() => {
                // console.log({
                //   currentIndex:
                //     AllUsersFeedDataWithMe[0]._id == '' ? index - 1 : index,
                //   allFeedList:
                //     AllUsersFeedDataWithMe[0]._id == ''
                //       ? AllUsersFeedDataWithMe.slice(1).length
                //       : AllUsersFeedDataWithMe.length,
                // });
                // return;
                navigation?.navigate('StoryDetailsPage', {
                  currentIndex:
                    AllUsersFeedDataWithMe[0]._id == '' ? index - 1 : index,
                  allFeedList:
                    AllUsersFeedDataWithMe[0]._id == ''
                      ? AllUsersFeedDataWithMe.slice(1)
                      : AllUsersFeedDataWithMe,
                });
              }}
              style={styles.profileContainer}>
              <ImageBackground
                source={item._id == '' ? Icons.ellipse1 : Icons.ellipse}
                style={styles.iconBackground}
              />
              {index == 0 && (
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate('CreateStoryStep1');
                  }}
                  style={styles.circleIcon}>
                  <Image source={Icons.circle} style={styles.circleImage} />
                </TouchableOpacity>
              )}
              <Image
                source={
                  item.profile_image !== "" &&
                  item?.profile_image !== null &&
                  item?.profile_image !== undefined
                    ? {uri: constants.IMAGE_URL + 'user/' + item.profile_image}
                    : Icons.usernoimage
                }
                style={styles.profilePicture}
              />
              <Text style={styles.profileName}>
                {' '}
                {index == 0 ? 'You' : item.full_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RoundProfileStatus;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // marginTop: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginHorizontal: normalize(3),
    marginTop: normalize(0),
    // marginRight: normalize(10),
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
    // resizeMode:"contain"
  },
  circleIcon: {
    position: 'absolute',
    bottom: normalize(15),
    zIndex: 55555,
    left: normalize(40),
  },
  circleImage: {
    width: normalize(21),
    height: normalize(21),
  },
  profileName: {
    fontSize: normalize(10),
    lineHeight: normalize(10.89),
    textAlign: 'center',
    fontFamily: Fonts.OpenSans_Medium,
    marginTop: normalize(6),
    color: '#1F2440',
  },
  container_wrapper: {
    marginTop: normalize(10), // Adjust the margin as needed
  },
});
