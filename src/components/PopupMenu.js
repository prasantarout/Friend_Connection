// PopupMenu.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import normalize from '../utils/helpers/dimen';
import {verticalScale} from '../utils/helpers/dimen1';
import { Colors } from '../themes/Colors';

const {height, width} = Dimensions.get('window');

const PopupMenu = ({visible, onClose, onEdit, onDelete, type}) => {
  if (!visible) {
    return null; // If not visible, don't render anything
  }

  let item = [
    {
      id: 1,
      title: 'Delete Post',
    },
    // {
    //   id: 2,
    //   title: 'Edit Post',
    // },
    // {
    //   id: 3,
    //   title: 'Cancel',
    // },
  ];

  return (
    <TouchableOpacity onPress={() => {
        onDelete();
        // onClose();
      }} style={styles.popupContainer}>
      <View style={styles.menuContainer}>
        {/* {item.map((item, index) => ( */}
          <View
            key={item.id}
            style={[styles.menuItem,{width:'100%',height:'100%',
        }]}
            // onPress={() => {
            //   onDelete();
            //   onClose();
            // }}
            >
            <Text style={styles.menuText}>
              {type === 'poll' ? 'Delete Poll' : 'Delete Post'}
            </Text>
          </View>
        {/* ))} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    right: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: normalize(28),
  },
  menuContainer: {
    backgroundColor:Colors.orange,
    width: width - normalize(210),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  menuItem: {
    // padding: normalize(10),
    // borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  menuText: {
    color: 'white',
    fontSize: normalize(12),
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PopupMenu;
