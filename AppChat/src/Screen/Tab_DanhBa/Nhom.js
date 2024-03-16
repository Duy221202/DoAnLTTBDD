import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
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
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="people-circle"
              size={50}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tạo nhóm mới</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.tinhnangnoibat}>
          <Text style={styles.text1}>Tính năng nổi bật</Text>
          <View style={styles.noibat}>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="calendar-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Lịch</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="alarm-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhắc hẹn</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="send-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Chia sẻ ảnh</Text>
              </View>
            </Pressable>
          </View>
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
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 1</Text>
                <Text style={styles.userMessage}>aaaaaaaaaaaa</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 2</Text>
                <Text style={styles.userMessage}>BBBBB</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 3</Text>
                <Text style={styles.userMessage}>123456789</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 4</Text>
                <Text style={styles.userMessage}>xyz</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 5</Text>
                <Text style={styles.userMessage}>@@@@</Text>
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
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  userIcon: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
    // thanh cắt ngang
  separator: {
    height: 5, // Độ cao của thanh phân cách
    backgroundColor: '#ccc', // Màu sắc của thanh phân cách
    marginVertical: 5, // Khoảng cách dọc giữa các phần
  },
  userMessage: {
    fontSize: 12,
    color: 'gray',
  },
  // Groups
  tinhnangnoibat: {
    flexDirection: 'column',
  },
  noibat: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    marginVertical: 5, // Khoảng cách dọc giữa các icon
    paddingHorizontal: 25, // Khoảng cách ngang giữa biên và icon
  },
  text1:{
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 10,
  },
  iconnoibat: {
    alignItems: 'center', 
    marginRight: 20,
  },
  nhomdtg: {
    flexDirection: 'column',
  },
})

export default Nhom;

