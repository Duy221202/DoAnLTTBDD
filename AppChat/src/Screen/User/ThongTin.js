import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity, Pressable, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../../../config/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';
const ThongTin = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const firestore = getFirestore();
  //const [displayName, setDisplayName] = useState('');
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');

  const [gender, setGender] = useState('');
  //const [birthDate, setBirthDate] = useState('');
  const [dateOfBirth, setdateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  //const [newEmail, setNewEmail] = useState(""); 
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  //const [editedBirthDate, setEditedBirthDate] = useState('');
  const [editeddateOfBirth, setEditeddateOfBirth] = useState('');
  const [editedGender, setEditedGender] = useState('');

  useEffect(() => {
    //const unsubscribe = auth.onAuthStateChanged((user) => {
    const unsubscribe = async () => {
      if (user) {
        // setDisplayName(user.displayName);
        // setName(user.name);
        fetchPhotoURL(user.uid);
      } else {
        //setDisplayName('');
        setName('');
        setPhotoURL(null);
        setGender('');
        //setBirthDate('');
        setdateOfBirth('');
        setEmail('');
        //setNewEmail('');
      }
    // });
  };

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
        setName(userData.name); // Đặt giá trị cho name thay vì displayName
        setPhotoURL(userData.photoURL);
        setGender(userData.gender || ''); // Sử dụng giới tính nếu có, nếu không thì để trống
        //setBirthDate(userData.birthDate || ''); // Sử dụng ngày sinh nếu có, nếu không thì để trống
        setdateOfBirth(userData.dateOfBirth || ''); // Sử dụng ngày sinh nếu có, nếu không thì để trống
        setEmail(userData.email); // Sử dụng email người dùng
        //setNewEmail(userData.email); // Sử dụng email người dùng
        setEditedName(userData.name); // Initialize editedName with the fetched name
        setEditedGender(userData.gender || ''); // Initialize editedGender with the fetched gender
        setEditeddateOfBirth(userData.dateOfBirth || ''); // Initialize editeddateOfBirth with the fetched dateOfBirth
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
        //birthDate: editedBirthDate
        dateOfBirth: editeddateOfBirth
      }, { merge: true });
      //setDisplayName(editedName);
      setName(editedName);
      setGender(editedGender);
      //setBirthDate(editedBirthDate);
      setdateOfBirth(editeddateOfBirth);
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
            {/* <Text style={styles.userName}>{displayName}</Text> */}
            <Text style={styles.userName}>{name}</Text>
          </View>
        </Pressable>

        {/* thanh cắt ngang */}
        <View style={styles.separator} />
        
        <View>
          <Text style={styles.thongtin}>Thông tin cá nhân</Text>
          {/* <Text>Nhập lại tên tên:</Text>
              <Text style={{marginBottom:-10}}>        </Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Tên"
              /> */}
              
            <Text style={{marginBottom:-10}}>        </Text>
            <View>
          
        </View>  
          {isEditing ? (
            <View style={styles.viewthongtin}>
              <View style={styles.radioContainer}>
                  <Text style= {{fontSize: 16}} >Tên:</Text>
              <Text style={{marginBottom:-10}}>        </Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Tên"
              />
          <Text style={styles.radioLabel}>Giới tính</Text>
          <View style={styles.radioOptions}>
          <Text style={styles.radioText}>Nam:</Text>
            <TouchableOpacity
              style={[styles.radioButtonMale, editedGender === 'Nam' && styles.selectedRadioButton]}
              onPress={() => setEditedGender('Nam')}
            >
             
            </TouchableOpacity>
            <Text style={styles.radioText}>Nữ</Text>
            <TouchableOpacity
              style={[styles.radioButtonFMale, editedGender === 'Nữ' && styles.selectedRadioButton]}
              onPress={() => setEditedGender('Nữ')}
            >
              
            </TouchableOpacity>
            
          </View>
          <Text></Text>
          <Text style={styles.radioLabel}>Ngày sinh</Text>
          <View style={styles.datePickerContainer}>
            <Picker
              style={styles.datePicker}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => setDay(itemValue)}
            >
              {days.map((day) => (
                <Picker.Item label={day} value={day} key={day} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}selectedValue={month}
              onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item label={month} value={month} key={month} />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) => setYear(itemValue)}
            >
              {years.map((year) => (
                <Picker.Item label={year} value={year} key={year} />
              ))}
            </Picker>
          </View>
        </View>
            
              
               
            <View style={styles.row1}>
              <Text style={styles.label1}>Email:</Text>
              <Text style={styles.data1}>{email}</Text>
              {/* <Text style={styles.data}>{newEmail}</Text> */}
            </View>
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
              {/* <Text style={styles.data}>{birthDate}</Text> */}
              <Text style={styles.data}>{dateOfBirth}</Text>
            </View>
            
            <View style={styles.separator1} />
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.data}>{email}</Text>
              {/* <Text style={styles.data}>{newEmail}</Text> */}
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
          <Text style={styles.updateText}>Chỉnh sữa thông tin</Text>
      </TouchableOpacity>
      )}
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 32,
    },
    radioButtonFMale: {
      width: 20,
      borderWidth: 1,
      borderColor: 'gray',
      paddingVertical: 10,
      borderRadius: 10,
      marginLeft: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioLabel: {
      fontSize: 16,
      marginBottom: 10,
    },
    radioOptions: {
      flexDirection: 'row',
    },
    radioContainer: {
      marginTop: 20,
    },
    selectedRadioButton: {
      backgroundColor: '#006AF5',
      borderColor: '#006AF5',
    },
    radioButtonMale: {
      width: 20,
      borderWidth: 1,
      borderColor: 'gray',
      paddingVertical: 10,
      borderRadius: 10,
      marginRight: 5,
      alignItems: 'center',
      justifyContent: 'center',
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
    datePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    datePicker: {
      flex: 1,
      height: 58,
      backgroundColor: "#F6F7FB",
      borderRadius: 10,
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
    row1: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    label1: {
      width: 130, // Độ rộng của nhãn (label)
      fontWeight: 'bold',
      },
    label1: {
      width: 130, // Độ rộng của nhãn (label)
      fontWeight: 'bold',
      fontSize: 16,
      //marginBottom: 10,
    },
    data: {
      flex: 1,
      fontSize: 15,
    },
    data1: {
      flex: 1,
      fontSize: 15,
      marginLeft:-80,
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
