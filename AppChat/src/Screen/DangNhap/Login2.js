import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

const Login2 = () => {
  const navigation = useNavigation();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState([]);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleForgotPassword = () => {
    navigation.navigate('Quenmatkhau');
  };

  const onHandleLogin = () => {
    if (email !== "" && pass !== "") {
      signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
          // console.log("Login success");
          showToast("Đăng nhập thành công", "success"); // Thêm thông báo thành công
          setTimeout(() => {
            navigation.navigate("MyTabs"); // Thực hiện điều hướng sau 3 giây
          }, 3000); // Chuyển hướng sau 3 giây
        })
        .catch((err) => {
          showToast("Email hoặc mật khẩu không đúng!", "error"); // Thêm thông báo không thành công
        });
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
        <Text style={styles.textNote}>Vui lòng nhập email và mật khẩu để đăng nhập</Text>
      </View>

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
          <Pressable style={styles.PreLogin} onPress={onHandleLogin}>
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
    marginTop: 30,
  },
  view2: {
    backgroundColor: "#D9D9D9",
    alignItems: "center",
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

export default Login2;
