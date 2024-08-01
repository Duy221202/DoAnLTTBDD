import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable } from "react-native";
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion,deleteDoc, arrayRemove, onSnapshot, collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
const GroupChat = () => {
  const route = useRoute();
  const { groupId } = route.params; // Lấy groupId từ route params
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  //const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [confirmDissolve, setConfirmDissolve] = useState(false);
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [userNames, setUserNames] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [actionMessage, setActionMessage] = useState(""); 
  const [selectedImages, setSelectedImages] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        if (!groupId) return;

        const db = getFirestore();
        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);
        if (groupDoc.exists()) {
          //setGroupName(groupDoc.data().groupName);
          setName(groupDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching group's name:", error);
      }
    };

    fetchGroupName();
  }, [groupId]);

  useEffect(() => {
    const fetchUserId = () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userId || !groupId) return;

        const db = getFirestore();
        const groupMessagesRef = doc(db, "groupChats", groupId);
        const groupMessagesDoc = await getDoc(groupMessagesRef);

        const groupMessages = groupMessagesDoc.exists() ? groupMessagesDoc.data().messages || [] : [];

        groupMessages.sort((a, b) => new Date(a.time) - new Date(b.time));

        setMessages(groupMessages);

        const uniqueSenders = Array.from(new Set(groupMessages.map(msg => msg.sender)));
        const senderNames = {};
        for (const senderId of uniqueSenders) {
          if (!userNames[senderId]) {
            const name = await fetchUserName(senderId);
            senderNames[senderId] = name;
          }
        }
        setUserNames(prevNames => ({ ...prevNames, ...senderNames }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const db = getFirestore();
    const messagesRef = doc(db, "groupChats", groupId);
    const unsubscribe = onSnapshot(messagesRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [userId, groupId]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        if (!groupId) return;

        const db = getFirestore();
        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);
        if (groupDoc.exists()) {
          setGroupMembers(groupDoc.data().members || []);
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  useEffect(() => {
    if (actionMessage) {
      const newMessage = {
        text: actionMessage,
        sender: "system",
        groupId: groupId,
        time: new Date().toLocaleTimeString(),
      };

      const saveActionMessage = async () => {
        try {
          const db = getFirestore();
          const messagesRef = doc(db, "groupChats", groupId);
          const messagesDoc = await getDoc(messagesRef);
          if (messagesDoc.exists()) {
            await updateDoc(messagesRef, {
              messages: arrayUnion(newMessage)
            });
          } else {
            await setDoc(messagesRef, { messages: [newMessage] });
          }
        } catch (error) {
          console.error("Error saving action message:", error);
        }
      };

      saveActionMessage();
    }
  }, [actionMessage, groupId]);

  const sendMessage = async () => {
    try {
      if ((!messageInput.trim() && (!file || file.length === 0)) || !userId || !groupId)
        return;
  
      let fileUrls = [];
      if (file && file.length > 0) {
        fileUrls = await Promise.all(
          file.map(async (file) => {
            const fileType = file.type.split("/")[0];
            let url = "";
            if (fileType === "image" || fileType === "video") {
              url = await pickImage(file);
              //url = await uploadFileToFirebaseStorage(file);
            } else if (
              fileType === "application" ||
              fileType === "text" ||
              fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              url = await pickDocument(file);
              // url = await uploadFileToFirebaseStorage(file);
            }
            return { url, fileType, fileName: file.name };
          })
        );
      }
  
      const newMessage = {
        text: messageInput,
        sender: userId,
        groupId: groupId,
        time: new Date().toLocaleTimeString(),
        fileUrl: fileUrls.length > 0 ? fileUrls.map(file => file.url) : [], // Thêm điều kiện kiểm tra trước khi sử dụng map
        fileType: fileUrls.length > 0 ? fileUrls.map(file => file.fileType) : [], // Thêm điều kiện kiểm tra trước khi sử dụng map
      };
  
      const db = getFirestore();
      const messagesRef = doc(db, "groupChats", groupId);
      const messagesDoc = await getDoc(messagesRef);
      if (messagesDoc.exists()) {
        await updateDoc(messagesRef, {
          messages: arrayUnion(newMessage)
        });
      } else {
        await setDoc(messagesRef, { messages: [newMessage] });
      }
  
      setMessages(prevMessages => [...prevMessages, newMessage]);
  
      setMessageInput("");
      setFile(null);
      setFileType("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleDissolveGroup = async () => {
    try {
      if (!groupId) return;

      const groupRef = doc(db, "groups", groupId);
      await deleteDoc(groupRef);

      const messagesRef = doc(db, "groupChats", groupId);
      await deleteDoc(messagesRef);

      navigation.goBack();
    } catch (error) {
      console.error("Error dissolving group:", error);
    }
  };


  const uploadFileAsync = async (file) => async (file, uid, contentType) => {
  //const uploadFileToFirebaseStorage = async (file, uid, contentType) => {
    const response = await fetch(file);
    const blob = await response.blob();
  
    const extension = file.split('.').pop(); // Lấy phần mở rộng của file
    let storagePath;
    if (contentType.startsWith('image')) {
      storagePath = `groupChatFiles/${uid}/${new Date().getTime()}.${extension}`;
    } else if (contentType.startsWith('video')) {
      storagePath = `groupChatFiles/${uid}/${new Date().getTime()}.${extension}`;
    } else if (contentType.startsWith('application')) {
      storagePath = `groupChatFiles/${uid}/${new Date().getTime()}.${extension}`;
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
        //onSend([{
        sendMessage([{
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: {
            _id: auth?.currentUser?.uid,
            //avatar: userData?.photoURL || 'default_avatar_url',
          },
          text: text,
          [media]: result.assets[0].uri // Sử dụng [media] để chọn key là 'image' hoặc 'video' tùy thuộc vào loại nội dung
        }]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    console.log(result);
  
    if (!result.cancelled) {
      const uri = result.assets[0].uri;
      console.log(uri);
      const nameFile = result.assets[0].name;
      console.log(nameFile);
      const fileName = uri.split('/').pop(); // Lấy tên tệp từ đường dẫn URI
      const message = nameFile; //'[Tài liệu]'
      const extension = getFileExtension(fileName); // Lấy phần mở rộng của tên tệp
      if (!isImageFile(extension) && !isVideoFile(extension)) { // Kiểm tra xem tệp có phải là hình ảnh hoặc video không
        const type = getFileType(extension); // Lấy kiểu tệp dựa trên phần mở rộng của tên tệp
        //onSend([
        sendMessage([
          {
            _id: Math.random().toString(),
            createdAt: new Date(),
            user: {
              _id: auth.currentUser?.uid,
              //avatar: userData?.photoURL || 'default_avatar_url',
            },
            text: message,
            document: { uri, fileName, type } // Đính kèm thông tin về tài liệu
          }
        ]);
      } else {
        console.log("Selected file is an image or video. Please select a document.");
      }
    } else {
      console.log("No document selected");
    }
  };
  
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

  const fetchUserName = async (uid) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data().name;
      } else {
        return " ";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return " ";
    }
  };

  const searchFriends = async (keyword) => {
    try {
      if (keyword.trim() === "") {
        setSearchResults([]);
        return;
      }

      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", ">=", keyword.trim()), where("name", "<=", keyword.trim() + "\uf8ff"));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        results.push({
          id: doc.id,
          name: userData.name,
        });
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching friends:", error);
    }
  };

  const handleSearchInputChange = (keyword) => {
    setSearchKeyword(keyword);
    searchFriends(keyword);
  };

  const handleFriendSelect = async (friend) => {
    try {
      console.log("Selected friend:", friend);
      const db = getFirestore();
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();

      if (!groupData.members.includes(friend.id)) {
        await updateDoc(groupRef, {
          members: arrayUnion(friend.id)
        });
        setAddedFriends(prevFriends => [...prevFriends, friend.id]);
        setActionMessage(`${friend.name} đã được thêm vào nhóm`);
        console.log("Added friend to group successfully!");

        await updateDoc(doc(db, "groupChats", groupId), {
          messages: arrayUnion({
            text: `${friend.name} đã được thêm vào nhóm`,
            sender: "system",
            groupId: groupId,
            time: new Date().toLocaleTimeString(),
          })
        });
      } else {
        await updateDoc(groupRef, {
          members: arrayRemove(friend.id)
        });
        setAddedFriends(prevFriends => prevFriends.filter(id => id !== friend.id));
        setActionMessage(`${friend.name} đã bị xóa khỏi nhóm`);
        console.log("Removed friend from group successfully!");

        await updateDoc(doc(db, "groupChats", groupId), {
          messages: arrayUnion({
            text: `${friend.name} đã bị xóa khỏi nhóm`,
            sender: "system",
            groupId: groupId,
            time: new Date().toLocaleTimeString(),
          })
        });
      }
    } catch (error) {
      console.error("Error updating group members:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text>Chat với {groupName}</Text> */}
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="white" />
        </Pressable>
        <Text style={styles.grname}>{name}</Text>
        <Pressable onPress={() => setConfirmDissolve(true)}>
        <Icon1 name="users-slash" size={25} color="#f00" />
        </Pressable>
        {confirmDissolve && (
        <View style={styles.confirmContainer}>
          <Text>Are you sure you want to dissolve the group?</Text>
          <Button title="Yes" onPress={handleDissolveGroup} />
          <Button title="No" onPress={() => setConfirmDissolve(false)} />
        </View>
      )}
        <TextInput 
          placeholder="Thêm/Xóa..." 
          value={searchKeyword} 
          onChangeText={handleSearchInputChange} 
          style={styles.searchInput}
        />
      </View>
      <View style={styles.searchResults}>
        {searchResults.length > 0 && (
          <FlatList
          style={{height:"300px"}}
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleFriendSelect(item)}>
                <Text>{item.name}</Text>
                {groupMembers.includes(item.id) ? (
                  <Button title="Xóa" onPress={() => handleFriendSelect(item)} />
                ) : (
                  <Button title="Thêm" onPress={() => handleFriendSelect(item)} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
      <ScrollView>

      <View style={styles.messages}>
        {messages.map((msg, index) => (
          <View key={index} style={msg.sender === userId ? styles.senderMessage : styles.receiverMessage}>
            <Text style={styles.messageSender}>{userNames[msg.sender]}</Text>
            <Text style={styles.messageText}>{msg.text}</Text>
            {msg.fileUrl && (
              <View style={msg.sender === userId ? styles.senderImageContainer : styles.receiverImageContainer}>
                {msg.fileType === "image" && <Image source={{ uri: msg.fileUrl }} style={styles.chatImage} />}
                {msg.fileType === "video" && (
                  <Video
                    source={{ uri: msg.fileUrl }}
                    style={styles.chatVideo}
                    controls={true}
                  />
                )}
              </View>
            )}
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
        <View ref={messagesEndRef} />
      </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <Icon1 name="photo-video" size={25} color="black" style={styles.icon} onPress={pickImage}/>
        <Icon1 name="file-alt" size={25} color="black" style={styles.icon} onPress={pickDocument} />
        <TextInput 
          style={styles.input} 
          placeholder="Nhập tin nhắn..." 
          value={messageInput} 
          onChangeText={(text) => setMessageInput(text)} 
        />
        <Pressable style={styles.nutgui} onPress={sendMessage} >
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Gửi</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  grname: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  searchResults: {
    marginTop: 10,
  },
  messages: {
    flex: 1,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: "80%",
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: "80%",
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 5,
    marginBottom: 5,
  },
  senderImageContainer: {
    alignSelf: "flex-end",
  },
  receiverImageContainer: {
    alignSelf: "flex-start",
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  chatVideo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  messageTime: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
  },
  nutgui: {
    marginRight: 10,
    backgroundColor: '#418df8',
    borderRadius: 10,
    height: 35,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //
  //
  customActionsContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default GroupChat;