import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where} from 'firebase/firestore';
import Icon from "react-native-vector-icons/Ionicons";
import TaoNhomDuy from '../Tab_DanhBa/TaoNhomDuy';
import DanhSachNhom from '../Tab_DanhBa/DanhSachNhom';
const Chat = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentPage, setCurrentPage] = useState('DanhSachNhom');
  //Tìm nạp dữ liệu người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('User data:', userData);
          setUserData(userData);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [db, user]);

// Tìm nạp dữ liệu trò chuyện và lắng nghe cập nhật theo thời gian thực
useEffect(() => {
  const chatsCollectionRef = collection(db, 'Chats');
  const chatsQuery = query(chatsCollectionRef, where('UID', 'array-contains', user.uid)); // Tạo truy vấn với điều kiện

  const unsubscribeChats = onSnapshot(
    chatsQuery,
    (snapshot) => {
      const chatsMap = new Map();

      snapshot.docs.forEach(async (chatDoc) => {
        const chatData = chatDoc.data();
        const chatUIDs = chatData.UID.filter((uid) => uid !== user.uid);
        const otherUID = chatUIDs[0];
        console.log(otherUID);
        const userDocRef = doc(db, 'users', otherUID);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          const messQuery = query(
            collection(db, 'Chats', chatData.UID_Chats, 'chat_mess'),
            orderBy('createdAt', 'desc')
          );

        // Nghe thông tin cập nhật theo thời gian thực cho tin nhắn trò chuyện
        const unsubscribeMessages = onSnapshot(messQuery, (messSnapshot) => {
          let latestMessage = null;
          if (!messSnapshot.empty) {
            latestMessage = messSnapshot.docs[0].data();
          }

          const chatItem = {
            ID_room: chatDoc.data().ID_roomChat,
            otherUser: {
              UID: userData.UID,
              name: userData.name,
              photoURL: userData.photoURL,
              userId: userData.userId
            },
            latestMessage: latestMessage
          };

          // Kiểm tra nếu có dữ liệu latestMessage trước khi thêm vào danh sách
          if (latestMessage) {
            // Cập nhật chatsMap với mục trò chuyện mới
            chatsMap.set(chatItem.ID_room, chatItem);
          }

          // Chuyển đổi giá trị bản đồ thành mảng và sắp xếp theo dấu thời gian của tin nhắn mới nhất
          const sortedChats = Array.from(chatsMap.values()).sort((a, b) => {
            if (a.latestMessage && b.latestMessage) {
              return b.latestMessage.createdAt - a.latestMessage.createdAt;
            }
            return 0;
          });

          // Đặt trạng thái với các mục trò chuyện được sắp xếp
          setChats([...sortedChats]);
        });

        return () => {
          // Hủy đăng ký người nghe tin nhắn trò chuyện trước đó
          unsubscribeMessages();
        };

        }
      });
    }
  );

  return () => {
    // Hủy đăng ký người nghe trước đó để trò chuyện
    unsubscribeChats();
  };
}, [db, user]);
const changePage = (page) => {
  setCurrentPage(page);
};

