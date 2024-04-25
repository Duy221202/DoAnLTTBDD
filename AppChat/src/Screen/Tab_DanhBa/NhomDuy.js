import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Import StyleSheet ở đây

//import DanhSachNhom from '../Tab_DanhBa/DanhSachNhom';
import TaoNhomDuy from '../Tab_DanhBa/TaoNhomDuy';
import DanhSachNhom from '../Tab_DanhBa/DanhSachNhom';

const NhomDuy = () => {
  const [currentPage, setCurrentPage] = useState('DanhSachNhom');

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'TaoNhomDuy':
        return <TaoNhomDuy />;
      case 'DanhSachNhom':
        return <DanhSachNhom />;
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBarNhom}>
        <TouchableOpacity onPress={() => changePage('TaoNhomDuy')}>
          <Text>Tạo Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changePage('DanhSachNhom')}>
          <Text>Danh Sách Nhóm</Text>
        </TouchableOpacity>
      </View>
      {renderPageContent()}
    </View>
  );
};

export default NhomDuy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navBarNhom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemuser: {
    flexDirection: 'row',
},
image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
},
text: {
    fontSize: 18,
    marginTop: 18,
    marginLeft: 20,
},
view1: {
    flexDirection: 'row',
    margin: 10,
},
text1: {
    fontSize: 15,
    justifyContent: "center",
    marginLeft: 10
},
separator: {
    height: 5,
    backgroundColor: '#ccc',
    marginVertical: 5,
},
textall: {
    fontSize: 16,
    marginLeft: 10,
    paddingHorizontal: 10,   
},
textGroup: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
},
});
