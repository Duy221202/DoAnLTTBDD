import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react"; // Thêm useRef từ React
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../config/firebase';

// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Quenmatkhau = () => {
  const navigation = useNavigation();
  // const [pass, setPass] = useState("");
  // const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // số điện thoại
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  //const phoneNumberInputRef = useRef(null); // Sử dụng useRef để tạo tham chiếu

  // const onHandleSignup = () => {
  //   //if (email !== '' && password !== '') {
  //   if (email !== '' ) {
  //   createUserWithEmailAndPassword(auth, email)
  //       .then(() => console.log('Signup success'))
  //       .catch((err) => Alert.alert("Login error", err.message));
  //   }
  // };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleConfirm = () => {
    // Đóng modal trước khi điều hướng
    toggleModal();
    // Điều hướng sang trang khác khi xác nhận
    navigation.navigate('Maxacthuc', { phoneNumber: phoneNumber });
  };

  const handleContinue = () => {
    // Kiểm tra số điện thoại hợp lệ trước khi mở modal
    const isValidPhoneNumber = validatePhoneNumber(phoneNumber);
    if (isValidPhoneNumber) {
      toggleModal();
    } else {
      // Hiển thị thông báo lỗi nếu số điện thoại không hợp lệ
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: phoneNumberError,
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^(0\d{9})$/; // Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0
    if (!phoneNumberPattern.test(phoneNumber)) {
      setPhoneNumberError("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
      return false;
    }
    return true;
  };

  const handleChangePhoneNumber = (text) => {
    // Cập nhật số điện thoại
    setPhoneNumber(text);
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (phoneNumberError) {
      setPhoneNumberError("");
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
        <Text style={styles.textllmk}>Lấy lại mật khẩu</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.textNote}>Vui lòng nhập số điện thoại bạn đã đăng ký!</Text>
      </View>
      

      <View style={styles.view3}>
        <TextInput
          //ref={phoneNumberInputRef}
          // country={'us'}
          style={styles.textInsdt}
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={handleChangePhoneNumber}
          keyboardType="numeric" // Chỉ cho phép nhập số
        />
        {/* <TextInput
          style={styles.textInsdt}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        /> */}
        {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
      </View>

      <View style={styles.view4}>
        <Pressable style={styles.PreQMK} onPress={() =>handleContinue()}>
        {/* <Pressable style={styles.PreQMK} onPress={() =>onHandleSignup()}> */}
          <Text style={styles.textNext}>Tiếp tục</Text>
        </Pressable>
      </View>
      
      {/* Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            (+84) {phoneNumber.slice(1)} {/* Loại bỏ số 0 đầu tiên */}
          </Text>
          <Text style={styles.modalText2}>
            Vui lòng xác nhận số điện thoại này là đúng.
          </Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsModalVisible(false); // Đóng modal
                // setTimeout(() => {
                //   phoneNumberInputRef.current.focus(); // Focus vào input số điện thoại
                // }, 100);
              }}>
              <Text style={styles.modalButtonText}>Thay đổi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
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
  textllmk: {
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
    marginTop: 10,
    //justifyContent: "center",
    alignItems: "center",
  },
  textInsdt: {
    height: 50,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  view4: {
    alignItems: 'center',
    //justifyContent: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreQMK: {
    //margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: "60%",
    // borderRadius: 20,
    // padding: 10,
    borderRadius: 25, // Tăng độ cong của góc để nút trông tròn hơn
    justifyContent: "center", // Canh giữa nội dung theo chiều dọc
    alignItems: "center", // Canh giữa nội dung theo chiều ngang
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 30, // fontsize lớn hơn
    fontWeight: 'bold',
    marginBottom: 10, // giảm marginBottom
  },
  modalText2: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20, // tăng marginBottom
    textAlign: 'center', // Canh giữa văn bản
  },
  modalButtonContainer: {
    flexDirection: 'row', // Sắp xếp các nút ngang
    justifyContent: 'space-between', // Canh nút đều ra 2 bên
    width: '100%', // 100% chiều rộng của parent
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 5,
    width: '45%', // Định kích thước của các nút
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Canh giữa văn bản
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
export default Quenmatkhau;