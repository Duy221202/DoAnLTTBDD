import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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

const url = "https://65445bd25a0b4b04436c4997.mockapi.io/Loginapp";

const Login = () => {
  const navigation = useNavigation();
  const [sdt, setSdt] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState([]);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      });
  }, []);

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleForgotPassword = () => {
    navigation.navigate('Quenmatkhau');
  };

  const handleCheck = () => {
    // const user = state.find((user) => user.sdt === sdt && user.pass === pass); // sđt
    const user = state.find((user) => user.email === email && user.pass === pass);
    if (user) {
      showToast("Đăng nhập thành công", "success"); // Thêm tham số type là "success"
      setTimeout(() => {
        navigation.navigate("TinNhan");
      }, 3000); // Chuyển hướng sau 3 giây
    } else {
      showToast("Email hoặc mật khẩu không đúng!", "error");
      setPass("");
    }
  };

  const showToast = (message, type) => {
    Toast.show({
      type: type,
      position: "top",
      text1: message,
      visibilityTime: 3000,
      autoHide: true,
      fontFamily: "Arial",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.toastContainer}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>

      <View style={styles.view1}>
        <Pressable onPress={() => navigation.goBack()}>
          <View style={styles.iconback}>
            <Icon name="chevron-back" size={25} color="white" />
          </View>
        </Pressable>
        <Text style={styles.login}>Đăng nhập</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.textNote}>Vui lòng nhập số điện thoại và mật khẩu đăng nhập</Text>
      </View>
      {/* số điện thoại */}
      {/* <View style={styles.view3}>
        <TextInput
          style={styles.textInsdt}
          placeholder="Số điện thoại"
          value={sdt}
          onChangeText={(text) => setSdt(text)}
        /> */} 
        <View style={styles.view3}>
        <TextInput
          style={styles.textInsdt}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <View style={styles.group1}>
          <TextInput
            style={[styles.textInPass, secureTextEntry && styles.secureTextEntry]}
            placeholder="Mật khẩu"
            value={pass}
            onChangeText={(text) => setPass(text)}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity onPress={handlePasswordVisibility} style={styles.visibilityIconContainer}>
            <Text style={styles.visibilityIcon}>{secureTextEntry ? "Hiện" : "Ẩn"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.view4}>
          <Pressable style={styles.PreLogin} onPress={handleCheck}>
            <Text style={styles.textLogin}>Đăng nhập</Text>
          </Pressable>
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#66E86B",
  },
  view2: {
    backgroundColor: "#D9D9D9",
  },
  textNote: {
    fontSize: 16,
  },
  view3: {
    marginTop: 20,
  },
  login: {
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
  textInsdt: {
    height: 50,
    width: 380,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 20,
    marginLeft: 10,
  },
  group1: {
    flexDirection: "row",
  },
  textInPass: {
    flex: 1,
    width: 380,
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
    fontSize: 20,
    marginLeft: 10,
  },
  secureTextEntry: {
    secureTextEntry: true,
  },
  visibilityIconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  visibilityIcon: {
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: 'blue',
  },
  view4: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogin: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreLogin: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
});

export default Login;
