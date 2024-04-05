import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../config/firebase';

export default function DangKyMail({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPass, setConfirmPass] = useState('');
  const [sdt, setSdt] = useState('');
  const [otp, setOtp] = useState('');
  const [userInputOTP, setUserInputOTP] = useState('');

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
      // Kiểm tra độ dài của mật khẩu
      if (pass.length < 6 || pass.length > 30) {
        showToast('Mật khẩu phải có từ 6 đến 30 ký tự', 'error');
        return;
      }
      if (!/^[A-Z]/.test(pass)) {
        showToast('Mật khẩu phải bắt đầu bằng chữ hoa', 'error');
        return;
      }
      if (/\s/.test(pass)) {
        showToast('Mật khẩu không được chứa khoảng trắng', 'error');
        return;
      }
      if (!/^[A-Za-z0-9_@!$%^&*()#]+$/.test(pass)) {
        showToast('Mật khẩu chứa các ký tự chữ cái, số và ký tự đặc biệt', 'error');
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

  // // mới
  // const onHandleSignup = () => {
  //   if (email !== '' && pass !== '') {
  //     if (!email.endsWith('@gmail.com')) {
  //       showToast('Địa chỉ email phải có đuôi @gmail.com', 'error');
  //       return;
  //     }
  //     if (pass !== confirmPass) {
  //       showToast('Mật khẩu không trùng khớp', 'error');
  //       return;
  //     }
      
  //     createUserWithEmailAndPassword(auth, email, pass)
  //       .then((userCredential) => {
  //         const user = userCredential.user;
  //         //sendEmailVerification(auth.currentUser) // gửi mail xác nhận 
  //         generateOTP();
  //       })
  //       .catch((err) => {
  //         console.error('Đăng ký thất bại:', err.message);
  //         showToast(`Đăng ký thất bại: ${err.message}`, 'error');
  //       });
  //   } else {
  //     showToast('Vui lòng điền đầy đủ email và mật khẩu', 'error');
  //   }
  // };

  // const verifyOTP = () => {
  //   if (userInputOTP === otp) {
  //     navigation.navigate("DatTenUser", { email: email, pass: pass });
  //   } else {
  //     showToast('Mã OTP không đúng', 'error');
  //   }
  // };  

  // const generateOTP = () => {
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   setOtp(otp);
  //   console.log('Mã OTP đã được gửi:', otp); // Log ra mã OTP
  //   // Gửi OTP đến email
  //   // Code gửi email ở đây
  //   showToast('Mã OTP đã được gửi đến email của bạn', 'success');
  // };
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
      <SafeAreaView>
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
        {/* <TextInput
          style={styles.textInsdt}
          placeholder="Số điện thoại"
          //autoCapitalize="none"
          //keyboardType="email-address"
          //value={email}
          //onChangeText={(text) => setEmail(text)}
        /> */}

      </View>

      <TouchableOpacity style={styles.view4} onPress={onHandleSignup}>
        <Text style={styles.textcont}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.view5}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login2")}>
            {/* <Text style={[styles.textdieukhoan, styles.blueText]}>Đăng nhập</Text> */}
            <Text style={styles.blueText}>Đăng nhập</Text>
          </TouchableOpacity>
      </View>

      {/* {otp !== '' && (
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.textInsdt}
            placeholder="Nhập mã OTP"
            keyboardType="numeric"
            value={userInputOTP}
            onChangeText={(text) => setUserInputOTP(text)}
          />
          <TouchableOpacity style={styles.view4} onPress={verifyOTP}>
            <Text style={styles.textcont}>Xác thực OTP</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </SafeAreaView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 32,
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
    backgroundColor: "#418df8",
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
    right: 38,
    top: 85,
    justifyContent: 'center',
  },
  visibilityIcon: {
    fontSize: 16,
  },
  view4: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: "#418df8",
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
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  blueText: {
    color: 'blue',
    fontWeight: '400',
  },

  // OTP
  otpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  otpTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    width: '100%',
  },
  verifyButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
  },
});


