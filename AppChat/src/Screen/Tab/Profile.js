import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function Profile() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
 
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

  // Cập nhật ảnh đại diện
  const handleUpdatePhoto = async () => {
    try {
      // Chọn ảnh mới từ thư viện ảnh trên thiết bị
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
         console.log(result);
      if (!result.cancelled) {
        // Nếu người dùng chọn ảnh, tiến hành cập nhật
        const Ure = result.assets[0].uri
        console.log("URI before fetch:", Ure);
        // Xóa ảnh hiện tại trên Firebase Storage và cập nhật URL ảnh mới
        await deletePreviousPhoto(auth.currentUser.uid);
        
        // Tải ảnh mới lên Firebase Storage và cập nhật URL ảnh mới
        const newPhotoURL = await uploadImageAsync(Ure, auth.currentUser.uid);
        
        if (newPhotoURL) {
          // Cập nhật URL ảnh mới vào Firestore chỉ khi có giá trị hợp lệ
          await updatePhotoURL(newPhotoURL, auth.currentUser.uid);
          
          // Cập nhật trạng thái hiển thị của ảnh trên ứng dụng
          setPhotoURL(newPhotoURL);
        } else {
          // Xử lý khi không có URL ảnh mới
          console.error("No valid URL for the new photo.");
        }
      }
    } catch (error) {
      console.error("Error updating photo: ", error);
    }
  };
  
  // xóa ảnh đã setup trước đó
  const deletePreviousPhoto = async (userId) => {
    try {
      // Lấy URL ảnh hiện tại từ Firestore
      const userRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const currentPhotoURL = userData.photoURL;
  
        // Nếu có URL ảnh hiện tại, xóa ảnh đó trên Firebase Storage
        if (currentPhotoURL) {
          const storage = getStorage();
          const photoRef = ref(storage, currentPhotoURL);
          await deleteObject(photoRef);
  
          // Xóa URL ảnh trong tài liệu của người dùng trong Firestore
          await setDoc(userRef, { photoURL: null }, { merge: true });
        }
      }
    } catch (error) {
      console.error("Error deleting previous photo: ", error);
    }
  };
  
  // Method tải ảnh lên storage
  const uploadImageAsync = async (ure, userId) => {
    try {
      if (!ure) {
        throw new Error("URI của hình ảnh không xác định hoặc là null");
      }
  
      const storage = getStorage();
      const filename = `imgs/${userId}/${Date.now()}`;
  
      // Lấy dữ liệu hình ảnh
      const response = await fetch(ure);
  
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu hình ảnh");
      }
  
      // Chuyển đổi dữ liệu hình ảnh thành blob
      const blob = await response.blob();
  
      // Tải blob lên Firebase Storage
      const photoRef = ref(storage, filename);
      await uploadBytes(photoRef, blob);
  
      // Lấy URL của hình ảnh đã tải lên
      const downloadURL = await getDownloadURL(photoRef);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh: ", error);
      throw error; // Ném lỗi ra ngoài
    }
  };
  
// Method cập nhật đường dẫn ảnh mới vào firestore
const updatePhotoURL = async (newURL, userId) => {
  try {
    // Cập nhật URL ảnh mới vào Firestore
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, { photoURL: newURL }, { merge: true });
  } catch (error) {
    console.error("Error updating photo URL: ", error);
  }
};
  
const onHandleCont = () => {
    Alert.alert(
      'Signup success',
      'You have signed up successfully!',
      [{ text: 'OK'}]
    );
    navigation.navigate('MyTabs');
  };

  
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.view1}>
        <Pressable onPress={() => navigation.goBack()}>
          <View style={styles.iconback}>
            <Icon name="chevron-back" size={25} color="white" />
          </View>
        </Pressable>
        <Text style={styles.anhdaidien}>Ảnh đại diện</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.textNote}>Cập nhật ảnh đại diện đẹp nhất của bạn.</Text>
      </View>

      <View style={styles.view3}>
        <Text style={styles.title}>{displayName}</Text>
        <TouchableOpacity onPress={handleUpdatePhoto}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />

          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>Add image</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.textanh}>Chọn ảnh của bạn ở đây</Text>
      </View>

      <View style={styles.cont}>
          <Pressable style={styles.PreCont} onPress={onHandleCont}>
            <Text style={styles.textcont}>Tiếp tục</Text>
          </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#418df8",
  },
  view2: {
    backgroundColor: "#D9D9D9",
    //alignItems: 'flex-start',
  },
  textNote: {
    fontSize: 16,
    textAlign: 'center',
  },
  anhdaidien: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'white',
  },
  iconback: {
    marginTop: 15,
    height: 20,
    width: 20,
  },
  view3: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#E1E2E6",
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  textanh: {
    fontSize: 15,
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 15,
  },
  cont: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textcont: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreCont: {
    margin: 40,
    backgroundColor: "#418df8",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
});
