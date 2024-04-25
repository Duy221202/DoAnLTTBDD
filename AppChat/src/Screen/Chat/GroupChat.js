import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL ,storage} from "firebase/storage";

const GroupChat = ({ groupId }) => {
  const [groupName, setGroupName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
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
          setGroupName(groupDoc.data().groupName);
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
      if ((!messageInput.trim() && !file) || !userId || !groupId) return;

      let fileUrl = "";
      if (file) {
        if (fileType === "image" || fileType === "video") {
          fileUrl = await uploadImageAsync(file);
        } else {
          fileUrl = await uploadFileAsync(file);
        }
      }

      const newMessage = {
        text: messageInput,
        sender: userId,
        groupId: groupId,
        time: new Date().toLocaleTimeString(),
        fileUrl: fileUrl,
        fileType: fileType,
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

  const uploadFileAsync = async (file) => async (file, uid, contentType) => {
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

  const uploadImageAsync = async () => {
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
        multiple: true
      });
  
      if (!result.cancelled) {
        const selectedImages = result.assets.filter(image => !selectedImages.includes(image));
        setSelectedImages(prevImages => [...prevImages, ...selectedImages]); // Thêm các ảnh được chọn vào trạng thái selectedImages
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0];
      setFile(selectedFile);
      setFileType(fileType);
    }
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
        <Text>Chat với {groupName}</Text>
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
        <TextInput 
          style={styles.input} 
          placeholder="Nhập tin nhắn..." 
          value={messageInput} 
          onChangeText={(text) => setMessageInput(text)} 
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  searchResults: {
    flex: 1,
    padding: 10,
    height:300,
  },
  messages: {
    flex: 15,
    padding: 10,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d3d3d3',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: 5,
  },
  senderImageContainer: {
    alignSelf: 'flex-end',
    marginVertical: 5,
  },
  receiverImageContainer: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  chatImage: {
    width: 200,
    height: 200,
  },
  chatVideo: {
    width: 200,
    height: 200,
  },
  messageTime: {
    alignSelf: 'flex-end',
    marginTop: 5,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
};

export default GroupChat;
