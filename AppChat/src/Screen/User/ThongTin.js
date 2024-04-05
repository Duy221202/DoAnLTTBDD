import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../../../config/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const ThongTin = () => {
  const navigation = useNavigation();
  const firestore = getFirestore();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
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

  useEffect(() => {
    // Cập nhật lại ảnh đại diện khi quay lại từ trang Profile
    const unsubscribe = navigation.addListener('focus', () => {
      // Fetch ảnh đại diện mới từ Firestore hoặc từ state nếu đã cập nhật
      if (auth.currentUser) {
        fetchPhotoURL(auth.currentUser.uid);
      }
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleEditProfile = async () => {
    try {
      await updateUserProfile();
      setIsEditing(false);
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
        <View style={styles.tback}>
        <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="black" />
        </Pressable>
        </View>

        {/* Body */}
      <ScrollView style={styles.body}>
        <Pressable style={styles.userContainer}>
          {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.imgdaidien} />
          ) : (
            <Text>No avatar</Text>
          )}

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} />
        
        <View>
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

        {isEditing ? (
          <TouchableOpacity style={styles.updateContainer} onPress={handleEditProfile}>
              <Icon name="checkmark-outline" size={25} color="black" style={styles.updateIcon} />
              <Text style={styles.updateText}>Cập nhật</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.updateContainer} onPress={() => setIsEditing(true)}>
          <Icon name="create-outline" size={25} color="black" style={styles.updateIcon} />
          <Text style={styles.updateText}>Chỉnh sửa</Text>
      </TouchableOpacity>
      )}
    </ScrollView>
  </View>
  );
};

//         <View>
//           <TouchableOpacity style={styles.updateContainer}>
//               <Icon name="create-outline" size={25} color="black" style={styles.updateIcon} />
//               <Text style={styles.updateText}>Chỉnh sửa</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </View>
//     )
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 32,
    },
    tback: {
        padding: 5,
    },
    texttt: {
        fontSize: 18,
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '500',
    },
    body: {
      //flex: 1,
      paddingHorizontal: 10,
      marginTop: 30,
    },
    userContainer: {
      flexDirection: 'row',
      paddingHorizontal: 5,
      paddingVertical: 10,
    },
    imgdaidien: {
      width: 60,
      height: 60,
      borderRadius: 40,
    },
    userIcon: {
      marginRight: 10,
    },
    userInfo: {
      //flex: 1,
      marginLeft: 15,
      marginTop: 15,
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    userMessage: {
      fontSize: 15,
      color: 'gray',
    },
    userInfo1: {
      flex: 1,
      marginLeft: 10,
      marginTop: 12,
    },
    // thanh cắt ngang
    separator: {
      height: 5, // Độ cao của thanh phân cách
      backgroundColor: '#ccc',
      marginVertical: 5, // Khoảng cách dọc giữa các phần
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
      width: 130, // Độ rộng của nhãn (label)
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
    updateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D9D9D9',
      borderWidth: 1,
      borderRadius: 20,
      padding: 10, 
      marginTop: 20,
    },
    updateIcon: {
      marginRight: 5, 
      //fontSize: 16,
    },
    updateText: {
      fontSize: 14,
    },
});

export default ThongTin;

