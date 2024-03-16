import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../../../config/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const DoanChat = () => {
  const navigation = useNavigation();
  const firestore = getFirestore();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchPhotoURL(user.uid);
      } else {
        setDisplayName('');
        setPhotoURL(null);
      }
    });

    return unsubscribe;
  }, []);

  // Method hiện thị ảnh cá nhân
  const fetchPhotoURL = async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setPhotoURL(userData.photoURL);
      }
    } catch (error) {
      console.error("Error fetching photo URL: ", error);
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
            <Text style={styles.userName}>{displayName}</Text>
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
          <Pressable style={styles.userContainer}>
            {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.imgdaidien} />
            ) : (
                <Text>No avatar</Text>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userMessage}>{displayName}</Text>
            </View>
          </Pressable>


        </View>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.chatfooter}>
            <Icon name="image" size={25} color="white" style={styles.icon} />
            <TextInput style={styles.textTK} placeholder="Tin nhắn"></TextInput>
            <Icon name="ellipsis-horizontal-outline" size={25} color="white" style={styles.icon} />
            <Icon name="mic-outline" size={25} color="white" style={styles.icon} />
            <Icon name="image" size={25} color="white" style={styles.icon} />
            
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
    backgroundColor: "#66E86B",
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
    backgroundColor: "#66E86B",
    height: 50,
    width: "100%",
  },
  textTK: {
    marginLeft: 5,
    fontSize: 18,
    width: 250,
  },
  chatfooter: {
    flexDirection: 'row',
  },
})

export default DoanChat;