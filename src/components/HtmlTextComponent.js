import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {Colors} from '../themes/Colors';
import {Fonts} from '../themes/ImagePath';
const HtmlTextComponent = props => {
  const {htmlContent, style = {}} = props ? props : '';
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedHtml = htmlContent && htmlContent?.slice(0, 200);
  // console.log(htmlContent,"htmlContent");
  // const htmlText = htmlContent && htmlContent.replace(/(<\/.+>)(\s+)(<)/g, '');
  return (
    <View style={{}}>
      <HTMLView
        addLineBreaks={false}
        value={
          isExpanded
            ? htmlContent
            : props?.register === 5
              ? htmlContent
              : truncatedHtml
        }
        stylesheet={{...styles, ...style}}
      />
      <>
        {props?.register !== 5 && (
          <>
            {htmlContent?.length > 200 && (
              <TouchableOpacity
                onPress={toggleReadMore}
                style={{marginTop: normalize(10)}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.orange,
                    flexDirection: 'row',
                  }}>
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  p: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 15,
    color: Colors.black,
    fontWeight: '400',
    top: 10,
  },
  div: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    color: Colors.black,
  },
  strong: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    color: Colors.black,
  },
  a: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    color: Colors.black,
    textDecorationLine: 'underline',
  },
  li: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
    color: Colors.black,
  },
});
export default HtmlTextComponent;
