import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
} from "react-native";

const CaNhan = () => {
  const navigation = useNavigation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("CaNhan");

  // Hàm để cập nhật trạng thái khi chuyển đổi giữa các tab menu
  const handleMenuChange = (menuItem) => {
    if (selectedMenuItem !== menuItem) {
      setSelectedMenuItem(menuItem); // Cập nhật trạng thái trước khi chuyển trang
      navigation.navigate(menuItem);
    }
  };

  // Component MenuItem
  const MenuItem = ({ icon, text, routeName }) => {
    const isSelected = selectedMenuItem === routeName;
    const handlePress = () => {
        navigation.navigate(routeName); // Điều hướng đến trang tương ứng
    
        // Sử dụng hàm callback của navigate để cập nhật trạng thái selectedMenuItem sau khi điều hướng đã hoàn tất
        navigation.addListener('transitionEnd', () => {
          setSelectedMenuItem(routeName);
        });
    };

    return (
      <Pressable
        style={styles.menuItem}
        onPress={handlePress}
      >
        <Icon
          name={icon}
          size={30}
          color={isSelected ? "blue" : "#66E86B"}
        />
        <Text style={{ color: isSelected ? "blue" : "#66E86B" }}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={25} color="white" style={styles.icon} />
          <TextInput style={styles.textTK} placeholder="Tìm kiếm"></TextInput>
        </View>
        <View style={styles.iconContainer2}>
          <Icon name="settings-outline" size={25} color="white" style={styles.icon} />
        </View>
      </View>
      
      {/* Body */}
      <View style={styles.body}>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="person-circle-outline"
            size={50}
            color="#66E86B"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Cá Nhân</Text>
            <Text style={styles.userMessage}>Xem trang cá nhân</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} />

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="musical-notes-outline"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Nhạc chờ</Text>
            <Text style={styles.userMessage}>Đăng ký nhạc chờ, thể hiện cá tính</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="qr-code-outline"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Ví QR</Text>
            <Text style={styles.userMessage}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="cloud-outline"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Cloud của tôi</Text>
            <Text style={styles.userMessage}>Lưu trữ các tin nhắn quan trọng</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} /> 

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="pie-chart-outline"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Dung lượng và dữ liệu</Text>
            <Text style={styles.userMessage}>Quản lý dữ liệu của bạn</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} /> 

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="key"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Tài khoản và bảo mật</Text>
            <Text style={styles.userMessage}>...</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="lock-closed-outline"
            size={50}
            color="blue"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Quyền riêng tư</Text>
            <Text style={styles.userMessage}>...</Text>
          </View>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.menuContainer}>
          <MenuItem
            icon="chatbubbles-outline"
            text="Tin nhắn"
            routeName="TinNhan" // Thay bằng route name của màn hình Tin nhắn
          />
          <MenuItem
            icon="person-outline"
            text="Danh bạ"
            routeName="DanhBa1" // Thay bằng route name của màn hình danh bạ
          />
          <MenuItem
            icon="apps"
            text="Khám phá"
            routeName="KhamPha" // Thay bằng route name của màn hình khám phá
          />
          <MenuItem
            icon="book-outline"
            text="Nhật ký"
            routeName="NhatKy" // Thay bằng route name của màn hình nhật ký
          />
          <MenuItem
            icon="person-circle-outline"
            text="Cá nhân"
            routeName="CaNhan" // Thay bằng route name của màn hình cá nhân
          />
        </View>
      </View>
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#66E86B",
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    iconContainer: {
      marginLeft: 5,
      flexDirection: 'row',
    },
    textTK: {
      marginLeft: 5,
      fontSize: 18,
      color: 'white',
      width: 250,
    },
    iconContainer2: {
      marginRight: 15,
      flexDirection: 'row',
    },
    body: {
      flex: 1,
      paddingHorizontal: 10,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingBottom: 10,
    },
    userIcon: {
      marginRight: 10,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    userMessage: {
      fontSize: 16,
      color: 'gray',
    },
    // thanh cắt ngang
    separator: {
      height: 5, // Độ cao của thanh phân cách
      backgroundColor: '#ccc', // Màu sắc của thanh phân cách
      marginVertical: 5, // Khoảng cách dọc giữa các phần
    },
    footer: {
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: 20,
    },
    menuContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    menuItem: {
      alignItems: "center",
      flex: 1,
    },
    icon: {
      marginLeft: 10,
    },
});
export default CaNhan;