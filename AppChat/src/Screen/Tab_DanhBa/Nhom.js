import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";


const Nhom = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.body}>
        <View style={styles.banbe}>
          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('TaoNhom')}>
            <Icon1 name="group-add" size={25} color="blue" style={styles.userIcon}/>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tạo nhóm mới</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.nhomdtg}>
          <Text style={styles.text1}>Nhóm đang tham gia</Text>
          <View style={styles.banbe}>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={25}
                color="blue"
                style={styles.userIcon}/>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 1</Text>
                <Text style={styles.userMessage}>aaaaaaaaaaaa</Text>
              </View>
            </Pressable>
            
          </View>
          
        </View>

      </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  banbe: {
    flexDirection: 'column', 
    paddingHorizontal: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  userIcon: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500"
  },
    // thanh cắt ngang
  separator: {
    height: 5, // Độ cao của thanh phân cách
    backgroundColor: '#ccc', // Màu sắc của thanh phân cách
    marginVertical: 5, // Khoảng cách dọc giữa các phần
    marginTop: 20,
  },
  userMessage: {
    fontSize: 12,
    color: 'gray',
  },
  // Groups
  text1:{
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 10,
  },
  nhomdtg: {
    flexDirection: 'column',
  },
})

export default Nhom;

