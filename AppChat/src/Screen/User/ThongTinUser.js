import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import Modal from "react-native-modal";

function ThongTinUser() {
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

  // Nút đăng xuất
  const onHandleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        Alert.alert(
          'Logout success',
          'You have logged out successfully!',         
        );
      })
      .catch((err) => Alert.alert("Logout error", err.message));
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
  navigation.navigate('MyTabs');
};

return (
  <View style={styles.container}>

    {/* Header */}
       <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Icon name="arrow-back" size={25} color="black" />
         </TouchableOpacity>

         <View style={styles.iconContainer}>
           <TouchableOpacity>
             <Icon name="time-outline" size={25} color="black" style={styles.icon} />
           </TouchableOpacity>
           <TouchableOpacity>
             <Icon name="ellipsis-vertical" size={25} color="black" style={styles.icon} />
           </TouchableOpacity>
         </View>
       </View>

       {/* Body */}
       <View style={styles.body}>
         <View style={styles.cutLine}></View>

         <View style={styles.avatarContainer}>
           <TouchableOpacity style={styles.iconContainer2}>
            <TouchableOpacity onPress={handleUpdatePhoto} style={styles.iconCircle}>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.iconCircle} />

              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Add image</Text>
                </View>
              )}
            </TouchableOpacity>
           </TouchableOpacity>

           <Text style={styles.userName}>{displayName}</Text>

           <TouchableOpacity style={styles.updateContainer}>
             <Icon name="create-outline" size={25} color="#007bff" style={styles.updateIcon} />
             <Text style={styles.updateText}>Cập nhật thông tin</Text>
           </TouchableOpacity>

         </View>
       </View>

    <Button title="Logout" onPress={onHandleLogout} />

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
},
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
},
iconContainer: {
  flexDirection: "row",
},
icon: {
  marginLeft: 10,
},
body: {
  flex: 1,
  alignItems: "center",
},
cutLine: {
  width: "100%",
  height: 1,
  backgroundColor: "black",
  position: "absolute",
  top: "38%",
},
avatarContainer: {
  alignItems: "center",
  position: "absolute",
  top: "22%",
},
iconContainer2: {
  position: 'absolute',
},
iconCircle: {
  width: 120,
  height: 120,
  borderRadius: 60,
  //backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: 'white', 
  borderWidth: 5,
},
userName: {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 120,
},
updateContainer: {
  marginTop: 10,
  flexDirection: 'row',
  alignItems: 'center',
},
updateIcon: {
  marginRight: 5,
},
updateText: {
  color: "#007bff",
  fontSize: 16,
},
title: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 40,
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
cont: {
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
  backgroundColor: "#66E86B",
  height: 50,
  width: 230,
  borderRadius: 20,
  padding: 10,
},
});
export default ThongTinUser;
  
//   return (
//     <View style={styles.container}>
//       {/* Modal */}
//       {/* <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
//         <View style={styles.modalButtonContainer}>
//           <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
//             <Text style={styles.modalButtonText}>Xem ảnh đại diện</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.modalButton}>
//           <input type="file" onChange={handleInputChange} style={styles.chooseimg}/>
//             <Text style={styles.modalButtonText}>Chọn ảnh</Text>
//           </TouchableOpacity>
//           {uploadedImageUrl && (
//               <View style={styles.uploadedImage} >
//                 <Image source={{ uri: uploadedImageUrl }} style={styles.uploadedImage2} />
//               </View>
//             )}

//           <TouchableOpacity onPress={handleClick} style={styles.modalButton}>
//            <Text style={styles.modalButtonText}>Upload</Text>
//           </TouchableOpacity>
//           <View style={styles.anhdaidien}>
//           {
//             imgUrl.map((url, index) => (
//               <Image key={index} source={{ uri: url }} style={styles.iconCircle}/> // hình viền tròn
//             ))
//           }
//           </View>

//         </View>
//       </Modal> */}

//       {/* Footer */}
//       <View style={styles.footer}>

//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     // Modal
//     modalButtonContainer: {
//       flexDirection: 'column',
//     },
//     modalButton: {
//       backgroundColor: '#007bff',
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 50,
//       marginVertical: 5,
//       alignItems: 'center',
//     },
//     modalButtonText: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: 'bold',
//       textAlign: 'center', // Canh giữa văn bản
//     },
//     // footer
//     footer: {
//       flex: 1,
//     },
//     uploadimg: {
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     chooseimg: {
//       width: "27%",
//       height: 25,
//       borderRadius: 20,
//       backgroundColor: '#ccc',
//     },
//     uploadButton: {
//       backgroundColor: '#007bff',
//       borderRadius: 5,
//       padding: 10,
//       marginBottom: 10,
//     },
//     uploadText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//     uploadedImage: {
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     uploadedImage2: {
//       width: 200,
//       height: 200,
//     },
// });
// export default ThongTinUser;

