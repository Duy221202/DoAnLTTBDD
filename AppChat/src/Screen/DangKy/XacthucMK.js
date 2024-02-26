import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Image,
    TextInput,
    TouchableOpacity,
  } from "react-native";

  const XacthucMK = () => {
    const navigation = useNavigation();

    const handleNext = () => {
      // Điều hướng sang trang khác khi xác nhận
      navigation.navigate('TaoMK');
  };

    return (
        <View style={styles.container}>
          <View style={styles.view1}>
            {/* <Pressable
            onPress={() => {
                navigation.goBack();
            }}>
              <View style={styles.iconback}>
                  <Icon name="chevron-back" size={25} color="white" />
              </View>
            </Pressable> */}
            <Text style={styles.KichhoatTK}>Tạo mật khẩu mới</Text>
          </View>
            
          <View style={styles.view2}>
            <Image
              source={require("../../../src/Image/check.png")}
              style={styles.callImage}
            />
          </View>

          <View style={styles.view3}>
            <Text style={styles.textNote}>Đăng Nhập Thành Công</Text>
          </View>

          <View style={styles.view4}>
            <Text style={styles.textNote2}>Bây giờ bạn có thể tạo lại mật khẩu mới. Tài khoản và mật khẩu này dùng để đăng nhập trên bất kỳ thiết bị nào.</Text>
          </View>

          <View style={styles.view5}>
            <Pressable style={styles.PreTMK} onPress={() => handleNext()}>
              <Text style={styles.textTMK}>Tạo mật khẩu</Text>
            </Pressable>
          </View>

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#66E86B",
  },
  KichhoatTK: {
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
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callImage: {
    width: 120,
    height: 120,
    borderRadius: 200,
  },
  view3:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textNote:{
    fontSize: 22,
    fontWeight: 'bold',
  },
  view4: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textNote2: {
    fontSize: 18,
    textAlign: 'center',
  },
  view5: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  textTMK: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreTMK: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
});
export default XacthucMK