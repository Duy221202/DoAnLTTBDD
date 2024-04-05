// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
// import Toast from "react-native-toast-message";
// import Icon from "react-native-vector-icons/Ionicons";
// import { createUserWithEmailAndPassword, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
// import { auth } from '../../../config/firebase';
// import { PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth'; // Import RecaptchaVerifier

// export default function DangKy({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [pass, setPass] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [sdt, setSdt] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);

//   // Khởi tạo RecaptchaVerifier
//   const appVerifier = new RecaptchaVerifier('recaptcha-container', {
//     size: 'invisible',
//   });
  
//   const phoneProvider = new PhoneAuthProvider(auth);

//   let confirmationResult; // Định nghĩa biến ở ngoài phạm vi hàm
  
//   const handlePasswordVisibility = () => {
//     setSecureTextEntry(!secureTextEntry);
//   };

//   const onHandleSignup = () => {
//     if (email !== '' && pass !== '' && sdt !== '') {
//       if (!email.endsWith('@gmail.com')) {
//         showToast('Địa chỉ email phải có đuôi @gmail.com', 'error');
//         return;
//       }
//       if (pass !== confirmPass) {
//         showToast('Mật khẩu không trùng khớp', 'error');
//         return;
//       }

//       signInWithPhoneNumber(phoneProvider, sdt, appVerifier)
//         .then((result) => {
//           showToast('Mã OTP đã được gửi', 'success');
//           confirmationResult = result;
//           setOtpSent(true);
//         })
//         .catch((err) => {
//           console.error('Gửi mã OTP thất bại:', err.message);
//           showToast(`Gửi mã OTP thất bại: ${err.message}`, 'error');
//         });
//     } else {
//       showToast('Vui lòng điền đầy đủ email, mật khẩu và số điện thoại', 'error');
//     }
//   };
  
//   const handleVerifyOTP = () => {
//     if (confirmationResult) {
//       const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
//       signInWithCredential(auth, credential)
//         .then((userCredential) => {
//           return createUserWithEmailAndPassword(auth, email, pass);
//         })
//         .then((userCredential) => {
//           const user = userCredential.user;
//           //sendEmailVerification(auth.currentUser) // gửi mail xác nhận 
//         })
//         .catch((err) => {
//           console.error('Xác minh OTP thất bại:', err.message);
//           showToast(`Xác minh OTP thất bại: ${err.message}`, 'error');
//         });
//     } else {
//       showToast('Vui lòng gửi mã OTP trước khi xác minh', 'error');
//     }
//   };

//   const showToast = (message, type) => {
//     Toast.show({
//       type: type,
//       position: "top",
//       text1: message,
//       visibilityTime: 3000,
//       autoHide: true,
//       fontFamily: "Arial",
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <SafeAreaView>
//         <View style={styles.toastContainer}>
//           <Toast ref={(ref) => Toast.setRef(ref)} />
//         </View>
//         <View style={styles.view1}>
//           <Pressable
//               onPress={() => {
//                   navigation.goBack();
//               }}>
//               <View style={styles.iconback}>
//                   <Icon name="chevron-back" size={25} color="white" />
//               </View>
//           </Pressable>
//           <Text style={styles.TaoTK}>Tạo tài khoản</Text>
//         </View>

//         <View style={styles.view2}>
//           <Text style={styles.textNote}>Nhập email và mật khẩu để tạo tài khoản mới</Text>
//         </View>

//         <View style={styles.view3}>
//           <TextInput
//             style={styles.textInsdt}
//             placeholder="Email"
//             autoCapitalize="none"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={(text) => setEmail(text)}
//           />
//           <TextInput
//             style={styles.textInsdt}
//             placeholder="Mật khẩu"
//             autoCapitalize="none"
//             autoCorrect={false}
//             value={pass}
//             onChangeText={(text) => setPass(text)}
//             secureTextEntry={true}
//           />
//           <TextInput
//             style={styles.textInsdt}
//             placeholder="Nhập lại mật khẩu"
//             autoCapitalize="none"
//             autoCorrect={false}
//             value={confirmPass}
//             onChangeText={(text) => setConfirmPass(text)}
//             secureTextEntry={true}
//           />
//           {!otpSent && (
//             <TextInput
//               style={styles.textInsdt}
//               placeholder="Số điện thoại"
//               keyboardType="phone-pad"
//               value={sdt}
//               onChangeText={(text) => setSdt(text)}
//             />
//           )}
//           {otpSent && (
//             <TextInput
//               style={styles.textInsdt}
//               placeholder="Mã OTP"
//               value={otp}
//               onChangeText={(text) => setOtp(text)}
//             />
//           )}

//         </View>

//         <TouchableOpacity style={styles.view4} onPress={otpSent ? handleVerifyOTP : onHandleSignup}>
//           <Text style={styles.textcont}>{otpSent ? 'Xác minh OTP' : 'Gửi mã OTP'}</Text>
//         </TouchableOpacity>

