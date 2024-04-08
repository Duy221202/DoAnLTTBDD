import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
//import { Video } from 'expo-av';
import { GiftedChat } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
//import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
//import { MessageBox } from 'react-chat-elements'; // Import MessageBox

const Chat_fr = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { friendData } = route.params;
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const storage = getStorage();
  const [userData, setUserData] = useState(null);
  const [showIcons, setShowIcons] = useState(true); // Biến trạng thái để kiểm soát việc hiển thị icon gửi tin nhắn
  // const [message, setMessage] = useState('');
  // const [showSendIcon, setShowSendIcon] = useState(false); // Biến trạng thái để kiểm soát việc hiển thị icon gửi tin nhắn

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        if (userDocSnap.exists()) {
          console.log('User data:', userData.name);
          console.log('User friend', friendData.name);
          setUserData(userData);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [db, user.uid]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const chatRoomId = [userData?.UID, friendData?.UID].sort().join('_');
        const chatMessRef = collection(db, 'Chats', chatRoomId, 'chat_mess');
        const q = query(chatMessRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
          const messages = [];
          snapshot.forEach(doc => {
            messages.push({
              _id: doc.id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user,
              image: doc.data().image,
              video: doc.data().video,
              document: doc.data().document
            });
          });
          setMessages(messages);
          console.log(messages)
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    const unsubscribe = fetchChatMessages();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [db, userData?.UID, friendData?.UID]);

  const onSend = useCallback(async (messages = []) => {
    const messageToSend = messages[0];
    if (!messageToSend) {
      return;
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
  
    const { _id, createdAt, text, user, image, video, document } = messageToSend;
    const chatRoomId = [auth.currentUser?.uid, friendData?.UID].sort().join('_');
    const chatMessRef = collection(db, 'Chats', chatRoomId, 'chat_mess');
  
    try {
      let imageDownloadURL = null;
      let videoDownloadURL = null;
      let documentDownloadURL = null;
      let imageContentType = null;
      let videoContentType = null;
      let documentContentType = null;
  
      // Xử lý gửi tin nhắn ảnh
    if (image) {
      let imageDownloadURL = null;
      let imageContentType = null;
      imageContentType = 'image/jpeg'; // assuming image is always jpeg for simplicity
      imageDownloadURL = await uploadFileToFirebaseStorage(image, auth.currentUser?.uid, imageContentType);
      // Thêm thông tin ảnh vào tin nhắn trước khi gửi
      messageToSend.image = imageDownloadURL;
    }

      // if (image) {
      //   imageContentType = 'image/jpeg'; // assuming image is always jpeg for simplicity
      //   imageDownloadURL = await uploadFileToFirebaseStorage(image, auth.currentUser?.uid, imageContentType);
      // }
  
      if (video) {
        videoContentType = 'video/mp4'; // assuming video is always mp4 for simplicity
        videoDownloadURL = await uploadFileToFirebaseStorage(video, auth.currentUser?.uid, videoContentType);
      }
  
      if (document) {
        documentContentType = getFileType(document.fileName); // assuming you have a function getFileType to determine content type
        documentDownloadURL = await uploadFileToFirebaseStorage(document.uri, auth.currentUser?.uid, documentContentType);
      }
  
      addDoc(chatMessRef, {
        _id,
        createdAt,
        text: text || '',
        user,
        image: imageDownloadURL || null, // Ensure to include image even if it's not an image message
        //image: imageDownloadURL,
        video: videoDownloadURL,
        document: documentDownloadURL,
        imageContentType,
        videoContentType,
        documentContentType
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [db, auth.currentUser?.uid, friendData?.UID]);
  
  

  const uploadFileToFirebaseStorage = async (file, uid, contentType) => {
    const response = await fetch(file);
    const blob = await response.blob();
  
    const extension = file.split('.').pop(); // Lấy phần mở rộng của file
    let storagePath;
    if (contentType.startsWith('image')) {
      storagePath = `images/${uid}/${new Date().getTime()}.${extension}`;
    } else if (contentType.startsWith('video')) {
      storagePath = `videos/${uid}/${new Date().getTime()}.${extension}`;
    } else if (contentType.startsWith('application')) {
      storagePath = `documents/${uid}/${new Date().getTime()}.${extension}`;
    } else {
      throw new Error('Unsupported content type');
    }
  
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);
    console.log("Upload complete");
  
    const downloadURL = await getDownloadURL(storageRef);
  
    return downloadURL;
  };

  const renderCustomActions = (props) => {
    // Render các actions tùy chỉnh ở đây
    // Bạn có thể thêm các actions khác nếu cần
    return (
      <View style={styles.customActionsContainer}>
        <Icon name="document-attach" size={25} color="black" style={styles.icon} onPress={() => handleAttachDocument()} />
        <Icon name="image" size={25} color="black" style={styles.icon} onPress={() => handlePickImage()} />
        <Icon1 name="photo-video" size={25} color="black" style={styles.icon} onPress={() => handlePickVideo()} />
    </View>
    );
  };

  const renderMessageImage = ({ currentMessage }) => {
    if (currentMessage.image) {
      return (
        <Image
          source={{ uri: currentMessage.image }}
          style={styles.messageImage}
        />
      );
    }
    return null;
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Quyền truy cập thư viện ảnh bị từ chối!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const image = result.uri;
        const message = [{
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: {
            _id: auth.currentUser?.uid,
            avatar: userData?.photoURL || 'default_avatar_url',
          },
          image: image,
        }];
        onSend(message);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };
  
  const handleAttachDocument = async () => {
    // Xử lý việc chọn file document ở đây
    // Sử dụng thư viện Expo DocumentPicker hoặc các phương thức khác để chọn file document
  };
  
  const handlePickVideo = async () => {
    // Xử lý việc chọn video ở đây
    // Sử dụng thư viện Expo ImagePicker hoặc các phương thức khác để chọn video
  };
  
  return (
  <View style={styles.container}>
    <SafeAreaView>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="white" />
        </Pressable>
        <Text style={styles.userName}>{friendData.name}</Text>
        <View style={styles.iconContainer}>
          <Pressable>
            <Icon name="call" size={22} color="white" style={styles.icon} />
          </Pressable>
          <Pressable>
            <Icon name="videocam" size={22} color="white" style={styles.icon} />
          </Pressable>
          <Pressable>
            <Icon name="apps" size={22} color="white" style={styles.icon} />
          </Pressable>
        </View>
      </View>

      <GiftedChat 
        messages={messages}
        placeholder="Tin nhắn"
        //showAvatarForEveryMessage={false} // Không hiển thị avatar cho mỗi tin nhắn trong cuộc trò chuyện.
        //showUserAvatar={false} // Không hiển thị avatar của người dùng hiện tại (user) trong cuộc trò chuyện.
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: auth?.currentUser?.uid,
          avatar: userData?.photoURL || 'default_avatar_url',
        }}
        renderActions={renderCustomActions} // Thêm prop renderActions vào đây
        //renderMessageImage={renderMessageImage} // Thêm prop renderMessageImage vào đây
      />

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006AF5',
    padding: 9,
    height: 48,
    width: '100%',
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
    paddingHorizontal: 5,
  },
  icon: {
    marginLeft: 10,
  },
  customActionsContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Các kiểu khác...
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default Chat_fr; 

