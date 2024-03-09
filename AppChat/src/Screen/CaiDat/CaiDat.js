import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, View, Text, Pressable, Image, TextInput} from "react-native";
import { auth } from "../../../config/firebase";
import { signOut } from "firebase/auth"; 

import Modal from "react-native-modal";

export default function CaiDat() {
  const navigation = useNavigation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Nút đăng xuất
  const onHandleLogout = () => {
    signOut(auth)
      .then(() => {
        alert(
          'Logout success',         
        );navigation.navigate('Welcome');
      })
      .catch((err) => 
    alert("Logout error", err.message));
  };

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };
  const handleCancel = () => {
    toggleLogoutModal();
  };
  const handleLogout = () => {
    toggleLogoutModal();
  };

return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.view1}>
        <Pressable onPress={() => navigation.goBack()}>
          <View style={styles.iconback}>
            <Icon name="chevron-back" size={25} color="white" />
          </View>
        </Pressable>
        <Text style={styles.caidat}>Cài đặt</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="key" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Tài khoản và bảo mật</Text>
            <View style={styles.thanhngangnho}/>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="lock-closed-outline" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Quyền riêng tư</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} /> 
  
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="key" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Dữ liệu ... </Text>
            <View style={styles.thanhngangnho}/>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="lock-closed-outline" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Cấp quyền ...</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} />

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="information-circle-outline" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Thông tin về app</Text>
            <View style={styles.thanhngangnho}/>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}>
          <Icon name="help-circle-outline" size={35} color="blue" style={styles.userIcon}/>
          <View style={styles.userInfo1}>
            <Text style={styles.userName}>Liên hệ hỗ trợ</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} />

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              borderColor: pressed ? 'gray' : 'lightgray', // Màu sắc khung border
            },
          ]}
        >
          <Icon name="log-out-outline" size={20} color="black" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      {/* Modal Logout */}
      <Modal isVisible={isLogoutModalVisible} onBackdropPress={toggleLogoutModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Bạn có muốn đăng xuất không?
          </Text>

          <View style={styles.modalButtonContainer}>
            <Pressable style={styles.modalButton} onPress={handleCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={onHandleLogout}>
              <Text style={styles.modalButtonText}>Đăng xuất</Text>
            </Pressable>
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
    caidat: {
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
    // Body
    body: {
      flex: 1,
    },
    //thanh cắt ngang nhỏ
    thanhngangnho: {
      height: 1, // Độ cao của thanh phân cách
      backgroundColor: '#ccc',
      marginVertical: 2, // Khoảng cách dọc giữa các phần
    },
    //thanh cắt ngang lớn
    separator: {
      height: 3,
      backgroundColor: '#ccc',
      marginVertical: 3, 
    },
    userContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    userIcon: {
      marginRight: 10,
    },
    userInfo1: {
      flex: 1,
      marginLeft: 10,
      marginTop: 12,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    // Footer
    footer: {
      alignItems: "center",
      flex: 1,
      justifyContent: "flex-end", // Di chuyển nút logout xuống dưới cùng
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 20,
      borderColor: 'gray',
      backgroundColor: 'silver',
      paddingVertical: 8,
      paddingHorizontal: 80, // tang cdai ô
      marginBottom: 50, // Khoảng cách nút logout và đáy trang
    },
    logoutIcon: {
      marginRight: 5,
      transform: [{ rotateY: '180deg' }] // Quay ngược lại
    },
    logoutText: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    icon: {
      marginLeft: 10,
    },
    // Modal
    modalContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 20, 
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButtonContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%', 
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
      textAlign: 'center', 
    }, 
});
