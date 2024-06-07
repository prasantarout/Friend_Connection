import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {Fonts, Icons} from '../../../themes/ImagePath';
import normalize from '../../../utils/helpers/dimen';
import constants from '../../../utils/helpers/constants';
const Media = ({mediaDataItem}) => {
  // console.log(mediaDataItem, '>>>>>>.mediaData');
  let mediaData = [
    {
      id: 1,
      icon: Icons.uni1,
    },
    {
      id: 2,
      icon: Icons.uni2,
    },
    {
      id: 3,
      icon: Icons.uni2,
    },
    {
      id: 4,
      icon: Icons.uni2,
    },
    {
      id: 5,
      icon: Icons.uni2,
    },
    {
      id: 6,
      icon: Icons.uni2,
    },
  ];
  const [renderData, setRenderData] = React.useState([]);
  const renderItem = ({item}) => {
    return (
      <>
        {item?.map((photo, index) => {
          return (
            <View style={styles.itemContainer} key={index}>
              <Image
                source={
                  photo?.media_url !== ''
                    ? {
                        uri:
                          constants?.IMAGE_URL +
                          'post/media/' +
                          photo?.media_url,
                      }
                    : Icons.uni2
                }
                style={styles.image}
              />
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerText}>Media</Text> */}
        <TouchableOpacity>
          <Text style={styles.viewAllText}>{/* View All */}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mediaDataItem}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontWeight: '600',
    fontSize: normalize(14),
    lineHeight: 19.9,
    fontFamily: Fonts.OpenSans_Medium,
    color: '#1F2440',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Medium,
    color: '#F27C24',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1, // Ensure square aspect ratio for images
    overflow: 'hidden',
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Media;
