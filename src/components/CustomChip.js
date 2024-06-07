import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Icons} from '../themes/ImagePath';
import normalize from '../utils/helpers/dimen';
import TextInputItem from './TextInput';
const CustomChip = ({getData, sendItem,flag}) => {
  const [chips, setChips] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAgeFocus, setIsAgeFocus] = useState(false);

  useEffect(() => {
    if (sendItem) {
      setChips(sendItem);
    }
  }, [sendItem]);
  const handleAddChip = () => {
    if (inputText?.trim() !== '') {
      setChips([...chips, inputText?.trim()]);
      setInputText('');
    }
  };

  const handleDeleteChip = index => {
    const newChips = [...chips];
    newChips.splice(index,1);
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInputItem
          toptext={flag===15 ? 'Tags':'Expertise Area*'}
          placeholder={flag===15 ?'Enter your Tags':'Enter your Expertise'}
          width="100%"
          height={'80%'}
          //   keyboardType="phone-pad"
          value={inputText}
          onChangeText={text => setInputText(text)}
          onFocus={() => setIsAgeFocus(true)}
          onBlur={() => {
            handleAddChip();
            setIsAgeFocus(false);
          }}
          onSubmitEditing={handleAddChip}
          focus={isAgeFocus}
          flag={19}
        />

        {/* <TextInput
          style={styles.input}
          placeholder="Add a chip"
          value={inputText}
          onChangeText={text => setInputText(text)}
          onFocus={() => setIsAgeFocus(true)}
          onBlur={() => setIsAgeFocus(false)}
          onSubmitEditing={handleAddChip}
        /> */}
      </View>
      <View style={styles.chipsContainer}>
        {chips.map((chip, index) => (
          <CustomInputChip
            key={index}
            label={chip}
            onDelete={() => handleDeleteChip(index)}
          />
        ))}
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
  },
  chipContainer: {
    flexDirection: 'row',

    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: normalize(12),
    marginVertical: 8,
    marginLeft: 10,
  },
  chipText: {
    marginRight: 8,
    color: '#000000',
  },
  deleteIconContainer: {
    marginLeft: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default CustomChip;
