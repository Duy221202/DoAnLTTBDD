import React, { useState, useEffect, useRef,useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { getFirestore, doc, getDoc,addDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, query, where,deleteDoc,getDocs  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage } from 'firebase/storage';
import { Video } from 'expo-av';
import { GiftedChat } from 'react-native-gifted-chat';

const GroupChat = () => {
  const route = useRoute();
  const { friends } = route.params;
  const [confirmDissolve, setConfirmDissolve] = useState(false);
  const { groupId } = route.params;
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [userId, setUserId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [pickedFile, setPickedFile] = useState(null);
  const [pickedFileType, setPickedFileType] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        if (!groupId) return;

        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);
        if (groupDoc.exists()) {
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

  const fetchUserName = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data().name || "Unknown";
      } else {
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  };

  const sendMessage = async () => {
    try {
      if ((!messageInput.trim() && !pickedFile) || !userId || !groupId) return;

      let fileUrl = "";
      if (pickedFile) {
        const contentType = pickedFileType.startsWith('image') ? 'image/jpeg' : 
                            pickedFileType.startsWith('video') ? 'video/mp4' : 'application/octet-stream';
        fileUrl = await uploadFileToFirebaseStorage(pickedFile, userId, contentType);
      }

      const newMessage = {
        text: messageInput,
        sender: userId,
        groupId: groupId,
        time: new Date().toLocaleTimeString(),
        fileUrl: fileUrl,
        fileType: pickedFileType,
      };

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
      setPickedFile(null);
      setPickedFileType("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
        const fileUri = result.assets[0].uri;
        const fileType = result.assets[0].type;
        setPickedFile(fileUri);
        setPickedFileType(fileType);
        setMessageInput(fileType.startsWith('video') ? '[Video]' : '[Image]');
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/*', 'text/plain'],
      });
      if (result.type === 'success') {
        const fileUri = result.uri;
        const mimeType = result.mimeType;
        setPickedFile(fileUri);
        setPickedFileType(mimeType);
        setMessageInput(result.name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFileToFirebaseStorage = async (fileUri, userId, contentType) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `uploads/${userId}/${Date.now()}`);
      const response = await fetch(fileUri);
      const blob = await response.blob();
      await uploadBytes(fileRef, blob, { contentType });
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      return '';
    }
  };

  const renderMessageItem = ({ item }) => {
    const senderName = userNames[item.sender] || "Unknown";

    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageSender}>{senderName}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        {item.fileUrl && item.fileType.startsWith('image') && (
          <Image source={{ uri: item.fileUrl }} style={styles.messageImage} />
        )}
        {item.fileUrl && item.fileType.startsWith('video') && (
          <Video
            source={{ uri: item.fileUrl }}
            style={styles.messageVideo}
            useNativeControls
            resizeMode="contain"
          />
        )}
        {item.fileUrl && item.fileType === 'text/plain' && (
          <Text style={styles.messageDocument}>{item.text}</Text>
        )}
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
  };

  const fetchGroupMembers = async () => {
    try {
      if (!groupId) return;

      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);
      if (groupDoc.exists()) {
        setGroupMembers(groupDoc.data().members || []);
      }
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

  const addMemberToGroup = async (newMemberId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(newMemberId)
      });
      setActionMessage(`${user.displayName} added a new member.`);
      fetchGroupMembers();
    } catch (error) {
      console.error("Error adding member to group:", error);
    }
  };

  const removeMemberFromGroup = async (memberId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(memberId)
      });
      setActionMessage(`${user.displayName} removed a member.`);
      fetchGroupMembers();
    } catch (error) {
      console.error("Error removing member from group:", error);
    }
  };

  const renderAddMemberButton = () => {
    return (
      <TouchableOpacity style={styles.addButton} onPress={() => addMemberToGroup(prompt("Enter member ID:"))}>
        <Icon1 name="user-plus" size={20} color="#ffffff" />
        <Text style={styles.addButtonText}>Add Member</Text>
      </TouchableOpacity>
    );
  };

  const renderRemoveMemberButton = (memberId) => {
    return (
      <TouchableOpacity style={styles.removeButton} onPress={() => removeMemberFromGroup(memberId)}>
        <Icon1 name="user-times" size={20} color="#ffffff" />
        <Text style={styles.removeButtonText}>Remove Member</Text>
      </TouchableOpacity>
    );
  };

  // const renderGroupMembers = () => {
  //   return groupMembers.map((memberId, index) => (
  //     <View key={index} style={styles.memberItem}>
  //       <Text style={styles.memberName}>{userNames[memberId] || "Unknown"}</Text>
  //       {userId === groupId && renderRemoveMemberButton(memberId)}
  //     </View>
  //   ));
  // };
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
  const searchFriends = async (keyword) => {
    try {
      if (keyword.trim() === "") {
        setSearchResults([]);
        return;
      }

      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("name", ">=", keyword.trim()),
        where("name", "<=", keyword.trim() + "\uf8ff")
      );
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
  const handleSearchInputChange = (e) => {
    setSearchKeyword(e);
    searchFriends(e);
  };
  const handleFriendSelect = async (friend) => {
    try {
      const db = getFirestore();
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();

      if (!groupData.members.includes(friend.id)) {
        await updateDoc(groupRef, {
          members: arrayUnion(friend.id),
        });
        setActionMessage(`${friend.name} đã được thêm vào nhóm`);
      } else {
        await updateDoc(groupRef, {
          members: arrayRemove(friend.id),
        });
        setActionMessage(`${friend.name} đã bị xóa khỏi nhóm`);
      }
    } catch (error) {
      console.error("Error updating group members:", error);
    }
  };
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toLowerCase();
  };
  const isImageFile = (extension) => {
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif';
  };
  
  // Hàm kiểm tra xem phần mở rộng của tên tệp có phải là video không
  const isVideoFile = (extension) => {
    return extension === 'mp4' || extension === 'mov' || extension === 'avi' || extension === 'mkv';
  };
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
  const onSend = useCallback(async (messages = []) => {
    const messageToSend = messages[0];
    if (!messageToSend) {
      return;
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
  
    const { _id, createdAt, text, user, image, video, document } = messageToSend;
    const chatRoomId = [auth.currentUser?.uid, friends?.UID].sort().join('_');
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
  }, [db, auth.currentUser?.uid, friends?.UID]);
  const pickDocument2 = async () => {
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
      console.log("Yolo")
      if (!isImageFile(extension) && !isVideoFile(extension)) { // Kiểm tra xem tệp có phải là hình ảnh hoặc video không
        const type = getFileType(extension); // Lấy kiểu tệp dựa trên phần mở rộng của tên tệp
        onSend([
          {
            _id: Math.random().toString(),
            createdAt: new Date(),
            user: {
              _id: auth.currentUser?.uid,
              avatar: userData?.photoURL || 'default_avatar_url',
            },
            text: message,
            document: { uri, fileName, type }, // Đính kèm thông tin về tài liệu
            
          }
        ]);
      } 
      else {
        console.log("Selected file is an image or video. Please select a document.");
      }
    } else {
      console.log("No document selected");
    }
    console.log("aaaaaaaaaaaaa");
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", backgroundColor:"aqua"}}>
      <Text style={{fontWeight:"bold"}}>{name}</Text>
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
        style={styles.input}
      />
      <View style={styles.searchResults}>
      {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(friend) => friend.id.toString()}
            renderItem={({ item: friend }) => (
              <View style={styles.friendItem}>
                <Text>{friend.name}</Text>
                <TouchableOpacity onPress={() => handleFriendSelect(friend)} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {groupMembers.includes(friend.id) ? 'Xóa' : 'Thêm'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        </View>
      {/* <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => handleFriendSelect(item)}>
              <Text>{groupMembers.includes(item.id) ? "Xóa" : "Thêm"}</Text>
            </TouchableOpacity>
          </View>
        )}
      /> */}
      
      </View>
      <ScrollView ref={messagesEndRef} onContentSizeChange={() => messagesEndRef.current.scrollToEnd({ animated: true })}>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
      {userId === groupId && renderAddMemberButton()}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity style={styles.fileButton} onPress={pickDocument2}>
          <Icon1 name="paperclip" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Icon name="image" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Button title="Send" onPress={sendMessage} />
      </View>
      {/* <View style={styles.membersList}>
        <Text style={styles.membersTitle}>Group Members</Text> */}
        {/* {renderGroupMembers()} */}
      {/* </View> */}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchResults: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  fileButton: {
    marginRight: 10,
  },
  imageButton: {
    marginRight: 10,
  },
  messageItem: {
    marginBottom: 10,
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageText: {
    marginVertical: 5,
  },
  messageImage: {
    width: 200,
    height: 200,
  },
  messageVideo: {
    width: 200,
    height: 200,
  },
  messageDocument: {
    fontStyle: "italic",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  removeButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  membersList: {
    marginTop: 20,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  memberName: {
    fontSize: 16,
  },
});

export default GroupChat;
