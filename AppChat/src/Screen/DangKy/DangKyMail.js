import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../config/firebase';

export default function DangKyMail({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPass, setConfirmPass] = useState('');

  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onHandleSignup = () => {
    if (email !== '' && pass !== '') {
      // Kiểm tra xem email có đúng định dạng không
      if (!email.endsWith('@gmail.com')) {
        showToast('Địa chỉ email phải có đuôi @gmail.com', 'error');
        return;
      }
      // Kiểm tra xem mật khẩu và nhập lại mật khẩu có trùng khớp không
      if (pass !== confirmPass) {
        showToast('Mật khẩu không trùng khớp', 'error');
        return;
      }
      
      createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Đăng ký thành công, gửi email xác minh
          const user = userCredential.user;
          sendEmailVerification(auth.currentUser)
            .then(() => {
              showToast('Email xác minh đã được gửi', 'success');
              setTimeout(() => {
                navigation.navigate("DatTenUser", { email: email, pass: pass });
              }, 3000);
            })
            .catch((error) => {
              console.error('Lỗi khi gửi email xác minh:', error.message);
            });
        })
        .catch((err) => {
          console.error('Đăng ký thất bại:', err.message);
          showToast(`Đăng ký thất bại: ${err.message}`, 'error');
        });
    } else {
      showToast('Vui lòng điền đầy đủ email và mật khẩu', 'error');
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
        <Text style={styles.textNote}>Nhập email và mật khẩu để tạo tài khoản mới</Text>
      </View>

      <View style={styles.view3}>
        <TextInput
          style={styles.textInsdt}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={[styles.textInsdt, secureTextEntry && styles.secureTextEntry]}
          placeholder="Mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          value={pass}
          onChangeText={(text) => setPass(text)}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={handlePasswordVisibility} style={styles.visibilityIconContainer}>
            <Text style={styles.visibilityIcon}>{secureTextEntry ? "Hiện" : "Ẩn"}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInsdt}
          placeholder="Nhập lại mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          value={confirmPass}
          onChangeText={(text) => setConfirmPass(text)}
          secureTextEntry={secureTextEntry}
        />

      </View>

      <TouchableOpacity style={styles.view4} onPress={onHandleSignup}>
        <Text style={styles.textcont}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.view5}>
        <Text style={styles.textdieukhoan}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login2")}>
            <Text style={[styles.textdieukhoan, styles.blueText]}>Đăng nhập</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 35,
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
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    //paddingVertical: 10,
  },
  textNote: {
    fontSize: 16,
  },
  view3: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textInsdt: {
    height: 50,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  secureTextEntry: {
    secureTextEntry: true,
  },
  visibilityIconContainer: {
    position: 'absolute',
    right: 30,
    top: 85,
    justifyContent: 'center',
  },
  visibilityIcon: {
    fontSize: 16,
  },
  view4: {
    alignSelf: 'center',
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  textcont: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  view5: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    alignSelf: 'center',
  },
  textdieukhoan: {
    fontSize: 18,
    textAlign: 'center',
  },
  blueText: {
    color: 'blue',
    fontWeight: '400',
  },
});


