import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Dangky = () => {
  const navigation = useNavigation();
  const handleNext = () => {
    // Handle login navigation
    navigation.navigate('Dangky2');
  };
  return (
    <View style={styles.container}>
      <View style={styles.view1}>
            <Pressable
            onPress={() => {
                navigation.goBack();
            }}>
              <View style={styles.iconback}>
                  <Icon name="chevron-back" size={25} color="white" />
              </View>
            </Pressable>
          <Text style={styles.TaoTK}>Tạo tài khoản</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.text1}>Tên Zalo</Text>
        <TextInput
          style={styles.textName}
          placeholder= "Gồm 2 - 30 ký tự">
        </TextInput>
      </View>
      
      <View style={styles.view3}>
        <Text style={styles.textNote}>Lưu ý khi đặt tên</Text>
        <View style={styles.view3_1}>
          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Không vi phạm <Text style={styles.blueText}>Quy định đặt tên trên Zalo</Text></Text>
          </Text>

          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
          </Text>
        </View>
      </View>

      <View style={styles.view4}>
        <Pressable style={styles.PreDK} onPress={() => handleNext()}>
          <Text style={styles.textNext}>Tiếp tục</Text>
        </Pressable>
      </View>

      <View style={styles.view5}>
        <Text style={styles.textdieukhoan}>
          <Text> Tiếp tục nghĩa là bạn đồng ý với các </Text> 
          <Text style={[styles.textdieukhoan, styles.blueText]}>
            Điều khoản sử dụng Zalo
          </Text>
        </Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#66E86B",
  },
  TaoTK: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'white',
  },
  iconback: {
    marginTop: 15,
    height: 20,
    width: 20,
  },
  view2: {
    flexDirection: 'column',
  },
  text1: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
  },
  textName: {
    height: 50,
    width: 380,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18,
    marginLeft: 10,
  },
  view3: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  textNote: {
    fontSize: 18,
  },
  view3_1: {
    marginTop: 15,
  },
  textNote1: {
    fontSize: 16,
    marginBottom: 15,
  },
  blueText: {
    color: 'blue',
    fontWeight: '400',
  },
  view4: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreDK: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  view5: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },  
  textdieukhoan: {
    fontSize: 16,
    textAlign: 'center',
  },
});
export default Dangky