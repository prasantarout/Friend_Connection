import {Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import React from 'react';
import normalize from '../utils/helpers/dimen';
import {Icons, Fonts} from '../themes/ImagePath';
import {Colors} from '../themes/Colors';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import constants from '../utils/helpers/constants';
import LinearGradient from 'react-native-linear-gradient';

export default function FriendCard({item, index, type}) {
  const navigation = useNavigation();

  return (
    <View
      key={index}
      style={{
        paddingVertical: normalize(5),
        width: '48%',
        marginBottom: normalize(10),
      }}>
      <TouchableOpacity
        style={[
          styles.friendContainer,
          {
            marginTop: 0,
          },
        ]}
        onPress={() => {
          navigation.navigate('FriendProfileDetails', {
            id: item?._id,
            type,
          });
        }}>
        <Image
          source={
            item?.profile_image == ''
              ? Icons.usernoimage
              : {uri: constants?.IMAGE_URL + 'user/' + item?.profile_image}
          }
          style={[
            styles.friendImage,
            {resizeMode: item?.profile_image == '' ? 'contain' : 'stretch'},
          ]}
        />
        {type == 'Friends' && (
          <View style={[styles.boxContainer, {backgroundColor: '#64B956'}]}>
            <TouchableOpacity>
              <Image
                source={Icons.box}
                style={{
                  width: normalize(12),
                  height: normalize(12),
                  tintColor: Colors.white,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        <LinearGradient
          colors={['transparent', '#00000080']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.infoContainer}>
          {item.expertise_area.slice(0, 1).map(_expertise => (
            <View
              style={{
                paddingHorizontal: normalize(9),
                paddingVertical: normalize(4),
                backgroundColor: 'rgba(246, 249, 239,0.25)',
                borderRadius: 25,
              }}>
              <Text
                style={[
                  styles.friendName,
                  {
                    maxWidth:
                      item.expertise_area.length > 1 ? normalize(65) : 'auto',
                  },
                ]}
                numberOfLines={1}>
                {_expertise}
              </Text>
            </View>
          ))}
          {item.expertise_area.length > 1 && (
            <View
              style={{
                paddingHorizontal: normalize(9),
                paddingVertical: normalize(4),
                backgroundColor: 'rgba(246, 249, 239,0.25)',
                borderRadius: 25,
              }}>
              <Text style={styles.friendStatus}>
                +{item.expertise_area.length - 1}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={{marginTop: 10}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: normalize(14),
            fontWeight: '700',
            lineHeight: normalize(19.07),
            fontFamily: Fonts.OpenSans_Light,
            color: '#1F2440',
            maxWidth: '90%',
          }}>
          {item?.first_name + ' ' + item?.last_name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: normalize(11),
            fontWeight: '400',
            lineHeight: normalize(13.62),
            fontFamily: Fonts.OpenSans_Medium,
            color: '#1F2440',
            maxWidth: '90%',
            marginVertical: normalize(2),
          }}>
          {`Class of ${item?.graduation_date}`
           }{' '}
          {/* {item?.graduation_date} */}
          {/* {item?.is_studying_in_the_university === 'Yes' && 'Current Student'} */}
          ,{' '}
          {item?.degree?.title} in {item?.education_stream?.title}
        </Text>
        {/* <Text
          style={{
            fontSize: normalize(10),
            fontWeight: '400',
            lineHeight: normalize(13.62),
            fontFamily: Fonts.OpenSans_Light,
            color: '#1F244070',
          }}>
          {item.phone}
        </Text> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  tabButton: {
    padding: normalize(10),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(40),
    borderColor: '#F4F3F3',
    backgroundColor: Colors.white,
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',

    // Adjust the margin as needed
  },
  friendContainer: {
    width: (Dimensions.get('window').width - normalize(50)) / 2, // Calculate width based on screen width and margin
    // width: (Dimensions.get('window').width - normalize(50)) / 2, // Calculate width based on screen width and margin
    alignItems: 'center',
    // marginHorizontal: normalize(10),
    marginTop: normalize(15),
    aspectRatio: 4 / 5,
  },
  friendImage: {
    width: '100%', // Make the image take the full width of the container
    // height: normalize(120),
    flex: 1,
    borderRadius: normalize(10),
    // marginLeft:10
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'flex-end',
    // alignContent: 'flex-end',
    gap: normalize(7),
    // justifyContent: 'space-evenly',
    padding: normalize(5),
    paddingBottom: normalize(10),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
