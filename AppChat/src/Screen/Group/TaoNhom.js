import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, TextInput, View, Image,TouchableWithoutFeedback, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, addDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';

const TaoNhom = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const [userFriendsList, setUserFriendsList] = useState([]);

    const [selectedFriends, setSelectedFriends] = useState([]);
    const toggleSelectFriend = (friendId) => {
      if (selectedFriends.includes(friendId)) {
          setSelectedFriends(selectedFriends.filter(id => id !== friendId));
      } else {
          setSelectedFriends([...selectedFriends, friendId]);
      }
    };

    const [groupName, setGroupName] = useState('');
    const createGroup = async () => {
      try {
          const db = getFirestore();
          const user = auth.currentUser;

          if (user) {
              // Tạo một tài liệu mới trong bộ sưu tập "groups"
              const groupRef = await addDoc(collection(db, "groups"), {
                  name: groupName,
                  members: selectedFriends
              });

              console.log("Group created with ID: ", groupRef.id);
              // Xử lý sau khi nhóm được tạo thành công
              // Ví dụ: chuyển hướng người dùng đến trang chi tiết nhóm
          } else {
              console.error("No user signed in!");
          }
      } catch (error) {
          console.error("Error creating group:", error);
      }
    };

    const handleCreateGroup = () => {
        if (groupName.trim() === '') {
            // Thông báo lỗi nếu tên nhóm trống
            Alert.alert("Vui lòng nhập tên nhóm");
            return;
        }

        if (selectedFriends.length < 2) {
            // Thông báo lỗi nếu không có thành viên nào được chọn
            Alert.alert("Vui lòng chọn ít nhất 2 người bạn");
            return;
        }

        // Gửi dữ liệu nhóm lên Firebase
        createGroup();
        Alert.alert("Tạo nhóm thành công");
    };
    
    const fetchUserFriends = async () => {
      try {
          const db = getFirestore();
          const auth = getAuth();
          const user = auth.currentUser;

          if (user) {
              const userDocRef = doc(db, "users", user.uid);
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  const friendsCollectionRef = collection(userDocRef, "friendData");
                  const friendsSnapshot = await getDocs(friendsCollectionRef);

                  const userFriends = [];
                  friendsSnapshot.forEach((doc) => {
                      const friendData = doc.data();
                      userFriends.push({
                          id: doc.id,
                          name: friendData.name_fr,
                          photoUrl: friendData.photoURL_fr,
                          userId: friendData.userId_fr,
                          UID_fr: friendData.UID_fr
                      });
                  });

                  setUserFriendsList(userFriends);
              } else {
                  console.error("User document does not exist!");
              }
          } else {
              console.error("No user signed in!");
          }
      } catch (error) {
          console.error("Error fetching user friends:", error);
      }
  };

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
              console.log(user);
              fetchUserFriends(); // Lấy danh sách bạn bè khi người dùng được xác thực

              const db = getFirestore();
              const userDocRef = doc(db, "users", user.uid);
              const friendsCollectionRef = collection(userDocRef, "friendData");

              const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
                  const userFriends = [];
                  let index = 0; // Bắt đầu với index = 0    Mới
                  snapshot.forEach((doc) => {
                      const friendData = doc.data();
                      userFriends.push({
                          //id: doc.id,
                          id: index++, // Gán ID bằng index và tăng index sau mỗi lần sử dụng
                          name: friendData.name_fr,
                          photoUrl: friendData.photoURL_fr,
                          userId: friendData.userId_fr,
                          UID_fr: friendData.UID_fr
                      });
                  });
                  console.log(userFriends);
                  setUserFriendsList(userFriends); // Update friends list
              });
              

              return () => unsubscribe(); // Hủy đăng ký khi thành phần bị xóa
          } else {
              console.log("No user signed in!");
          }
      });

      return unsubscribe;
  }, []);

  // Sắp xếp danh sách người dùngFriendsList theo thứ tự bảng chữ cái theo tên
  const sortedUserFriendsList = userFriendsList.slice().sort((a, b) => {
      return a.name.localeCompare(b.name);
  });

  // Hiển thị mục bạn bè người dùng
  const renderUserFriendItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Pressable style={styles.itemuser} onPress={() => toggleSelectFriend(item.id)}>
            <Image style={styles.image} source={{ uri: item.photoUrl }} />
            <Text style={styles.text}>{item.name}</Text>
            {/* Ô tròn để chọn */}
            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={[styles.checkbox, selectedFriends.includes(item.id) && styles.checked]} />
            </TouchableOpacity>
        </Pressable>
    </View>
  );

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.searchContainer}>
              <Pressable onPress={() => navigation.goBack()}>
                  <AntDesign name="arrowleft" size={20} color="white" />
              </Pressable>
              <Text style={styles.textSearch}>Nhóm mới</Text>
          </View>

          <View>
            <TextInput
              style={styles.inputgr}
              placeholder="Đặt tên nhóm"
              placeholderTextColor="black"
              onChangeText={text => setGroupName(text)} // Thiết lập giá trị của TextInput vào biến groupName
            />

            {/* <View style={{flexDirection: "row", alignSelf: "center", marginTop: 10, backgroundColor: "#ccc", width: '80%', padding: 5}}>
                <Pressable >
                    <Icon name="search" size={20} color="white" />
                </Pressable>

                <Pressable style={styles.searchInput}>
                    <TextInput style={styles.textSearch} placeholder="Tìm kiếm"></TextInput>
                </Pressable>
            </View> */}

            <View style={{flex: 1}}>
                {/* Separator */}
                <View style={styles.separator} /> 

                <Text style={styles.textall}>Tất cả</Text>

                <ScrollView>
                    <FlatList
                        data={sortedUserFriendsList}
                        renderItem={renderUserFriendItem}
                        keyExtractor={(item) => item.id}
                    />
                </ScrollView>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={handleCreateGroup}>
                <Text style={{backgroundColor: '#ccc', textAlign: 'center', fontSize: 18, fontWeight: 'bold', borderRadius: 10, borderWidth: 1, width: 100, height: 30, }}>Tạo nhóm</Text>
              </TouchableOpacity>
            </View>
            
          </View>

        </SafeAreaView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 32,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#418df8",
      padding: 9,
      height: 48,
      width: '100%',
    },
    textSearch: { 
      flex:1,
      color: "white",
      fontWeight: '500',
      marginLeft: 20
    },
    //
    inputgr: {
      marginLeft: 30,
      marginTop: 10,
    },
    //
  itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemuser: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
  },
  text: {
    fontSize: 18,
    marginTop: 18,
    marginLeft: 20,
  },
  //
  checkboxContainer: {
    position: 'absolute',
    top: 20, // Điều chỉnh vị trí theo cần thiết
    right: 20, // Điều chỉnh vị trí theo cần thiết
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#418df8', // Màu viền của ô tròn để chọn
  },
  checked: {
    backgroundColor: '#418df8', // Màu nền của ô tròn khi đã được chọn
  },
  //
  view1: {
    flexDirection: 'row',
    margin: 10,
  },
  text1: {
    fontSize: 15,
    justifyContent: "center",
    marginLeft: 10
  },
  separator: {
    marginTop: 10,
    height: 5,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  textall: {
    fontSize: 16,
    marginLeft: 10,
    paddingHorizontal: 10,   
  },
  textGroup: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
  },
  //
});
  
export default TaoNhom;