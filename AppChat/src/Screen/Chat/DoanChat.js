// import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput, FlatList } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { auth } from "../../../config/firebase";
// //import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { getFirestore, doc, setDoc, getDoc, collection, query, where, equal } from "firebase/firestore";
// import { useRoute } from '@react-navigation/native';

// const DoanChat = () => {
//   const navigation = useNavigation();
//   const firestore = getFirestore();
//   const [displayName, setDisplayName] = useState('');
//   const [photoURL, setPhotoURL] = useState(null);
  
//   const route = useRoute();
//   const name = route.params.name; // Lấy userId được truyền từ trang trước
//   //const photoURL = route.params.photoURL;
  
//   const [message, setMessage] = useState('');
//   const [showSendIcon, setShowSendIcon] = useState(false); // Biến trạng thái để kiểm soát việc hiển thị icon gửi tin nhắn
//   const [messages, setMessages] = useState([]); // Mảng để lưu trữ các tin nhắn

//   useEffect(() => {
//     //fetchUserData(name); // Gọi hàm fetchUserData khi component được render
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setDisplayName(user.displayName);
//         fetchPhotoURL(user.uid);
//         //fetchPhotoURLByName(name); // Thay đổi này
//       } else {
//         setDisplayName('');
//         setPhotoURL(null);
//       }
//     });

//     return unsubscribe;
//   }, []);

//   //Method hiện thị ảnh cá nhân
//   const fetchPhotoURL = async (userId) => {
//     try {
//       const userRef = doc(firestore, 'users', userId);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         const userData = docSnap.data();
//         setPhotoURL(userData.photoURL);
//       }
//     } catch (error) {
//       console.error("Lỗi Error fetching photo URL: ", error);
//     }
//   };

//   //Method lấy ảnh cá nhân dựa trên tên người dùng
//   const fetchPhotoURLByName = async (userId) => {
//     try {
//       const q = query(collection(firestore, 'users'), where("displayName", "==", userId)); // Thay đổi này
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         console.log(doc.data()); // Kiểm tra xem có dữ liệu trả về không
//         setPhotoURL(doc.data().photoURL);
//       });
//     } catch (error) {
//       console.error("Error fetching photo URL: ", error);
//     }
//   };

//   // Xử lý sự kiện khi người dùng thay đổi nội dung tin nhắn
//   const handleMessageChange = (text) => {
//     setMessage(text);
//     // Hiển thị icon gửi tin nhắn khi có nội dung trong tin nhắn
//     setShowSendIcon(text.trim().length > 0);
//   };

//   // Gửi tin nhắn
//   const sendMessage = () => {
//     if (message.trim() !== '') {
//       // Thêm tin nhắn mới vào mảng
//       //setMessages([...messages, { content: message, sender: displayName }]);
//       const currentTime = Date.now(); // Lấy thời gian hiện tại
//       setMessages([...messages, { content: message, time: currentTime }]);
//       setMessage('');
//       setShowSendIcon(false); 
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//            <Icon name="arrow-back" size={25} color="white" />
//         </TouchableOpacity>

//         <View style={styles.userInfo}>
//             <Text style={styles.userName}>{name}</Text>
//         </View>

//         <View style={styles.iconContainer}>
//            <TouchableOpacity>
//              <Icon name="call" size={25} color="white" style={styles.icon} />
//            </TouchableOpacity>
//            <TouchableOpacity>
//              <Icon name="videocam" size={25} color="white" style={styles.icon} />
//            </TouchableOpacity>
//            <TouchableOpacity>
//              <Icon name="apps" size={25} color="white" style={styles.icon} />
//            </TouchableOpacity>
//         </View>
//       </View>  
      
//       {/* body */}
//       <View style={styles.body}>
//         <View style={styles.chatbody}>
//           {/* <Pressable style={styles.userContainer}>
//             {photoURL ? (
//             <Image source={{ uri: photoURL }} style={styles.imgdaidien} />
//             ) : (
//                 <Text>No avatar</Text>
//             )}
//             <View style={styles.userInfo}>
//                 <Text style={styles.userMessage}>{name}</Text>
//             </View>
//           </Pressable> */}


//         </View>

//         <FlatList
//           data={messages} 
//           renderItem={({ item }) => (
//             <View style={styles.messageContainer}>
//               {/* <Text>{item.sender}: {item.content}</Text> */}
//               <Text style={styles.texttn}>{item.content}</Text>
//               <Text style={styles.timeText}>{new Date(item.time).toLocaleTimeString()}</Text>
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
//           //inverted // Hiển thị tin nhắn từ dưới lên
//         />
//       </View>

//       {/* footer */}
//       {/* <View style={styles.footer}>
//         <View style={styles.chatfooter}>
//             <Icon name="image" size={25} color="white" style={styles.icon} />
//             <TextInput style={styles.textTK} placeholder="Tin nhắn"></TextInput>
//             <Icon name="ellipsis-horizontal-outline" size={25} color="white" style={styles.icon} />
//             <Icon name="mic-outline" size={25} color="white" style={styles.icon} />
//             <Icon name="image" size={25} color="white" style={styles.icon} />
//         </View>
//       </View> */}

//       {/* footer */}
//       <View style={styles.footer}>
//         <View style={styles.chatfooter}>
//           <Icon name="image" size={25} color="white" style={styles.icon} />
//           <TextInput
//             style={styles.textTK}
//             placeholder="Tin nhắn"
//             value={message}
//             onChangeText={handleMessageChange}
//           />
//           {showSendIcon ? (
//             <TouchableOpacity onPress={sendMessage}>
//               <Icon name="send" size={25} color="white" style={styles.iconSend} />
//             </TouchableOpacity>
//           ) : (
//             <>
//               <Icon name="ellipsis-horizontal-outline" size={25} color="white" style={styles.icon} />
//               <Icon name="mic-outline" size={25} color="white" style={styles.icon} />
//               <Icon name="image" size={25} color="white" style={styles.icon} />
//             </>
//           )}
//         </View>
//       </View>

