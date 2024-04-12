import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, Image,TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, addDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import { Video } from 'expo-av';
import { GiftedChat } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { deleteDoc, updateDoc } from 'firebase/firestore';

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

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const handleMessagePress = (messageId) => {
    // setSelectedMessageId(messageId);
    setSelectedMessageId(prevId => prevId === messageId ? null : messageId);
  };

  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  
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
          //console.log(messages)
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
  
      if (image) {
        imageContentType = 'image/jpeg'; // assuming image is always jpeg for simplicity
        imageDownloadURL = await uploadFileToFirebaseStorage(image, auth.currentUser?.uid, imageContentType);
      }
  
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
        image: imageDownloadURL,
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
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        console.log(result);
        const type = result.assets[0].type;
        const text = type.startsWith('video') ? '[Video]' : '[Hình ảnh]';
        const media = type.startsWith('video') ? 'video' : 'image';
        onSend([{
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: {
            _id: auth?.currentUser?.uid,
            avatar: userData?.photoURL || 'default_avatar_url',
          },
          text: text,
          [media]: result.assets[0].uri // Sử dụng [media] để chọn key là 'image' hoặc 'video' tùy thuộc vào loại nội dung
        }]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };
  
  // const pickDocument = async () => {
  //   const result = await DocumentPicker.getDocumentAsync();
  //   console.log(result);
  
  //   if (!result.cancelled) {
  //     const uri = result.assets[0].uri;
  //     console.log(uri);
  //     const nameFile = result.assets[0].name;
  //     console.log(nameFile);
  //     const fileName = uri.split('/').pop(); // Lấy tên tệp từ đường dẫn URI
  //     const message = nameFile; //'[Tài liệu]'
  //     const extension = getFileExtension(fileName); // Lấy phần mở rộng của tên tệp
  //     if (!isImageFile(extension) && !isVideoFile(extension)) { // Kiểm tra xem tệp có phải là hình ảnh hoặc video không
  //       const type = getFileType(extension); // Lấy kiểu tệp dựa trên phần mở rộng của tên tệp
  //       onSend([
  //         {
  //           _id: Math.random().toString(),
  //           createdAt: new Date(),
  //           user: {
  //             _id: auth.currentUser?.uid,
  //             avatar: userData?.photoURL || 'default_avatar_url',
  //           },
  //           text: message,
  //           document: { uri, fileName, type } // Đính kèm thông tin về tài liệu
  //         }
  //       ]);
  //     } else {
  //       console.log("Selected file is an image or video. Please select a document.");
  //     }
  //   } else {
  //     console.log("No document selected");
  //   }
  // };
  
  // Hàm để lấy phần mở rộng của tên tệp
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toLowerCase();
  };
  
  // Hàm kiểm tra xem phần mở rộng của tên tệp có phải là hình ảnh không
  const isImageFile = (extension) => {
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif';
  };
  
  // Hàm kiểm tra xem phần mở rộng của tên tệp có phải là video không
  const isVideoFile = (extension) => {
    return extension === 'mp4' || extension === 'mov' || extension === 'avi' || extension === 'mkv';
  };
  
  // Hàm để lấy kiểu tệp dựa trên phần mở rộng của tên tệp
  const getFileType = (extension) => {
    if (extension === 'pdf') {
      return 'application/pdf';
    } else if (extension === 'doc' || extension === 'docx') {
      return 'application/msword';
    } else if (extension === 'xls' || extension === 'xlsx') {
      return 'application/vnd.ms-excel';
    } else if (extension === 'ppt' || extension === 'pptx') {
      return 'application/vnd.ms-powerpoint';
    } else {
      return 'application/octet-stream'; // Kiểu mặc định nếu không xác định được
    }
  };
  
  const handleImagePress = (imageUri) => {
    navigation.navigate('PlayVideo', { uri: imageUri });
    console.log(imageUri);
  };

  
  const handleVideoPress = (videoUri) => {
    navigation.navigate('PlayVideo', { uri: videoUri });
    console.log(videoUri);
  };

  const handleDocumentPress =  (documentInfo) => {
    console.log(documentInfo)
  };
  
  const renderCustomActions = (props) => {
    return (
      <View style={styles.customActionsContainer}>
        {/* <Icon name="document-attach" size={25} color="black" style={styles.icon} onPress={pickImage} /> */}
        <Icon1 name="photo-video" size={25} color="black" style={styles.icon} onPress={pickImage} />
        {/* <Icon name="image" size={25} color="black" style={styles.icon} onPress={pickDocument} /> */}
    </View>
    );
  };

  // Nút thu hồi tin nhắn
  // const deleteMessage = async (messageId) => {
  //   try {
  //     if (!messageId) return;

  //     const db = getFirestore();
  //     const chatRoomId = [auth.currentUser?.uid, friendData?.UID].sort().join('_');
  //     const messagesRef = collection(db, "Chats", chatRoomId, 'chat_mess');
  //     const messagesDocRef =doc(messagesRef, messageId);
  //     await deleteDoc(messagesDocRef);

  //     setSelectedMessage(null);
  //   } catch (error) {
  //     console.error("Lỗi khi xóa tin nhắn:", error);
  //   }
  // };

  // Nút thu hồi tin nhắn CÁCH 2
  const recallMessage = async (messageId, userId) => {
    try {
      if (!messageId) return;
  
      const db = getFirestore();
      const chatRoomId = [auth.currentUser?.uid, friendData?.UID].sort().join('_');
      const messagesRef = collection(db, "Chats", chatRoomId, 'chat_mess');
  
      // Kiểm tra xem người gửi tin nhắn có phải là người dùng hiện tại hay không
      if (userId === auth.currentUser?.uid) {
        //Alert.alert("Tin nhắn đã được thu hồi")
        const messagesDocRef = doc(messagesRef, messageId);
        //await deleteDoc(messagesDocRef);

        await updateDoc(messagesDocRef, {
          text: "Đã thu hồi tin nhắn",
        });
      } else {
        Alert.alert("Không thể thu hồi tin nhắn của người khác")
      }
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn:", error);
    }
  };

  // Nút xóa tin nhắn chỉ mình tôi
  // const deleteMessage = async (messageId) => {
  //   try {
  //     if (!messageId) return;
  
  //     // Đảm bảo auth đã được import từ thư viện phù hợp và là một đối tượng có thể truy cập
  //     const user = auth?.currentUser;
  //     if (!user) {
  //       console.error("Người dùng không được xác định.");
  //       return;
  //     }
  
  //     const db = getFirestore();
  //     const chatRoomId = [user.uid, friendData?.UID].sort().join('_');
  //     const messagesRef = collection(db, "Chats", chatRoomId, 'chat_mess');
  
  //     // Cập nhật trường isDeleted của tin nhắn để đánh dấu nó đã bị xóa
  //     const messageDocRef = doc(messagesRef, messageId);
  //     await updateDoc(messageDocRef, {
  //       isDeleted: true // Đánh dấu tin nhắn đã bị xóa
  //     });
  
  //     console.log("Đã xóa tin nhắn");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa tin nhắn:", error);
  //   }
  // };

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
        onSend={messages => onSend(messages)}
        user={{
          _id: auth?.currentUser?.uid,
          avatar: userData?.photoURL || 'default_avatar_url',
        }}
        renderActions={renderCustomActions} 

        
        renderMessage={(props) => {
          const isCurrentUser = props.currentMessage.user && props.currentMessage.user._id === auth?.currentUser?.uid;
          const isFirstMessage = isCurrentUser || !props.previousMessage || (props.previousMessage.user && props.previousMessage.user._id !== props.currentMessage.user._id);
          return (
            <View style={{ flexDirection: 'column', marginBottom: 10 }}>
              <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, color: 'black' }}>
                {/* {props.currentMessage.createdAt.toLocaleDateString()} */}
                {`${props.currentMessage.createdAt.getDate()}/${props.currentMessage.createdAt.getMonth() + 1}/${props.currentMessage.createdAt.getFullYear()}`}  
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}>
                {!isCurrentUser && isFirstMessage && props.currentMessage.user && (
                  <View style={{ marginLeft: 10 }}>
                    <Image
                      source={{ uri: props.currentMessage.user.avatar }}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                  </View>
                )}
                <View style={{ flexDirection: 'column' }}>
                  {isFirstMessage && !isCurrentUser && props.currentMessage.user && (
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                      {friendData.name}
                    </Text>
                  )}
                  <View style={{ backgroundColor: isCurrentUser ? '#008DDA' : '#41C9E2', padding: 5, borderRadius: 10, maxWidth: 230, marginLeft: isFirstMessage ? 0 : 40, marginRight: isFirstMessage ? 10 : 0, marginTop: isFirstMessage ? 5 : 0 }}>
                    {props.currentMessage.document ? (
                      <TouchableWithoutFeedback onPress={() => handleDocumentPress(props.currentMessage.document)}>
                        <View>
                          <Ionicons name="document" size={24} color="black" />
                          <Text style={{ fontSize: 16, marginTop: 5 }}>{props.currentMessage.text}</Text>
                          <Text style={{ fontSize: 12, marginTop: 5, color: 'black' }}>{`${props.currentMessage.createdAt.getHours()}:${props.currentMessage.createdAt.getMinutes()}`}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ) : props.currentMessage.image ? (
                      <View>
                        <Pressable onPress={() => handleImagePress(props.currentMessage.image)}>             
                          <Image
                            source={{ uri: props.currentMessage.image }}
                            style={{ width: 150, height: 200 , borderRadius: 10}}
                            resizeMode="cover"
                          />    
                          <Text style={{ fontSize: 12, marginTop: 5, color: 'black' }}>{`${props.currentMessage.createdAt.getHours()}:${props.currentMessage.createdAt.getMinutes()}`}</Text>    
                        </Pressable>
                      </View>
                    ) : props.currentMessage.video ? (
                      <View>
                        <Pressable onPress={() => handleVideoPress(props.currentMessage.video)}>             
                          <Video
                            source={{ uri: props.currentMessage.video }}
                            style={{ width: 150, height: 200, borderRadius: 10 }}
                            resizeMode="cover"
                            useNativeControls
                            shouldPlay={false}
                          />     
                          <Text style={{ fontSize: 12, marginTop: 5, color: 'black' }}>{`${props.currentMessage.createdAt.getHours()}:${props.currentMessage.createdAt.getMinutes()}`}</Text>       
                        </Pressable>
                      </View>
                    ) : (
                      <>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                          <TouchableOpacity style={styles.optionsBtn} onPress={() => handleMessagePress(props.currentMessage._id)}>
                            <Text style={{ fontSize: 16, margin: 5 }}>{props.currentMessage.text}</Text>
                            <Text style={{ fontSize: 12, marginTop: 5, color: 'black', marginLeft: 5 }}>
                              {`${props.currentMessage.createdAt.getHours()}:${props.currentMessage.createdAt.getMinutes()}`}
                            </Text>
                          </TouchableOpacity>

                          {/* Nút thu hồi tin nhắn */}
                          {props.currentMessage._id === selectedMessageId && (
                            <TouchableOpacity onPress={() => recallMessage(props.currentMessage._id, props.currentMessage.user._id)} style={styles.optionItemTest}>
                              <Icon2 name="undo" style={styles.optionIcon} />
                              <Text>Thu hồi</Text>
                            </TouchableOpacity>
                          )}

                          {/* Nút xóa chỉ mình tôi */}
                          {/* {props.currentMessage.user._id === auth?.currentUser?.uid && (
                            <TouchableOpacity onPress={() => deleteMessage(props.currentMessage._id)}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon2 name="trash" style={styles.optionIcon} />
                                <Text>Xóa chỉ mình tôi</Text>
                              </View>
                            </TouchableOpacity>
                          )} */}

                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        }}
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
    backgroundColor: '#418df8',
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

  // action sheet
  optionsBtn: {
    flexDirection: 'column',
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  optionsMenu: {
    top: 10,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 5,
    elevation: 10,
  },
  optionItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  optionIcon: {
    fontSize: 15,
    paddingVertical: 5,
    color: "red",
  },
  optionItemTest: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'column',
  }
});

export default Chat_fr;