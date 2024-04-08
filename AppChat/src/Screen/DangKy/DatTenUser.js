import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, StatusBar, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../config/firebase';
import { useRoute } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';

export default function DatTenUser({ navigation}) {
  const [name, setName] = useState('');
  const db = getFirestore();
  const route = useRoute(); // Sử dụng useRoute để lấy route params
  const { email, pass} = route.params; 
  const [gender, setGender] = useState('male');
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2000');
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 120 }, (_, i) => (2024 - i).toString());

  const onHandleSignup = () => {
    if (name !== '') {
      // // Kiểm tra ràng buộc đặt tên
      // if (!/^[A-Za-z][a-zA-Z]*$/.test(name)) {
      //   Alert.alert('Tên bắt đầu bằng chữ cái và không chứa ký tự số hoặc ký tự đặc biệt.');
      //   return;
      // }
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        // Lưu tên người dùng vào Firestore
        setDoc(doc(db, "users", auth.currentUser.uid), {
          name: name,
          UID: auth.currentUser.uid, // Thêm UID vào tài liệu người dùng
          userId: email, // Sử dụng email từ params
          birthDate: `${day}/${month}/${year}`, // Tạo một chuỗi ngày tháng năm sinh
          gender: gender // Lưu giới tính
        }).then(() => {
          navigation.navigate('Profile');
        }).catch((error) => {
          console.log("Error adding document: ", error);
        });
      }).catch((error) => {
        console.log("Update profile error: ", error);
      });
    } else {
      Alert.alert("Name is required", err.message);
    }
  };

return (
    <View style={styles.container}>
      <View style={styles.view1}>
            <Pressable
            onPress={() => {
                navigation.goBack();
            }}>
              <View style={styles.iconback}>
                  <Icon name="chevron-back" size={25} color="white" />
              </View>
            </Pressable>
          <Text style={styles.TaoTK}>Tạo tài khoản</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.text1}>Tên của bạn</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}>
        </TextInput>
      </View>

      <View style={styles.view3}>
          <Text style={styles.text2}>Ngày sinh</Text>
          <View style={styles.ntnsPicker}>
            <Picker style={styles.datePicker} selectedValue={day} onValueChange={(itemValue, itemIndex) => setDay(itemValue)}>
              {days.map((day) => (
                <Picker.Item label={day} value={day} key={day} />
              ))}
            </Picker>

            <Picker style={styles.datePicker}selectedValue={month} onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}>
              {months.map((month) => (
                <Picker.Item label={month} value={month} key={month} />
              ))}
            </Picker>

            <Picker style={styles.datePicker} selectedValue={year} onValueChange={(itemValue, itemIndex) => setYear(itemValue)}>
              {years.map((year) => (
                <Picker.Item label={year} value={year} key={year} />
              ))}
            </Picker>

          </View>
        </View>  
        
        <View style={styles.view3}>
          <Text style={styles.text2}>Giới tính</Text>
          <View style={styles.view31}>
            <TouchableOpacity  style={[styles.gioitinh, gender === 'Nam' && styles.nutgioitinh]}
              onPress={() => setGender('Nam')}
            >
              <Text style={styles.radioText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.gioitinh, gender === 'Nữ' && styles.nutgioitinh]}
              onPress={() => setGender('Nữ')}
            >
              <Text style={styles.radioText}>Nữ</Text>
            </TouchableOpacity>
          </View>
        </View>
      
      {/* <View style={styles.view3}>
        <Text style={styles.textNote}>Lưu ý khi đặt tên</Text>
        <View style={styles.view3_1}>
          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Không vi phạm <Text style={styles.blueText}>Quy định đặt tên trên Zalo</Text></Text>
          </Text>

          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
          </Text>
        </View>
      </View> */}

      <View style={styles.view4}>
        <Pressable style={styles.PreDK} onPress={() => onHandleSignup()}>
          <Text style={styles.textNext}>Tiếp tục</Text>
        </Pressable>
      </View>

      {/* <View style={styles.view5}>
        <Text style={styles.textdieukhoan}>
          <Text> Tiếp tục nghĩa là bạn đồng ý với các </Text> 
          <Text style={[styles.textdieukhoan, styles.blueText]}>
            Điều khoản sử dụng Zalo
          </Text>
        </Text>
      </View> */}

    </View>
  )
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
  TaoTK: {
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
  view2: {
    flexDirection: 'column',
  },
  text1: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  input: {
    height: 50,
    width: 380,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18,
    marginLeft: 10,
  },
  view3: {
    flexDirection: 'column',
    margin: 12,
    marginTop: 20,
  },
  textNote: {
    fontSize: 18,
  },
  view3_1: {
    marginTop: 15,
  },
  textNote1: {
    fontSize: 16,
    marginBottom: 15,
  },
  blueText: {
    color: 'blue',
    fontWeight: '400',
  },
  view4: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreDK: {
    margin: 40,
    backgroundColor: "#418df8",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  view5: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },  
  textdieukhoan: {
    fontSize: 16,
    textAlign: 'center',
  },
  //
  text2: {
    fontSize: 16,
    marginBottom: 10,
  },
  view31: {
    flexDirection: 'row',
  },
  gioitinh: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  nutgioitinh: {
    backgroundColor: '#418df8',
    borderColor: '#418df8',
  },
  radioText: {
    color: 'black',
    textAlign: 'center',
  },
  ntnsPicker: {
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
});
