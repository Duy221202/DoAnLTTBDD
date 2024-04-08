import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

//import Modal from "react-native-modal";

function ThongTinUser() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();

  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBirthDate, setEditedBirthDate] = useState('');
  const [editedGender, setEditedGender] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        fetchPhotoURL(user.uid);
      } else {
        setDisplayName('');
        setPhotoURL(null);
        setGender('');
        setBirthDate('');
        setEmail('');
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
        setGender(userData.gender || ''); // Sử dụng giới tính nếu có, nếu không thì để trống
        setBirthDate(userData.birthDate || ''); // Sử dụng ngày sinh nếu có, nếu không thì để trống
        setEmail(userData.userId); // Sử dụng email người dùng
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

const onHandleNhatKy = () => {
  navigation.navigate('MyTabs');
};

const onHandleThongTin = () => {
  navigation.navigate('ThongTin');
};

const handleEditProfile = async () => {
  try {
    await updateUserProfile();
    setIsEditing(false);
    //setDisplayName(editedName); // Cập nhật displayName với tên mới đã chỉnh sửa
    Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
  } catch (error) {
    console.error("Error updating profile: ", error);
    Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin');
  }
};

const updateUserProfile = async () => {
  try {
    const userId = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, {
      name: editedName,
      gender: editedGender,
      birthDate: editedBirthDate
    }, { merge: true });
    setDisplayName(editedName);
    setGender(editedGender);
    setBirthDate(editedBirthDate);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
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
           <Pressable onPress={onHandleThongTin}>
             <Icon name="ellipsis-vertical" size={25} color="black" style={styles.icon} />
           </Pressable>
         </View>
       </View>

       {/* Body */}
       <View style={styles.body}>

        {/* <TouchableOpacity onPress={handleUpdatePhoto} style={styles.addImage}>
          <Text style={styles.addImageText}>Thêm ảnh nềnn</Text>
        </TouchableOpacity> */}

         <View style={styles.cutLine}></View>

         <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleUpdatePhoto} style={styles.iconCircle}>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.iconCircle} />

              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Add image</Text>
                </View>
              )}
            </TouchableOpacity>

           <Text style={styles.userName}>{displayName}</Text>

           {/* <TouchableOpacity style={styles.updateContainer}>
             <Icon name="create-outline" size={25} color="#007bff" style={styles.updateIcon} />
             <Text style={styles.updateText}>Cập nhật thông tin</Text>
           </TouchableOpacity> */}

         </View>
       </View>

       {/* <View style={styles.view3}>
          <Text style={styles.thongtin}>Thông tin cá nhân</Text>

          {isEditing ? (
            <View style={styles.viewthongtin}>
              <TextInput
                style={styles.input}
                value={editedGender}
                onChangeText={setEditedGender}
                placeholder="Giới tính"
              />
              <TextInput
                style={styles.input}
                value={editedBirthDate}
                onChangeText={setEditedBirthDate}
                placeholder="Ngày sinh"
              />
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Tên"
              />
            </View>
          ) : (

          <View style={styles.viewthongtin}>
            <View style={styles.row}>
              <Text style={styles.label}>Giới tính:</Text>
              <Text style={styles.data}>{gender}</Text>
            </View>

            <View style={styles.separator1} />
            <View style={styles.row}>
              <Text style={styles.label}>Ngày sinh:</Text>
              <Text style={styles.data}>{birthDate}</Text>
            </View>
            
            <View style={styles.separator1} />
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.data}>{email}</Text>
            </View>
            <View style={styles.separator1} />
          </View>
          )}
        </View>

        <View style={styles.nutupdate}>
        {isEditing ? (
          <TouchableOpacity style={styles.updateContainer2} onPress={handleEditProfile}>
              <Icon name="checkmark-outline" size={25} color="black" style={styles.updateIcon} />
              <Text style={styles.updateText}>Cập nhật</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.updateContainer1} onPress={() => setIsEditing(true)}>
          <Icon name="create-outline" size={25} color="black" style={styles.updateIcon} />
          <Text style={styles.updateText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}
        </View> */}
      {/* Footer */}
      <View style={styles.footer}>
          <Image
              source={require("../../../src/Image/diary.png")}
              style={styles.welcomeImage}
            />

          <Text style={styles.texttt}>Hôm nay {displayName} có gì vui?</Text>

          <Text style={styles.texttt2}>Đây là nhật ký của bạn - Sống hết mình với đam mê </Text>
          
          <Pressable style={styles.PreCont} onPress={onHandleNhatKy}>
            <Text style={styles.textcont}>Đăng lên Nhật ký</Text>
          </Pressable>
      </View>       
  </View>
);
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
addImage: {
  position: "absolute",
  top: "5%",
  alignSelf: "center",
  width: "100%",
  height: "30%",
},
addImageText: {
  color: "blue",
  fontSize: 16,
  fontWeight: "bold",
},
cutLine: {
  width: "100%",
  height: 1,
  backgroundColor: "black",
  position: "absolute",
  top: "35%",
},
avatarContainer: {
  alignItems: "center",
  position: "absolute",
  top: "16%",
},
iconCircle: {
  width: 150,
  height: 150,
  borderRadius: 100,
  //backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: 'white', 
  borderWidth: 5,
},
userName: {
  fontSize: 20,
  fontWeight: "bold",
  //marginTop: 150,
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
//
view3: {
  //flex: 1,
  marginTop: 10,
},
thongtin: {
  fontSize: 15,
  padding: 10,
  fontWeight: '600',
},
viewthongtin: {
  paddingHorizontal: 20,
  paddingVertical: 10,
},
separator1: {
  height: 1, // Độ cao của thanh phân cách
  backgroundColor: '#ccc',
  marginVertical: 15, // Khoảng cách dọc giữa các phần
},
row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 5,
},
label: {
  width: 100, // Độ rộng của nhãn (label)
  fontWeight: 'bold',
},
data: {
  flex: 1,
  fontSize: 15,
},
// chỉnh sửa
input: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingHorizontal: 10,
},
nutupdate: {
  flex: 1,
},
updateContainer1: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#D9D9D9',
  borderWidth: 1,
  borderRadius: 20,
  marginHorizontal: 30,
},
updateContainer2: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#D9D9D9',
  borderWidth: 1,
  borderRadius: 20,
  marginHorizontal: 30,
  marginTop: 50,
},
// updateIcon: {
//   marginRight: 5, 
//   //fontSize: 16,
// },
updateText: {
  fontSize: 14,
},
// footer
footer: {
  alignItems: "center",
  bottom: "15%",
},
welcomeImage: {
  width: 100,
  height: 100,
},
texttt: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 5,
},
texttt2: {
  fontSize: 15,
  fontWeight: '300',
  marginBottom: 20,
},
textcont: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#ffff",
  textAlign: "center",
},
PreCont: {
  backgroundColor: "#418df8",
  height: 40,
  width: 200,
  borderRadius: 20,
  textAlign: 'center',
  justifyContent: 'center',
},
});
export default ThongTinUser;


