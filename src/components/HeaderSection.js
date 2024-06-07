import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MyStatusBar from '../utils/helpers/MyStatusBar';
import {horizontalScale} from '../utils/helpers/dimen1';
import {Icons} from '../themes/ImagePath';
import normalize from '../utils/helpers/dimen';
import {Colors} from '../themes/Colors';
import {useNavigation} from '@react-navigation/native';

const HeaderSection = ({style}) => {
  const dataItem = [
    {id: 1, icon: Icons.search},
    {id: 2, icon: Icons.message},
    {id: 3, icon: Icons.calender},
    {id: 4, icon: Icons.group},
    {id: 5, icon: Icons.notification},
  ];
  const navigation = useNavigation();
  return (
    <View style={[style && style]}>
      <View style={styles.container_wrapper}>
        <Image
          source={Icons.tiger2}
          style={{
            width: normalize(80),
            height: normalize(32.53),
            resizeMode: 'contain',
            // mart
          }}
        />

        <View style={styles.iconContainer}>
          {dataItem.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                item?.id == 5
                  ? navigation?.navigate('Notification')
                  : item?.id == 1
                    ? navigation?.navigate('Search')
                    : item?.id == 2
                      ? navigation?.navigate('Messaging')
                      : item?.id == 3
                        ? navigation?.navigate('Event')
                        : item?.id == 4
                          ? navigation?.navigate('Groups')
                          : {}
              }
              key={item.id}
              style={[
                styles.iconWrapper,
                {
                  borderWidth: 0.5,
                  // elevation: 0.1,
                  borderRadius: normalize(50),
                  height: normalize(25),
                  width: normalize(25),
                  borderColor: Colors.placeholder,
                },
              ]}>
              <Image source={item.icon} style={styles.icon} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View
        style={{
          borderWidth: 1,
          marginTop: normalize(10),
          borderColor: Colors.background,
        }}
      />
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  container_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: horizontalScale(20),
    paddingTop: Platform?.OS === 'ios' ? normalize(10) : normalize(10),
  },
  iconContainer: {
    flex: 0.76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: normalize(15),
    width: normalize(15),
  },
});
