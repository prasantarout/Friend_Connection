import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Fonts, Icons} from '../themes/ImagePath';
import normalize from '../utils/helpers/dimen';
import {TextInput} from 'react-native';
import {Colors} from '../themes/Colors';
import {Platform} from 'react-native';
const CustomChipComponent = ({toptext, placeholder, getData, sendItem}) => {
  const [chips, setChips] = useState(sendItem);
  const [inputText, setInputText] = useState('');
  const [isContainFocus, setIsContainFocus] = useState(false);
  const handleAddChip = () => {
    if (inputText.trim() !== '') {
      setChips([...chips, inputText.trim()]);
      setInputText('');
    }
  };
  const handleDeleteChip = index => {
    const newChips = [...chips];
    newChips.splice(index, 1);
    setChips(newChips);
  };
  useEffect(() => {
    getData(chips);
  }, [chips]);

  const CustomInputChip = ({label, onDelete}) => {
    return (
      <View style={styles.chipContainer}>
        <Text style={styles.chipText}>{label}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteIconContainer}>
          <Image
            source={Icons.delete}
            style={{height: normalize(15), width: normalize(15)}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        marginTop: normalize(10),
        borderWidth: 1,
        borderRadius: 20,
        borderColor: isContainFocus ? Colors.orange : '#e0e0e0',
        padding: normalize(11),
      }}>
      {isContainFocus && (
        <Text
          style={{
            color: Colors.orange,
            fontFamily: Fonts.Nunito_Regular,
            fontSize: normalize(12),
            position: 'absolute',
            top: normalize(-9),
            backgroundColor: 'white',
            left: normalize(14),
          }}>
          {` ${toptext} `}
        </Text>
      )}
      {isContainFocus == false && (
        <Text
          style={{
            color: '#A0A0A0',
            fontFamily: Fonts.Nunito_Regular,
            fontSize: normalize(12),
            marginTop: normalize(6),
          }}>
          {toptext}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#909090"
        style={{
          marginTop: Platform.OS == 'android' ? 0 : normalize(8),
          color: '#383A46',
          fontSize: normalize(13),
          fontFamily: Fonts.OpenSans_Regular,
          fontWeight: '600',
        }}
        placeholder={placeholder ? placeholder : ''}
        value={inputText}
        onChangeText={text => setInputText(text)}
        onFocus={() => setIsContainFocus(true)}
        onBlur={() => {
          handleAddChip();
          setIsContainFocus(false);
        }}
        onSubmitEditing={handleAddChip}
      />

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chips.map((chip, index) => (
            <CustomInputChip
              key={index}
              label={chip}
              onDelete={() => handleDeleteChip(index)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: normalize(10),
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#e0e0e0',
    padding: normalize(11),
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: normalize(12),
    // marginVertical: 8,
    marginTop: normalize(5),
    marginRight: normalize(8),
  },
  chipText: {
    marginRight: 8,
    color: '#000000',
  },
  deleteIconContainer: {
    marginLeft: 'auto',
  },
  inputContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  input: {
    flex: 1,
    height: normalize(40),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: normalize(16),
  },
  chipsContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default CustomChipComponent;
