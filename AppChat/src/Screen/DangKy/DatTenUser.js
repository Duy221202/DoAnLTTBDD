import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, StatusBar, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../config/firebase';
import { useRoute } from '@react-navigation/native'; // Import useRoute

export default function DatTenUser({ navigation}) {
  const [name, setName] = useState('');
  const db = getFirestore();
  const route = useRoute(); // Sử dụng useRoute để lấy route params
  const { email, pass } = route.params;
  
  const onHandleSignup = () => {
    if (name !== '') {
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        // Lưu tên người dùng vào Firestore
        setDoc(doc(db, "users", auth.currentUser.uid), {
          name: name,
          userId: email // Sử dụng email từ params
        }).then(() => {
          // alert(
          //   'Signup success',
          //   'You have signed up successfully!',
          //   [{ text: 'OK'}]
          // );
          navigation.navigate('Profile');
        }).catch((error) => {
          console.log("Error adding document: ", error);
        });
      }).catch((error) => {
        console.log("Update profile error: ", error);
      });
    } else {
    alert("Name is required", "Please enter your name.");
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
        <Text style={styles.text1}>Tên Zalo</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}>
        </TextInput>
        
      </View>
      
      <View style={styles.view3}>
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
      </View>

      <View style={styles.view4}>
        <Pressable style={styles.PreDK} onPress={() => onHandleSignup()}>
          <Text style={styles.textNext}>Tiếp tục</Text>
        </Pressable>
      </View>

      <View style={styles.view5}>
        <Text style={styles.textdieukhoan}>
          <Text> Tiếp tục nghĩa là bạn đồng ý với các </Text> 
          <Text style={[styles.textdieukhoan, styles.blueText]}>
            Điều khoản sử dụng Zalo
          </Text>
        </Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#66E86B",
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
    fontSize: 22,
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
    marginLeft: 15,
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
    backgroundColor: "#66E86B",
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
});
