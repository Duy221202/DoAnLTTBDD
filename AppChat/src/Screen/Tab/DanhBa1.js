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
  TouchableOpacity,
} from "react-native";

const DanhBa1 = () => {
  const navigation = useNavigation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("Friends");
  const [selectedButton, setSelectedButton] = useState('All');

  // const route = useRoute();
  // const name = route.params.name;

  useEffect(() => {
    // Set mặc định là tab "Bạn bè" được chọn khi component được render lần đầu
    setSelectedMenuItem("Friends");
  }, []);

  const handleButtonChange = (button) => {
    setSelectedButton(button);
  };

  const handleMenuChange = (menuItem) => {
      // if (selectedMenuItem !== menuItem) {
      setSelectedMenuItem(menuItem); // Cập nhật trạng thái trước khi chuyển trang
      // navigation.navigate(menuItem);
      // }
  };

  const MenuItem = ({ icon, text, routeName }) => {
    const isSelected = selectedMenuItem === routeName;
    const handlePress = () => {
      navigation.navigate(routeName); // Điều hướng đến trang tương ứng
      // Sử dụng hàm callback của navigate để cập nhật trạng thái selectedMenuItem sau khi điều hướng đã hoàn tất
      navigation.addListener("transitionEnd", () => {
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
          color={isSelected || routeName === "DanhBa1" ? "blue" : "#66E86B"} // Giữ màu xanh cho tab "Danh bạ"
        />
        {/* Giữ màu xanh cho tab "Danh bạ" (DanhBa1) và tab được chọn */}
        <Text style={{ color: isSelected || routeName === "DanhBa1" ? "blue" : "#66E86B" }}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={25} color="white" style={styles.icon} />
          <TextInput style={styles.textTK} placeholder="Tìm kiếm"></TextInput>
        </View>
        <View style={styles.iconContainer2}>
          <Icon name="person-add-outline" size={25} color="white" style={styles.icon} />
        </View>
      </View>

      <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, selectedMenuItem === 'Friends' && styles.selectedMenuItem]}
            onPress={() => handleMenuChange('Friends')}>
            <Text style={styles.tabText}>Bạn bè</Text>
          </Pressable>
          
          <Pressable
            style={[styles.tabItem, selectedMenuItem === 'Groups' && styles.selectedMenuItem]}
            onPress={() => handleMenuChange('Groups')}>
            <Text style={styles.tabText}>Nhóm</Text>
          </Pressable>
          
          <Pressable
            style={[styles.tabItem, selectedMenuItem === 'OA' && styles.selectedMenuItem]}
            onPress={() => handleMenuChange('OA')}>
            <Text style={styles.tabText}>OA</Text>
          </Pressable>
      </View>

      <View style={styles.bodyContainer}>
      {selectedMenuItem === "Friends" && (
      <View style={styles.body}>
        <View style={styles.banbe}>
          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="cloud-outline"
              size={50}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Lời mời kết bạn</Text>
              {/* <Text style={styles.userMessage}>aegahah</Text> */}
            </View>
          </Pressable>

          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="cloud-outline"
              size={50}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Bạn từ danh bạ máy</Text>
              {/* <Text style={styles.userMessage}>AMNKNKN</Text> */}
            </View>
          </Pressable>

          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="cloud-outline"
              size={50}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tài khoản và bảo mật</Text>
              {/* <Text style={styles.userMessage}>123</Text> */}
            </View>
          </Pressable>
        </View>
        
        {/* thanh cắt ngang */}
        <View style={styles.separator} /> 

        <View style={styles.bottomButtons}>
          <Pressable
            style={[styles.bottomButton, selectedButton === 'All' && styles.selectedButton]}
            onPress={() => handleButtonChange('All')}>
            <Text style={styles.bottomButtonText}>Tất cả</Text>
          </Pressable>
          <Pressable
            style={[styles.bottomButton, selectedButton === 'New' && styles.selectedButton]}
            onPress={() => handleButtonChange('New')}>
            <Text style={styles.bottomButtonText}>Mới truy cập</Text>
          </Pressable>
        </View>
        

        {selectedButton === 'All' && (
        <View style={styles.banbe3}>
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
            <View style={styles.userInfo2}>
              <Text style={styles.userName}>Người dùng 1</Text>
                <View style={styles.icon2}>
                  <Icon
                    name="call-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 20}]}
                  />
                  <Icon
                    name="videocam-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 15}]}
                  />
                </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Icon
              name="person-circle-outline"
              size={50}
              color="blue"
              style={styles.userIcon}
            />
            <View style={styles.userInfo2}>
              <Text style={styles.userName}>Người dùng 2</Text>
              <View style={styles.icon2}>
                  <Icon
                    name="call-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 20}]}
                  />
                  <Icon
                    name="videocam-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 15}]}
                  />
                </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Icon
              name="person-circle-outline"
              size={50}
              color="blue"
              style={styles.userIcon}
            />
            <View style={styles.userInfo2}>
              <Text style={styles.userName}>Người dùng 3</Text>
              <View style={styles.icon2}>
                  <Icon
                    name="call-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 20}]}
                  />
                  <Icon
                    name="videocam-outline"
                    size={30}
                    color="#66E86B"
                    style={[styles.userIcon2, {marginRight: 15}]}
                  />
                </View>
            </View>
          </Pressable>
        </View>
      )}

      {selectedButton === 'New' && (
        <View style={styles.moitruycap}>
          {/* Hiển thị người dùng mới truy cập ở đây */}
          <Text style={styles.chophep}>Cho phép hiển thị trạng thái truy cập</Text>
          <Text style={styles.chophep2}>Bạn có thể thấy khi bạn bè truy cập. Bạn bè cũng xem được trạng thái truy cập của bạn.</Text>
          <TouchableOpacity style={styles.buttonchophep}>
            <Text style={styles.textchophep}>CHO PHÉP</Text>
          </TouchableOpacity>
        </View>
      )}

      </View>
      )}

      {/* selectedMenuItem cho Groups */}
      {selectedMenuItem === 'Groups' && (
      <View style={styles.body}>
        <View style={styles.banbe}>
          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="people-circle"
              size={50}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tạo nhóm mới</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.tinhnangnoibat}>
          <Text style={styles.text1}>Tính năng nổi bật</Text>
          <View style={styles.noibat}>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="calendar-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Lịch</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="alarm-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhắc hẹn</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.iconnoibat}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="send-outline"
                size={40}
                color="blue"
                style={styles.userIcon2}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Chia sẻ ảnh</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.nhomdtg}>
          <Text style={styles.text1}>Nhóm đang tham gia</Text>
          <View style={styles.banbe}>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 1</Text>
                <Text style={styles.userMessage}>aaaaaaaaaaaa</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 2</Text>
                <Text style={styles.userMessage}>BBBBB</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 3</Text>
                <Text style={styles.userMessage}>123456789</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 4</Text>
                <Text style={styles.userMessage}>xyz</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.userContainer}
              onPress={() => navigation.navigate('UserProfile')}>
              <Icon
                name="person-add-outline"
                size={30}
                color="blue"
                style={styles.userIcon}/>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Nhóm 5</Text>
                <Text style={styles.userMessage}>@@@@</Text>
              </View>
            </Pressable>
          </View>
          
        </View>

      </View>
      )}

      {/* selectedMenuItem cho OA */}
      {selectedMenuItem === 'OA' && (
      <View style={styles.body}>
        <View style={styles.banbe}>
          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="wifi-outline"
              size={40}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tìm thêm Official Account</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.nhomdtg}>
            <Text style={styles.text1}>Official Account đã quan tâm</Text>
            <View style={styles.banbe}>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Cộng đồng</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Game</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Zing MP3</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Pay</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Sticker</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        )}
      </View>

      {/* <View style={styles.footer}>
        <View style={styles.menuContainer}>
          <MenuItem
            icon="chatbubbles-outline"
            text="Tin nhắn"
            routeName="TinNhan" // Thay bằng route name của màn hình Tin nhắn
          />
          <MenuItem
            icon="person-outline"
            text="Danh bạ"
            routeName="DanhBa1"
          />
          <MenuItem
            icon="apps"
            text="Khám phá"
            routeName="KhamPha"
          />
          <MenuItem
            icon="book-outline"
            text="Nhật ký"
            routeName="NhatKy"
          />
          <MenuItem
            icon="person-circle-outline"
            text="Cá nhân"
            routeName="CaNhan"
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
    //marginTop: 30,
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
  bodyContainer: {
    flex: 1, // Chia tỷ lệ dẫn đến footer không bị đẩy lên
    marginBottom: 50, // Giữ một khoảng cố định ở dưới cho footer
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedMenuItem: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  banbe: {
    flexDirection: 'column', 
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  userIcon: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userMessage: {
    fontSize: 12,
    color: 'gray',
  },
  //
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 5,
  },
  bottomButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    marginRight: 15, // Thêm margin để tạo khoảng cách giữa hai nút
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedButton: {
    backgroundColor: 'gray', // Đổi màu nền khi button được chọn
  },
  //
  banbe3: {
    flex: 1,
    paddingHorizontal: 10,
  },
  userInfo2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon2: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  userIcon2: {
    marginRight: 5,
  },
  //
  moitruycap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 55,
    paddingHorizontal: 20,
  },
  chophep: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  chophep2: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonchophep: {
    backgroundColor: "#66E86B",
    height: 40,
    width: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textchophep: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  // thanh cắt ngang
  separator: {
    height: 5, // Độ cao của thanh phân cách
    backgroundColor: '#ccc', // Màu sắc của thanh phân cách
    marginVertical: 5, // Khoảng cách dọc giữa các phần
  },
  // Groups
  tinhnangnoibat: {
    flexDirection: 'column',
  },
  noibat: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start', // Các icon nằm từ bên trái qua
    alignItems: 'center', // Canh chỉnh các icon theo trục Y
    marginVertical: 5, // Khoảng cách dọc giữa các icon
    paddingHorizontal: 25, // Khoảng cách ngang giữa biên và icon
  },
  text1:{
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 10,
  },
  iconnoibat: {
    alignItems: 'center', // Canh chỉnh các icon theo trục Y
    marginRight: 20,
  },
  nhomdtg: {
    flexDirection: 'column',
  },
  // footer 
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

export default DanhBa1;
