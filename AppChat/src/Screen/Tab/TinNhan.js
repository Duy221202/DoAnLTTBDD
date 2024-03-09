import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native'; // Import useRoute

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
} from "react-native";

const TinNhan = () => {
  const navigation = useNavigation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("TinNhan"); // Khởi tạo trạng thái ban đầu là TinNhan
  
  // const route = useRoute();
  // const name = route.params.name; 

  // Component MenuItem
  const MenuItem = ({ icon, text, routeName }) => {
    const isSelected = selectedMenuItem === routeName; // Kiểm tra xem có phải routeName đang được chọn hay không
    const handlePress = () => {
      if (routeName) {
        navigation.navigate(routeName, {}, {
          // Hàm callback được gọi sau khi navigation đã hoàn tất
          // Nơi bạn cập nhật trạng thái selectedMenuItem
          callback: () => handleMenuChange(routeName)
        });
      } else {
        handleMenuChange(icon);
      }
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

  // const MenuItem = ({ icon, text, routeName, navigation, name }) => {
  //   const isSelected = selectedMenuItem === routeName;
  //   const handlePress = () => {
  //     navigation.navigate(routeName, { name: name });
  //   };
  
  //   return (
  //     <Pressable
  //       style={styles.menuItem}
  //       onPress={handlePress}
  //     >
  //       <Icon
  //         name={icon}
  //         size={30}
  //         color={isSelected ? "blue" : "#66E86B"}
  //       />
  //       <Text style={{ color: isSelected ? "blue" : "#66E86B" }}>{text}</Text>
  //     </Pressable>
  //   );
  // };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={25} color="white" style={styles.icon} />
          <TextInput style={styles.textTK} placeholder="Tìm kiếm"></TextInput>
        </View>
        <View style={styles.iconContainer2}>
          <Icon name="qr-code" size={25} color="white" style={styles.icon} />
          <Icon name="add" size={25} color="white" style={styles.icon} />
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
            <Text style={styles.userName}>Cloud của tôi</Text>
            <Text style={styles.userMessage}>
              Bạn đã nhận được một tin nhắn mới
            </Text>
          </View>
        </Pressable>
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
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userMessage}>Hello</Text>
          </View>
        </Pressable>
      </View>
      
      {/* Footer */}
      {/* <View style={styles.footer}>
        <View style={styles.menuContainer}>
          <MenuItem
            icon="chatbubbles-outline"
            text="Tin nhắn"
            routeName="TinNhan" // Thay bằng route name của màn hình Tin nhắn
            navigation={navigation}
          />
          <MenuItem
            icon="person-outline"
            text="Danh bạ"
            routeName="DanhBa1" // Thay bằng route name của màn hình danh bạ
            navigation={navigation}
          />
          <MenuItem
            icon="apps"
            text="Khám phá"
            routeName="KhamPha" // Thay bằng route name của màn hình khám phá
            navigation={navigation}
          />
          <MenuItem
            icon="book-outline"
            text="Nhật ký"
            routeName="NhatKy" // Thay bằng route name của màn hình nhật ký
            navigation={navigation}
          />
          <MenuItem
            icon="person-circle-outline"
            text="Cá nhân"
            routeName="CaNhan" // Thay bằng route name của màn hình cá nhân
            navigation={navigation}
            //name={name} // Truyền giá trị name vào MenuItem thông qua props
          />
        </View>
      </View> */}
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
    //marginTop: 30, // canh chỉnh phù hợp với android
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
    marginRight: 5,
    flexDirection: 'row',
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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

export default TinNhan;
