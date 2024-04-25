import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where} from 'firebase/firestore';
import Icon from "react-native-vector-icons/Ionicons";

const Chat = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [chats, setChats] = useState([]);

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

  // Render each chat item
  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer} onPress={() => navigation.navigate("Chat_fr", { friendData: item.otherUser })}>
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="white" />
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_BanBe")}>
            <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <Icon name="qr-code" size={25} color="white" />
          <Icon name="add" size={30} color="white" style={styles.icon} />
        </View>  
      </SafeAreaView>

      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.ID_room.toString() + '_' + item.otherUser.UID}
      />
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
});

export default Chat;