const renderPageContent = () => {
  switch (currentPage) {
    case 'TaoNhomDuy':
      return <TaoNhomDuy />;
    case 'DanhSachNhom':
      return <DanhSachNhom />;
    default:
      return <View />;
  }
};

  // Render each chat item
  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer} onPress={() => navigation.navigate("Chat_fr", { friends: item.otherUser })}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: item.otherUser.photoURL }} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text style={styles.userName}>{item.otherUser.name}</Text>
          {item.latestMessage && (
            <View style={styles.latestMessageContent}>
              <Text style={styles.latestMessageText}>{item.latestMessage.text}</Text>
              <Text style={styles.latestMessageTimestamp}>
                {item.latestMessage.createdAt.toDate().toLocaleString()}
              </Text>
              <View style={styles.separator}></View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  ); 
  

  // const [userFriends, setUserFriends] = useState({});
  // const [senders, setSenders] = useState({});
  // const [selectedFriend, setSelectedFriend] = useState(null);
  // const navigation = useNavigation();
  // const auth = getAuth();
  // useEffect(() => {
  //   const db = getFirestore();

  //   const unsubscribeUserFriends = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
  //     if (doc.exists()) {
  //       setUserFriends(doc.data().friends || {});
  //     }
  //   }, (error) => {
  //     console.error("Error fetching user friends:", error);
  //   });

  //   const fetchSenders = async () => {
  //     try {
  //       const usersRef = collection(db, "users");
  //       const usersSnapshot = await getDocs(usersRef);
  //       const sendersData = {};
  //       usersSnapshot.forEach((doc) => {
  //         sendersData[doc.id] = doc.data();
  //       });
  //       setSenders(sendersData);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchSenders();

  //   return () => {
  //     unsubscribeUserFriends();
  //   };
  // }, [auth.currentUser.uid]);

  // // Xử lý khi click vào bạn bè
  // const handleFriendClick = (friendId) => {
  //   setSelectedFriend(friendId);
  // };

  // const renderFriend = ({ item: friendId }) => (
  //   <TouchableOpacity key={friendId} onPress={() => handleFriendClick(friendId)} style={styles.itemuser}>
  //     <Image style={styles.image}
  //       source={{ uri: senders[friendId]?.photoURL }}
  //       alt={senders[friendId]?.name}
  //     />
  //     <Text style={styles.text}>{senders[friendId]?.name}</Text>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="white" />
          {/* <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_BanBe")}> */}
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_Chat")}>
            <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <Icon name="qr-code" size={25} color="white" />
          <Icon name="add" size={30} color="white" style={styles.icon} />
        </View>  
      </SafeAreaView>
      <View style={styles.container}>
      
      {renderPageContent()}
    </View>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.ID_room.toString() + '_' + item.otherUser.UID}
      />
      <View style={styles.navBarNhom}>
        <TouchableOpacity onPress={() => changePage('DanhSachNhom')}>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.title}></Text>
            {Object.keys(userFriends).length === 0 ? (
              <Text>Bạn không có bạn bè nào</Text>
            ) : (
              <FlatList
                data={Object.keys(userFriends)}
                renderItem={renderFriend}
                keyExtractor={(friendId) => friendId}
              />
            )}
            {selectedFriend && (
              <Pressable friendId={selectedFriend} /> // Truyền friendId vào phần chatbox mới
            )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent:"center",
    height:48,
    marginLeft: 10,      
  },
  textSearch:{
    color:"white",
    fontWeight:'500'
  }, 
  itemContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width:'100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 8,
  },
  latestMessageContent: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
  },
  latestMessageText: {
    fontSize: 14,
  },
  latestMessageTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#dcdcdc',
    width: '100%',
  },
  ///
  // itemuser: {
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       marginBottom: 30,
  //   },
  //   image: {
  //       width: 60,
  //       height: 60,
  //       resizeMode: 'cover',
  //       borderRadius: 30,
  //       marginLeft: 20,
  //   },
  //   text: {
  //       fontSize: 18,
  //       marginLeft: 20,
  //   },
  //   view1: {
  //       flexDirection: 'row',
  //       margin: 10,
  //   },
  //   text1: {
  //       fontSize: 15,
  //       justifyContent: "center",
  //       marginLeft: 10
  //   },
  //   separator: {
  //       height: 5,
  //       backgroundColor: '#ccc',
  //       marginVertical: 5,
  //   },
  //   textall: {
  //       fontSize: 16,
  //       marginLeft: 10,
  //       paddingHorizontal: 10,   
  //   },
  //   // textGroup: {
  //   //     fontSize: 20,
  //   //     fontWeight: 'bold',
  //   //     marginLeft: 15,
  //   //     marginTop: 10,
  //   // },
  // ////
  // // container: {
  // //   width: '80%',
  // //   alignSelf: 'center',
  // // },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // friendItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  // },
});

export default Chat;