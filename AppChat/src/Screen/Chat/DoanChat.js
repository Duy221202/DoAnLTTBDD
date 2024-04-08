import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../../../config/firebase";
//import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, equal } from "firebase/firestore";
import { useRoute } from '@react-navigation/native';

const DoanChat = () => {
  const navigation = useNavigation();
  const firestore = getFirestore();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  
  const route = useRoute();
  const name = route.params.name; // Lấy userId được truyền từ trang trước
  //const photoURL = route.params.photoURL;
  
  const [message, setMessage] = useState('');
  const [showSendIcon, setShowSendIcon] = useState(false); // Biến trạng thái để kiểm soát việc hiển thị icon gửi tin nhắn
  const [messages, setMessages] = useState([]); // Mảng để lưu trữ các tin nhắn

  useEffect(() => {
    //fetchUserData(name); // Gọi hàm fetchUserData khi component được render
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchPhotoURL(user.uid);
        //fetchPhotoURLByName(name); // Thay đổi này
      } else {
        setDisplayName('');
        setPhotoURL(null);
      }
    });

    return unsubscribe;
  }, []);

  //Method hiện thị ảnh cá nhân
  const fetchPhotoURL = async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setPhotoURL(userData.photoURL);
      }
    } catch (error) {
      console.error("Lỗi Error fetching photo URL: ", error);
    }
  };

  // //Method lấy ảnh cá nhân dựa trên tên người dùng
  // const fetchPhotoURLByName = async (userId) => {
  //   try {
  //     const q = query(collection(firestore, 'users'), where("displayName", "==", userId)); // Thay đổi này
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.data()); // Kiểm tra xem có dữ liệu trả về không
  //       setPhotoURL(doc.data().photoURL);
  //     });
  //   } catch (error) {
  //     console.error("Error fetching photo URL: ", error);
  //   }
  // };

  // Xử lý sự kiện khi người dùng thay đổi nội dung tin nhắn
  const handleMessageChange = (text) => {
    setMessage(text);
    // Hiển thị icon gửi tin nhắn khi có nội dung trong tin nhắn
    setShowSendIcon(text.trim().length > 0);
  };

  // Gửi tin nhắn
  const sendMessage = () => {
    if (message.trim() !== '') {
      // Thêm tin nhắn mới vào mảng
      //setMessages([...messages, { content: message, sender: displayName }]);
      const currentTime = Date.now(); // Lấy thời gian hiện tại
      setMessages([...messages, { content: message, time: currentTime }]);
      setMessage('');
      setShowSendIcon(false); 
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
        </View>

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
      
      {/* body */}
      <View style={styles.body}>
        <View style={styles.chatbody}>
          {/* <Pressable style={styles.userContainer}>
            {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.imgdaidien} />
            ) : (
                <Text>No avatar</Text>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userMessage}>{name}</Text>
            </View>
          </Pressable> */}


        </View>

        <FlatList
          data={messages} 
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              {/* <Text>{item.sender}: {item.content}</Text> */}
              <Text style={styles.texttn}>{item.content}</Text>
              <Text style={styles.timeText}>{new Date(item.time).toLocaleTimeString()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
          //inverted // Hiển thị tin nhắn từ dưới lên
        />
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.chatfooter}>
          {/* <Icon name="image" size={25} color="white" style={styles.icon} /> */}
          <TextInput
            style={styles.textTK}
            placeholder="Tin nhắn"
            value={message}
            onChangeText={handleMessageChange}
          />
          {showSendIcon ? (
            <TouchableOpacity onPress={sendMessage}>
              <Icon name="send" size={25} color="white" style={styles.iconSend} />
            </TouchableOpacity>
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
  )
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    marginTop: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#418df8",
    //backgroundColor: "#4876FF",
    paddingVertical: 20,
  },
  iconContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  icon: {
    marginLeft: 10,
  },
  iconSend: {
    marginLeft: 85,
  },
  messageContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    maxWidth: '50%',
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 10,
    marginRight: 10,
  },
  texttn: {
    fontSize: 15,
  },
  timeText: {
    fontSize: 10,
    color: 'gray',
  },
  //body
  body: {
    flex: 1,
    backgroundColor: "white",
  },
  userContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  imgdaidien: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  userMessage: {
    fontSize: 15,
    color: 'gray',
    marginTop: 5,
  },
  //footer
  footer: {
    justifyContent: 'center',
    backgroundColor: "#418df8",
    height: 50,
    width: "100%",
  },
  textTK: {
    marginLeft: 5,
    fontSize: 18,
    width: 290,
  },
  chatfooter: {
    flexDirection: 'row',
  },
})

export default DoanChat;
