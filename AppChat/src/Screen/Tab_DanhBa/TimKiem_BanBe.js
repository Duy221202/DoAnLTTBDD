import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
//import Icon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, query, where, getDocs , doc, setDoc, getDoc, addDoc} from "firebase/firestore";
import { getAuth} from "firebase/auth";

const TimKiem_BanBe = () => {
  // const navigation = useNavigation();
  // const [input, setInput] = useState("");
  // const [friendsList, setFriendsList] = useState([]);
  // const [loading, setLoading] = useState(false); // Loading state for search
  // const auth = getAuth();

  // const handleInputChange = (text) => {
  //   setInput(text);
  // };

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       console.log("Người dùng chưa đăng nhập.");
  //       // Bạn có thể muốn điều hướng đến màn hình đăng nhập tại đây nếu chưa đăng nhập
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  // const checkFriendshipStatus = async (UID) => {
  //   console.log(UID);
  //   try {
  //     const db = getFirestore();
  //     const currentUser = auth.currentUser;
  //     console.log(currentUser);
  //     const currentUserDocRef = doc(db, "users", currentUser.uid);
  //     const friendDataQuery = query(collection(currentUserDocRef, "friendData"), where("UID_fr", "==", UID));
  //     const friendDataSnapshot = await getDocs(friendDataQuery);
  //     return !friendDataSnapshot.empty; // Trả về true nếu có dữ liệu, ngược lại trả về false
  //   } catch (error) {
  //     console.error("Lỗi kiểm tra trạng thái tình bạn:", error);
  //     return false; // Trả về false nếu có lỗi xảy ra
  //   }
  // };

  // const handleSearch = async () => {
  //   try {
  //     setLoading(true); // Set loading state to true while fetching data
  //     const db = getFirestore();

  //     const userQuery = query(collection(db, "users"), where("name", "==", input));
  //     const userSnapshot = await getDocs(userQuery);

  //     const foundFriends = [];
  //     const currentUser = auth.currentUser;
  //     let index = 0; // Bắt đầu với index = 0
  //     userSnapshot.forEach(doc => {
  //       const userData = doc.data(); 
  //       if (userData.UID !== currentUser.uid) {
  //         foundFriends.push({
  //           id: index++,
  //           name: userData.name,
  //           photoUrl: userData.photoURL,
  //           userId: userData.userId,
  //           UID: userData.UID
  //         });
  //       }
  //     });

  //     const updatedFriendsList = [];
  //     for (const friend of foundFriends) {
  //       const isFriend = await checkFriendshipStatus(friend.UID);
  //       updatedFriendsList.push({ ...friend, isFriend });
  //     }
  //     setFriendsList(updatedFriendsList);
  //     // Kiểm tra xem có bạn bè nào được tìm thấy hay không
  //     if (foundFriends.length === 0) {
  //       // Hiển thị thông báo khi không tìm thấy bạn bè
  //       Alert.alert("Không tìm thấy bạn bè.");
  //       console.log("Không tìm thấy bạn bè.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi tìm nạp người dùng:", error);
  //   } finally {
  //     setLoading(false); // Đặt trạng thái tải trở lại sai
  //   }
  // };
  
  // // nút thêm bạn
  // const handleAddFriend = async (friend) => {
  //   try {
  //     const db = getFirestore();
  //     const currentUser = auth.currentUser;

  //     if (currentUser) {
  //       const currentUserDocRef = doc(db, "users", currentUser.uid);
  //       const currentUserDocSnapshot = await getDoc(currentUserDocRef);

  //       if (currentUserDocSnapshot.exists()) {
  //         const currentUserData = currentUserDocSnapshot.data();

  //         const friendSentsQuery = query(collection(currentUserDocRef, "friend_Sents"), where("userId_fr", "==", friend.userId));
  //         const friendSentsSnapshot = await getDocs(friendSentsQuery);

  //         if (friendSentsSnapshot.empty) {
  //           const friend_Sents = {
  //             name_fr: friend.name,
  //             photoURL_fr: friend.photoUrl,
  //             userId_fr: friend.userId,
  //             UID_fr: friend.UID
  //           };
  //           await addDoc(collection(currentUserDocRef, "friend_Sents"), friend_Sents);
  //           console.log("Đã gửi yêu cầu kết bạn.");

  //           const friendDocRef = doc(db, "users", friend.UID);
  //           const friendDocSnapshot = await getDoc(friendDocRef);

  //           if (friendDocSnapshot.exists()) {
  //             const friend_Receiveds = {
  //               name_fr: currentUserData.name,
  //               photoURL_fr: currentUserData.photoURL,
  //               userId_fr: currentUserData.userId,
  //               UID_fr: currentUserData.UID
  //             };
  //             await addDoc(collection(friendDocRef, "friend_Receiveds"), friend_Receiveds);
  //             console.log("Yêu cầu kết bạn đã được gửi thành công!");
  //           } else {
  //             console.error("Tài liệu bạn bè không tồn tại!");
  //           }
  //         } else {
  //           console.log("Yêu cầu kết bạn đã được gửi!");
  //         }
  //       } else {
  //         console.error("Tài liệu người dùng không tồn tại!");
  //       }
  //     } else {
  //       console.error("Không có người dùng nào đăng nhập!");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi thêm bạn bè!", error);
  //   }
  // };

  // const createChatRoom = async (friendData) => {
  //   try {
  //     const db = getFirestore();
  //     const currentUser = auth.currentUser;
  
  //     // Sắp xếp UID của hai người dùng theo thứ tự từ điển
  //     const sortedUIDs = [currentUser.uid, friendData.UID].sort();
  
  //     // Tạo reference cho document trong "Chats" collection
  //     const chatRoomRef = doc(db, "Chats", sortedUIDs.join("_"));
  
  //     // Lấy thông tin của phòng chat
  //     const chatRoomSnapshot = await getDoc(chatRoomRef);
  
  //     // Nếu phòng chat không tồn tại
  //     if (!chatRoomSnapshot.exists()) {
  //       const chatRoomId = generateRandomId();
  //       // Tạo một phòng chat mới
  //       await setDoc(chatRoomRef, {
  //         // Thêm thông tin phòng chat tại đây
  //         ID_roomChat: chatRoomId,
  //         UID: [currentUser.uid, friendData.UID],
  //         UID_Chats: sortedUIDs.join("_")
  //       });
  //       console.log("Phòng trò chuyện mới được tạo:", friendData);
  //     }
  //     // Navigate to the chat screen
  //     navigation.navigate("Chat_fr", { friendData });
  //   } catch (error) {
  //     console.error("Lỗi khi tạo hoặc điều hướng đến phòng trò chuyện!", error);
  //   }
  // };
  
  // // Function to generate a random 6-digit ID
  // const generateRandomId = () => {
  //   const min = 100000;
  //   const max = 999999;
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };
  
  // const renderFriendItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     <Pressable onPress={() => createChatRoom(item)}> 
  //       <Image style={styles.image} source={{ uri: item.photoUrl }} />
  //       <Text style={styles.text}>{item.name}</Text>
  //     </Pressable>
  //     {!item.isFriend && (
  //       <Pressable style={styles.addButton} onPress={() => handleAddFriend(item)}>
  //         <Text style={styles.addButtonText}>Add Friend</Text>
  //       </Pressable>
  //     )}
  //   </View>
  // );

  // return (
  //   <View style={styles.container}>
  //     <SafeAreaView>
  //       <View style={styles.searchContainer}>
  //         <Pressable onPress={() => navigation.goBack()}>
  //           <Icon name="arrowleft" size={20} color="white" />
  //         </Pressable>
  //         <TextInput
  //           style={styles.searchInput}
  //           value={input}
  //           onChangeText={handleInputChange}
  //           placeholder="Tìm kiếm "
  //           placeholderTextColor="white"
  //         />
  //         <Pressable
  //           style={({ pressed }) => [
  //             {
  //               backgroundColor: pressed ? '#0d47a1' : '#006AF5',
  //               paddingHorizontal: 10,
  //               borderRadius: 5,
  //             },
  //             styles.searchButton
  //           ]}
  //           onPress={handleSearch}
  //         >
  //           <Text style={styles.textSearch}>Tìm bạn bè</Text>
  //         </Pressable>
  //       </View>

  //       {loading ? (
  //         <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
  //       ) : (
  //         <FlatList
  //           data={friendsList}
  //           renderItem={renderFriendItem}
  //           keyExtractor={item => item.id}
  //         />
  //       )}
  //     </SafeAreaView>
  //   </View>
  // );

  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState(""); // Lưu trữ từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Lưu trữ kết quả tìm kiếm
  const [currentUser, setCurrentUser] = useState(null); // Lưu trữ thông tin người dùng hiện tại
  const [invitationSentMessage, setInvitationSentMessage] = useState(""); // Lưu trữ thông báo sau khi gửi lời mời
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
    setSearchResults([]);

    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", searchTerm));

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id, invitationSent: false };
        results.push(userData);
      });
      if (results.length === 0) {
        Alert.alert("Không tìm thấy bạn bè.");
      }
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for users: ", error);
    }
  };

  // Gửi lời mời kết bạn
  const sendInvitation = async (userId, index) => {
    const db = getFirestore();

    try {
      const friends = await checkIfFriends(userId);
      if (friends) {
        setInvitationSentMessage("Hai người dùng đã là bạn bè.");
        return;
      }

      const invitationsRef = collection(db, "invitations");

      // Kiểm tra xem người nhận đã gửi lời mời cho người gửi trước đó chưa
      const querySnapshotReceiver = await getDocs(query(invitationsRef, where("senderId", "==", userId), where("receiverId", "==", auth.currentUser.uid)));
      if (!querySnapshotReceiver.empty) {
        setInvitationSentMessage("Người này đã gửi lời mời cho bạn trước đó.");
        return;
      }

      // Kiểm tra xem người gửi đã gửi lời mời cho người nhận trước đó chưa
      const querySnapshotSender = await getDocs(query(invitationsRef, where("senderId", "==", auth.currentUser.uid), where("receiverId", "==", userId)));
      if (!querySnapshotSender.empty) {
        setInvitationSentMessage("Bạn đã gửi lời mời cho người này trước đó.");
        return;
      }

      setSearchResults(prevResults => prevResults.map((user, idx) =>
        idx === index ? { ...user, invitationSent: true } : user
      ));

      await addDoc(invitationsRef, {
        senderId: auth.currentUser.uid,
        receiverId: userId,
        sentAt: new Date(),
        status: "pending"
      });
      setInvitationSentMessage("Lời mời đã được gửi thành công!");
    } catch (error) {
      console.error("Error sending invitation to user:", error);
    }
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

        {/* <View style={styles.itemContainer}>
          {invitationSentMessage !== '' && <Text>{invitationSentMessage}</Text>}
          {searchResults.map((user, index) => (
            <View key={user.id} style={styles.userItem}>
              <Image source={{ uri: user.photoURL }} style={styles.image} />
              <Text style={styles.text}>{user.name}</Text>
              {currentUser && user.id !== currentUser.uid && (
                user.invitationSent ? (
                  <Pressable title="Đã gửi" disabled />
                ) : (
                  <Pressable title="Gửi lời mời" onPress={() => sendInvitation(user.id, index)} />
                )
              )}
            </View>
          ))}
        </View> */}

        <View style={styles.itemContainer}>
          {invitationSentMessage !== '' && <Text>{invitationSentMessage}</Text>}
          {searchResults.map((user, index) => (
            <View key={user.id} style={styles.userItem}>
              <Image source={{ uri: user.photoURL }} style={styles.image} />
              <Text style={styles.text}>{user.name}</Text>
              {currentUser && user.id !== currentUser.uid && (
                user.invitationSent ? (
                  <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>Đã gửi</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.addButton} onPress={() => sendInvitation(user.id, index)}>
                    <Text style={styles.addButtonText}>Gửi lời mời</Text>
                  </Pressable>
                )
              )}
            </View>
          ))}
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
  itemContainer: {
    marginTop: 20,
    flex: 1,
    margin: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  text: {
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#006AF5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  ////////////
  ////////////
  userItem: {
    flexDirection: 'column',
    //alignItems: 'center',
    //borderBottomWidth: 1,
    //borderBottomColor: 'gray',
    paddingVertical: 10,
  },
});

export default TimKiem_BanBe;
