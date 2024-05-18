import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
//import { useRoute } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';

export default function DangKyMail({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmPass, setConfirmPass] = useState('');
  const handlePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const [name, setName] = useState('');
  const db = getFirestore();
  //const route = useRoute(); // Sử dụng useRoute để lấy route params
  //const { email, pass} = route.params; 
  const [gender, setGender] = useState('male');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  // const onHandleSignup = () => {
  //   if (email !== '' && pass !== '') {
  //     // Kiểm tra xem email có đúng định dạng không
  //     if (!email.endsWith('@gmail.com')) {
  //       showToast('Địa chỉ email phải có đuôi @gmail.com', 'error');
  //       return;
  //     }
  //     // Kiểm tra xem mật khẩu và nhập lại mật khẩu có trùng khớp không
  //     if (pass !== confirmPass) {
  //       showToast('Mật khẩu không trùng khớp', 'error');
  //       return;
  //     }
  //     // Kiểm tra độ dài của mật khẩu
  //     if (pass.length < 6 || pass.length > 30) {
  //       showToast('Mật khẩu phải có từ 6 đến 30 ký tự', 'error');
  //       return;
  //     }
  //     if (!/^[A-Z]/.test(pass)) {
  //       showToast('Mật khẩu phải bắt đầu bằng chữ hoa', 'error');
  //       return;
  //     }
  //     if (/\s/.test(pass)) {
  //       showToast('Mật khẩu không được chứa khoảng trắng', 'error');
  //       return;
  //     }
  //     if (!/^[A-Za-z0-9_@!$%^&*()#]+$/.test(pass)) {
  //       showToast('Mật khẩu chứa các ký tự chữ cái, số và ký tự đặc biệt', 'error');
  //       return;
  //     }
      
  //     createUserWithEmailAndPassword(auth, email, pass)
  //       .then((userCredential) => {
  //         // Đăng ký thành công, gửi email xác minh
  //         const user = userCredential.user;
  //         sendEmailVerification(auth.currentUser)
  //           .then(() => {
  //             showToast('Email xác minh đã được gửi', 'success');
  //             setTimeout(() => {
  //               navigation.navigate("DatTenUser", { email: email, pass: pass });
  //             }, 3000);
  //           })
  //           .catch((error) => {
  //             console.error('Lỗi khi gửi email xác minh:', error.message);
  //           });
  //       })
  //       .catch((err) => {
  //         console.error('Đăng ký thất bại:', err.message);
  //         showToast(`Đăng ký thất bại: ${err.message}`, 'error');
  //       });
  //   } else {
  //     showToast('Vui lòng điền đầy đủ email và mật khẩu', 'error');
  //   }
  // };

  // const onHandleSignup1 = () => {
  //   if (name !== '') {
  //     updateProfile(auth.currentUser, {
  //       displayName: name
  //     }).then(() => {
  //       // Lưu tên người dùng vào Firestore
  //       setDoc(doc(db, "users", auth.currentUser.uid), {
  //         name: name,
  //         UID: auth.currentUser.uid, // Thêm UID vào tài liệu người dùng
  //         userId: email, // Sử dụng email từ params
  //         birthDate: `${day}/${month}/${year}`, // Tạo một chuỗi ngày tháng năm sinh
  //         gender: gender // Lưu giới tính
  //       }).then(() => {
  //         navigation.navigate('Profile');
  //       }).catch((error) => {
  //         console.log("Error adding document: ", error);
  //       });
  //     }).catch((error) => {
  //       console.log("Update profile error: ", error);
  //     });
  //   } else {
  //     Alert.alert("Name is required", err.message);
  //   }
  // };

  ///////////////
  const onHandleSignup = () => {
    if (name !== '' && email !== '' && pass !== '') {
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
              updateProfile(auth.currentUser, {
                displayName: name
              }).then(() => {
                // Lưu tên người dùng vào Firestore
                setDoc(doc(db, "users", auth.currentUser.uid), {
                  name: name,
                  UID: auth.currentUser.uid, // Thêm UID vào tài liệu người dùng
                  email: email, // Lưu email 
                  dateOfBirth: `${day}/${month}/${year}`, // Tạo một chuỗi ngày tháng năm sinh
                  gender: gender // Lưu giới tính
                }).then(() => {
                  navigation.navigate('Profile');
                }).catch((error) => {
                  console.log("Error adding document: ", error);
                });
              }).catch((error) => {
                console.log("Update profile error: ", error);
              });
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
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
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

      {/* <View style={styles.view2}>
        <Text style={styles.textNote}>Nhập email và mật khẩu để tạo tài khoản mới</Text>
      </View> */}

      <Text style={styles.textten}>Tên của bạn</Text>
      <View style={styles.view3}>
        <TextInput
          style={styles.inputten}
          placeholder="Enter your name"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}>
        </TextInput>
      </View>

      <Text style={styles.textten}>Email</Text>
      <View style={styles.view3}>
        <TextInput
          style={styles.textInsdt}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <Text style={styles.textmk}>Tạo mật khẩu</Text>
      <View style={styles.view3}>
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
      </View>

      <Text style={styles.textmk}>Xác nhận mật khẩu của bạn</Text>
      <View style={styles.view3}>
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

      <Text style={styles.textmk}>Ngày sinh</Text>
      <View style={styles.viewngaysinh}>
        <View style={styles.ntnsPicker}>
          <Picker style={styles.datePicker} selectedValue={day} onValueChange={(itemValue, itemIndex) => setDay(itemValue)}>
            {days.map((day) => (
              <Picker.Item label={day} value={day} key={day} />
            ))}
          </Picker>
          <Picker style={styles.datePicker}selectedValue={month} onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}>
            {months.map((month) => (
              <Picker.Item label={month} value={month} key={month} />
             ))}
          </Picker>
          <Picker style={styles.datePicker} selectedValue={year} onValueChange={(itemValue, itemIndex) => setYear(itemValue)}>
            {years.map((year) => (
              <Picker.Item label={year} value={year} key={year} />
            ))}
          </Picker>
        </View>
      </View>  

      <Text style={styles.textgt}>Giới tính</Text>
      <View style={styles.view3}>
        <View style={styles.viewgioitinh2}>
          <TouchableOpacity style={[styles.gioitinh, gender === 'Nam']} onPress={() => setGender('Nam')}>
            <View style={[styles.radioCircle, gender === 'Nam' && styles.selectedCircle]} />
            <Text style={styles.radioText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gioitinh, gender === 'Nữ']} onPress={() => setGender('Nữ')}>
            <View style={[styles.radioCircle, gender === 'Nữ' && styles.selectedCircle]} />
            <Text style={styles.radioText}>Nữ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.view4} onPress={onHandleSignup}>
        <Text style={styles.textcont}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.view5}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login2")}>
            <Text style={styles.blueText}>Đăng nhập</Text>
          </TouchableOpacity>
      </View>
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
    top: 15,
    justifyContent: 'center',
  },
  visibilityIcon: {
    fontSize: 15,
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
  // tên
  textten: {
    fontSize: 16,
    marginLeft: 30,
    marginTop: 5,
  },
  textmk: {
    fontSize: 16,
    marginLeft: 30,
  },
  textgt: {
    fontSize: 16,
    marginLeft: 30,
    marginTop: 15,
  },
  inputten: {
    height: 45,
    width: 350,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 18,
  },
  viewngaysinh: {
    flexDirection: 'column',
    marginTop: 5,
    marginHorizontal: 10,
  },
  // tiếp tục 2
  view41: {
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
    backgroundColor: "#418df8",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  // giới tính
  viewgioitinh2: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 5,
  },
  gioitinh: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5,
    marginHorizontal: 25,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#418df8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: '#418df8',
  },
  // ngày sinh
  ntnsPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    height: 45,
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    marginRight: 5,
    marginLeft: 5,
  },
});


