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

const TaoMK = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessButton, setShowSuccessButton] = useState(false); // Thêm trạng thái mới

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleNext = () => {
    if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Mật khẩu không khớp. Vui lòng nhập lại.',
        });
    } else {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Mật khẩu đã được cập nhật.',
        });
        setTimeout(() => {
          navigation.navigate('Welcome'); // Điều hướng người dùng đến trang welcome sau một khoảng thời gian nhất định
        }, 3000); // Thời gian chờ trước khi chuyển đến trang welcome, đơn vị là mili giây (ở đây là 2000ms = 2 giây)
    }
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
        <Text style={styles.TaoMK}>Tạo mật khẩu</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.textNote}>Mật khẩu phải gồm chữ và số, không được chứa năm sinh, username và tên Zalo của bạn.</Text>
      </View>

      <View style={styles.view3}>
        <Text style={styles.textmk}>Mật khẩu mới: </Text>
      </View>

      <View style={styles.view4}>
        <View style={styles.input}>
          <TextInput
            style={styles.textnhapMKM}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handlePasswordVisibility} style={styles.visibilityIconContainer}>
            <Text style={styles.visibilityIcon}>{secureTextEntry ? "Hiện" : "Ẩn"}</Text>
          </TouchableOpacity>
        </View>

          <TextInput
            style={styles.textnhapMKM}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry={secureTextEntry}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
      </View>

      <View style={styles.view5}>
        <Pressable style={styles.PreCNMK} onPress={() => handleNext()}>
            <Text style={styles.textCNMK}>Cập nhật</Text>
        </Pressable>
      </View>

      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}

      {/* chỉnh font tb lớn hơn */}
      <Toast
        ref={(ref) => Toast.setRef(ref)}
        config={{
            error: ({ text1, text2, ...rest }) => (
            <View style={styles.errorToast}>
                <Text style={styles.errorText1}>{text1}</Text>
                <Text style={styles.errorText2}>{text2}</Text>
            </View>
            ),
            success: ({ text1, text2, ...rest }) => (
            <View style={styles.successToast}>
                <Text style={styles.successText1}>{text1}</Text>
                <Text style={styles.successText2}>{text2}</Text>
            </View>
            ),
        }}
      />

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
  TaoMK: {
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
  view2:{
    backgroundColor: "#D9D9D9",
  },
  textNote:{
    fontSize: 16,
  },
  view3: {
    marginTop: 20,
  },
  textmk: {
    fontSize: 18,
    color: 'blue',
    fontWeight: '400',
  },
  view4: {
    flexDirection: 'column',
    marginTop: 15,
  },
  textnhapMKM: {
    width: 380,
    height: 50,
    borderColor: "blue",
    borderBottomWidth: 1,
    fontSize: 20,
    marginLeft: 10,
  },
  visibilityIconContainer: {
    position: 'absolute',
    right: 20, // Điều chỉnh khoảng cách nút với ô mật khẩu
    height: '100%',
    justifyContent: 'center',
  },
  visibilityIcon:{
    fontSize: 16,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view5: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  textCNMK: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreCNMK: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  errorToast: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  errorText1: {
    fontSize: 20, // Đổi kích thước chữ ở đây
    fontWeight: 'bold',
    color: 'white',
  },
  errorText2: {
    fontSize: 16, // Đổi kích thước chữ ở đây
    color: 'white',
  },
  successToast: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  successText1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  successText2: {
    fontSize: 16,
    color: 'white',
  },
});
export default TaoMK;