import React from 'react';
import {StatusBar, Platform, StyleSheet, SafeAreaView} from 'react-native';
import propTypes from 'prop-types';
import {Colors} from '../../themes/Colors';
import normalize from '../helpers/dimen';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({backgroundColor, barStyle, translucent, ...props}) => (
  <SafeAreaView style={Platform.OS === 'ios' && [{backgroundColor}]}>
    <StatusBar
      translucent={!translucent}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      hidden={false}
    />
  </SafeAreaView>
);

export default MyStatusBar;
MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  height: propTypes.number,
  translucent: propTypes.bool,
};

MyStatusBar.defaultProps = {
  backgroundColor: Colors.black,
  barStyle: 'light-content',
  height: normalize(20),
  translucent: false,
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
