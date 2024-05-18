import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, FlatList, SafeAreaView, Alert, Image, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

const TimKiem_Chat = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState(""); // Lưu trữ từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Lưu trữ kết quả tìm kiếm
  const [currentUser, setCurrentUser] = useState(null); // Lưu trữ thông tin người dùng hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const auth = getAuth(); // Lấy thực thể xác thực từ Firebase

  // Hook useEffect để lấy thông tin người dùng hiện tại
  useEffect(() => {
    const getCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
      }
    };

    getCurrentUser();
  }, [auth.currentUser]);

  // Hàm kiểm tra hai người dùng đã là bạn bè chưa
  const checkIfFriends = async (userId) => {
    const db = getFirestore();
    const friendsRef = collection(db, "friends");

    try {
      const querySnapshot = await getDocs(query(friendsRef, where("userId", "==", auth.currentUser.uid), where("friendId", "==", userId)));
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return false;
    }
  };

  // Xử lý tìm kiếm người dùng theo từ khóa
  const handleSearch = async () => {
    setLoading(true); // Bắt đầu loading
    setSearchResults([]);

    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", searchTerm));

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id, uid: doc.id, isFriend: false }; // Đảm bảo có uid
        results.push(userData);
      });

      // Kiểm tra trạng thái kết bạn cho từng người dùng tìm thấy
      const updatedResults = await Promise.all(results.map(async (user) => {
        const isFriend = await checkIfFriends(user.uid); // Sử dụng uid
        return { ...user, isFriend };
      }));

      if (updatedResults.length === 0) {
        Alert.alert("Không tìm thấy bạn bè.");
      }

      setSearchResults(updatedResults);
    } catch (error) {
      console.error("Error searching for users: ", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Tạo phòng chat
  const createChatRoom = async (friends) => {
    try {
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.uid) {
        throw new Error("Người dùng hiện tại chưa được xác thực hoặc thiếu UID.");
      }
  
      if (!friends || !friends.uid) {
        throw new Error("Dữ liệu bạn bè không hợp lệ hoặc thiếu UID.");
      }

      // Sắp xếp UID của hai người dùng theo thứ tự từ điển
      const sortedUIDs = [currentUser.uid, friends.uid].sort();

      // Tạo reference cho document trong "Chats" collection
      const chatRoomRef = doc(db, "Chats", sortedUIDs.join("_"));

      // Lấy thông tin của phòng chat
      const chatRoomSnapshot = await getDoc(chatRoomRef);

      // Nếu phòng chat không tồn tại
      if (!chatRoomSnapshot.exists()) {
        const chatRoomId = generateRandomId();
        // Tạo một phòng chat mới
        await setDoc(chatRoomRef, {
          ID_roomChat: chatRoomId,
          UID: [currentUser.uid, friends.uid],
          UID_Chats: sortedUIDs.join("_")
        });
        console.log("Phòng trò chuyện mới được tạo:", friends);
      }
      // Navigate to the chat screen
      navigation.navigate("Chat_fr", { friends });
    } catch (error) {
      console.error("Lỗi khi tạo hoặc điều hướng đến phòng trò chuyện!", error);
    }
  };

  // Function to generate a random 6-digit ID
  const generateRandomId = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Render component
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={20} color="white" />
          </Pressable>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#0d47a1' : '#006AF5',
                paddingHorizontal: 10,
                borderRadius: 5,
              },
              styles.searchButton
            ]}
            onPress={handleSearch}
          >
            <Text style={styles.textSearch}>Tìm bạn bè</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.userItem}>
                <Pressable onPress={() => createChatRoom(item)}>
                  <Image source={{ uri: item.photoURL }} style={styles.image} />
                  <Text style={styles.textname}>{item.name}</Text>
                </Pressable>
                {!item.isFriend && (
                  <Pressable style={styles.addButton} onPress={() => createChatRoom(item)}>
                    <Text style={styles.addButtonText}>Vào phòng chat</Text>
                  </Pressable>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

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
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 10,
    color: 'white',
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  textSearch: {
    color: "white",
    fontWeight: '500'
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textname: {
    fontSize: 15,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#006AF5',
    padding: 10,
    marginLeft: 70,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default TimKiem_Chat;