//     </View>
//   )
// }
// const styles = StyleSheet.create({
//     container: {
//     flex: 1,
//     marginTop: 35,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#66E86B",
//     //backgroundColor: "#4876FF",
//     paddingVertical: 20,
//   },
//   iconContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 5,
//   },
//   userInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   icon: {
//     marginLeft: 10,
//   },
//   iconSend: {
//     marginLeft: 85,
//   },
//   messageContainer: {
//     backgroundColor: '#E0E0E0',
//     borderRadius: 15,
//     maxWidth: '50%',
//     alignSelf: 'flex-end',
//     marginBottom: 10,
//     padding: 10,
//     marginRight: 10,
//   },
//   texttn: {
//     fontSize: 15,
//   },
//   timeText: {
//     fontSize: 10,
//     color: 'gray',
//   },
//   //body
//   body: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   userContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   imgdaidien: {
//     width: 40,
//     height: 40,
//     borderRadius: 40,
//   },
//   userMessage: {
//     fontSize: 15,
//     color: 'gray',
//     marginTop: 5,
//   },
//   //footer
//   footer: {
//     justifyContent: 'center',
//     backgroundColor: "#66E86B",
//     height: 50,
//     width: "100%",
//   },
//   textTK: {
//     marginLeft: 5,
//     fontSize: 18,
//     width: 250,
//   },
//   chatfooter: {
//     flexDirection: 'row',
//   },
// })

// export default DoanChat;


////////////////////////////////////

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs, doc, addDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const DoanChat = ({ route }) => {
  const navigation = useNavigation();
  const { name } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;
  const flatListRef = useRef(null); // Thêm một biến tham chiếu cho FlatList

  const [showSendIcon, setShowSendIcon] = useState(false); // Biến trạng thái để kiểm soát việc hiển thị icon gửi tin nhắn
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'tinnhan'),
        where('users', 'array-contains', currentUser.uid),
        orderBy('timestamp', 'asc')
      ),
      (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const messageData = doc.data();
          data.push({
            id: doc.id,
            sender: messageData.sender,
            content: messageData.content,
            timestamp: messageData.timestamp
          });
        });
        setMessages(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const chatRef = collection(db, 'tinnhan');
        await addDoc(chatRef, {
          users: [currentUser.uid, name], // Thay "name" bằng ID của người dùng nhận tin nhắn
          content: message,
          sender: currentUser.displayName,
          timestamp: Date.now()
        });
        const currentTime = Date.now(); // Lấy thời gian hiện tại
        setMessages([...messages, { content: message, time: currentTime }]);
        setMessage('');
        setShowSendIcon(false); 

        // Cuộn xuống dòng cuối cùng sau khi tin nhắn được gửi
        flatListRef.current.scrollToEnd({ animated: true });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Xử lý sự kiện khi người dùng thay đổi nội dung tin nhắn
  const handleMessageChange = (text) => {
    setMessage(text);
    // Hiển thị icon gửi tin nhắn khi có nội dung trong tin nhắn
    setShowSendIcon(text.trim().length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Icon name="call" size={25} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="videocam" size={25} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="apps" size={25} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView style={styles.body} behavior="padding" enabled>
        <FlatList
          ref={flatListRef} // Đặt tham chiếu cho FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.sender === currentUser.displayName ]}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.messageContent}>{item.content}</Text>
              <Text style={styles.timeText}>{new Date(item.time).toLocaleTimeString()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </SafeAreaView>
      {/* <View style={styles.footer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={25} color="white" />
        </Pressable>
      </View> */}
      
      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.chatfooter}>
          <Icon name="image" size={25} color="white" style={styles.icon} />
          <TextInput
            style={styles.textTK}
            placeholder="Tin nhắn"
            value={message}
            onChangeText={handleMessageChange}
            //placeholderTextColor="#666"
          />
          {showSendIcon ? (
            <Pressable onPress={handleSendMessage}>
              <Icon name="send" size={25} color="blue" style={styles.iconSend} />
            </Pressable>
          ) : (
            <>
              <Icon name="ellipsis-horizontal-outline" size={25} color="white" style={styles.icon} />
              <Icon name="mic-outline" size={25} color="white" style={styles.icon} />
              <Icon name="image" size={25} color="white" style={styles.icon} />
            </>
          )}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66E86B',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  userName: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  iconContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 10,
  },
  messageContainer: {
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "50%",
    alignSelf: 'flex-end',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContent: {
    fontSize: 15,
  },
  body: {
    flex: 1,
  },
  // footer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#66E86B',
  //   padding: 10,
  // },
  // input: {
  //   flex: 1,
  //   backgroundColor: 'white',
  //   borderRadius: 25,
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   marginRight: 10,
  // },
  // sendButton: {
  //   backgroundColor: '#4876FF',
  //   borderRadius: 25,
  //   padding: 10,
  // },
  timeText: {
    fontSize: 10,
    color: 'gray',
  },
    //footer
  footer: {
    justifyContent: 'center',
    backgroundColor: "#66E86B",
    height: 50,
    width: "100%",
  },
  textTK: {
    marginLeft: 10,
    fontSize: 18,
    width: 250,
  },
  chatfooter: {
    flexDirection: 'row',
  },
  iconSend: {
    marginLeft: 85,
  },
});

export default DoanChat;





