import React, {useState, useEffect} from 'react';
import {FlatList, SafeAreaView, TouchableOpacity, View,Text} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../utils/helpers/dimen';
import Modal from 'react-native-modal';
// import TextInputItem from './TextInputItem';
// import Space from './Space';

export default function SearchPicker(props) {
  const [search, setSearch] = useState('');
  const [tempDataList, setTempDataList] = useState(null);

  function onBackdropPress() {
    if (props.onBackdropPress) {
      props.onBackdropPress();
    }
  }
  function ontoppress() {
    if (props.ontoppress) {
      props.ontoppress();
    }
  }
  //   const searchData = text => {
  //     if (Array.isArray(props.dataList)) {
  //       if (text == '') {
  //         setTempDataList(props.dataList);
  //       } else {
  //         let tempData = props.dataList.filter(item => {
  //           return new String(item.name??item)
  //             .toLowerCase()
  //             .startsWith(text.toString().toLowerCase());
  //         });
  //         setTempDataList(tempData);
  //       }
  //     }
  //   };
  // useEffect(() => {
  //   if (props.search == true) {
  //     setTempDataList(props.dataList);
  //     setSearch('');
  //   }
  // }, [props.dataList]);
  return (
    <SafeAreaView>
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={props.modalVisible}
        style={{
          width: '100%',
          alignSelf: 'center',
          margin: 0,
        }}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackButtonPress={() => onBackdropPress()}
        onBackdropPress={() => onBackdropPress()}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: '#ddd',
              backgroundColor: props.backgroundColor,
              borderRadius: normalize(7),
              maxHeight: props.height,
              //  paddingHorizontal: normalize(10),
              paddingBottom: normalize(15),
            },
            props.search == false
              ? {position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10}
              : null,
          ]}>
          {/* {props.search == true ? (
            <>
              <TextInputItem
                placeholder={translate("Search")}
                value={search}
                onChangeText={text => {
                  setSearch(text);
                  searchData(text?.trim()??text);
                }}
                marginTop={normalize(15)}
              />
              <Space size={10} />
            </>
          ) : null} */}

          <FlatList
            data={search == false ? props.dataList : tempDataList}
            ListHeaderComponent={props.rendertopdata}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={props.renderData}
            style={{paddingVertical: normalize(12)}}
            ListEmptyComponent={props.ListEmptyComponent}
            contentContainerStyle={{paddingBottom:normalize(50)}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

SearchPicker.propTypes = {
  dataList: PropTypes.array,
  modalVisible: PropTypes.bool,
  renderData: PropTypes.func,
  onBackdropPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  height: PropTypes.number,
  search: PropTypes.bool,
  ListEmptyComponent: PropTypes.object,
//   ontoppress:PropTypes.func,
  rendertopdata:PropTypes.func
};

SearchPicker.defaultProps = {
  dataList: [],
  modalVisible: false,
  renderData: null,
  onBackdropPress: null,
  backgroundColor: 'white',
  height: normalize(400),
  search: false,
  ListEmptyComponent: null,
};
