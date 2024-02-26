import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Đảm bảo import Icon từ thư viện của bạn

const Groups = () => {
  // Hàm xử lý chuyển trang
  const handleMenuChange = (menuItem) => {
    // Xử lý chuyển trang tương tự như trong trang Friends
  };

  // Component MenuItem
  const MenuItem = ({ icon, text, routeName }) => {
    // Xử lý hiển thị menu item tương tự như trong trang Friends
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={25} color="white" style={styles.icon} />
          <TextInput style={styles.textTK} placeholder="Tìm kiếm" />
        </View>
        <View style={styles.iconContainer2}>
          <Icon name="person-add-outline" size={25} color="white" style={styles.icon} />
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Các phần tử của trang "Nhóm" */}
        {/* Ví dụ: danh sách nhóm, chức năng tạo nhóm, v.v. */}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Menu */}
        <View style={styles.menuContainer}>
          <MenuItem icon="chatbubbles-outline" text="Tin nhắn" routeName="TinNhan" />
          <MenuItem icon="person-outline" text="Danh bạ" routeName="DanhBa1" />
          <MenuItem icon="apps" text="Khám phá" routeName="KhamPha" />
          <MenuItem icon="book-outline" text="Nhật ký" routeName="NhatKy" />
          <MenuItem icon="person-circle-outline" text="Cá nhân" routeName="CaNhan" />
        </View>
      </View>
    </View>
  );
};

// CSS styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white', // Màu nền có thể thay đổi
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue', // Màu header có thể thay đổi
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer2: {
    // CSS cho phần icon khác (ví dụ: nút thêm bạn bè)
  },
  icon: {
    // CSS cho icon
  },
  textTK: {
    // CSS cho ô nhập liệu tìm kiếm
  },
  body: {
    flex: 1,
    // CSS cho phần body của trang
  },
  footer: {
    // CSS cho phần footer của trang
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  // CSS cho MenuItem và các phần tử khác
};

export default Groups;