//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   toastContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 1,
//   },
//   view1: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#0D47A1',
//     height: 60,
//   },
//   iconback: {
//     paddingLeft: 20,
//   },
//   TaoTK: {
//     color: '#fff',
//     fontSize: 20,
//     paddingLeft: 20,
//   },
//   view2: {
//     margin: 20,
//   },
//   textNote: {
//     fontSize: 16,
//   },
//   view3: {
//     marginHorizontal: 20,
//     marginTop: 20,
//   },
//   textInsdt: {
//     borderColor: '#BDBDBD',
//     borderBottomWidth: 1,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   view4: {
//     backgroundColor: '#0D47A1',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     marginHorizontal: 20,
//     borderRadius: 5,
//   },
//   textcont: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert, Modal, Pressable } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../config/firebase';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Picker } from '@react-native-picker/picker';
//import axios from 'axios'; // Import thư viện axios để gọi API
//import transporter from '../../../config/mailconfig'; // Import transporter từ mailconfig

export default function Signup({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');
  const [otp, setOtp] = useState(''); 
  const [enterOTP, setEnterOTP] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const db = getFirestore();
  
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  const isPasswordValid = () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup error", "Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const sendOTPByEmail = () => {
    const otp = generateOTP(); // Hàm generateOTP() để sinh mã OTP
    setOtp(otp); // Lưu mã OTP vào state
    
    // Tạo nội dung email
    const mailOptions = {
        from: 'hostotpmail@gmail.com',
        to: email,
        subject: 'Mã OTP xác nhận đăng ký',
        text: `Mã OTP của bạn là: ${otp}`
    };
    
    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
            setShowOtpModal(true); // Hiển thị màn hình popup nhập mã OTP
        }
    });
};

  const generateOTP = () => {
    // Hàm này để sinh mã OTP, bạn có thể tạo một mã OTP ngẫu nhiên dạng số hoặc chữ tùy ý
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const onHandleSignup = () => {
    if (email !== '' && password !== '' && confirmPassword !== '' && name !== '') {
      if (!isPasswordValid()) {
        return;
      }
      
      sendOTPByEmail(); // Gửi mã OTP qua email
    }
  };

  const verifyOTP = () => {
    if (enterOTP === otp) {
      // Nếu mã OTP nhập đúng, thực hiện đăng ký
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: name
          }).then(() => {
            setDoc(doc(db, "users", userCredential.user.uid), {
              name: name,
              UID: userCredential.user.uid,
              email: email,
              gender: gender,birthdate: `${day}/${month}/${year}`
            }).then(() => {
              setIsLoggedIn(false);
              Alert.alert(
                'Signup success',
                'You have signed up successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('Login2') }]
              );
            }).catch((error) => {
              console.log("Error adding document: ", error);
            });
          }).catch((error) => {
            console.log("Update profile error: ", error);
          });
      
        })
        .catch((err) => Alert.alert("Signup error", err.message));
  
      // Đóng màn hình popup nhập mã OTP
      setShowOtpModal(false);
    } else {
      Alert.alert("Invalid OTP", "Mã OTP không đúng, vui lòng nhập lại");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <View style={styles.form}>
        <Text style={styles.title}>Đăng Ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={[styles.input, styles.passwordInputContainer]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword}
          textContentType="password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View>
          <Text style={styles.radioLabel}>Ngày sinh</Text>
          <View style={styles.datePickerContainer}>
            <Picker
              style={styles.datePicker}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => setDay(itemValue)}
            >
              {days.map((day) => (
                <Picker.Item label={day} value={day} key={day} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}selectedValue={month}
              onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item label={month} value={month} key={month} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) => setYear(itemValue)}
            >
              {years.map((year) => (
                <Picker.Item label={year} value={year} key={year} />
              ))}
            </Picker>
          </View>
        </View>  
        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Giới tính</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={[styles.radioButtonMale, gender === 'male' && styles.selectedRadioButton]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.radioText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButtonFMale, gender === 'female' && styles.selectedRadioButton]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.radioText}>Nữ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login2")}>
            <Text style={{ color: '#006AF5', fontWeight: '600', fontSize: 14 }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Màn hình popup nhập mã OTP */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nhập mã OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              keyboardType="numeric"
              value={enterOTP}
              onChangeText={(text) => setEnterOTP(text)}
            />
            <Pressable
              style={[styles.button, styles.modalButton]}
              onPress={verifyOTP}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#006AF5",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#006AF5',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
  },
  radioContainer: {
    marginTop: 20,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioButtonMale: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  radioButtonFMale: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 5,
  },
  selectedRadioButton: {
    backgroundColor: '#006AF5',
    borderColor: '#006AF5',
  },
  radioText: {
    color: 'black',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    height: 58,
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#006AF5',
    marginTop: 20,
    width: '100%',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
