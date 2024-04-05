import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/firebase";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";

export default function Quenmatkhau  () {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Check your email', [{ text: 'OK' }]);
      navigation.navigate("Welcome");
    } 
    catch (error) {
      alert('Failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.view1}>
        <Pressable onPress={() => navigation.goBack()}>
          <View style={styles.iconback}>
            <Icon name="chevron-back" size={25} color="white" />
          </View>
        </Pressable>
        <Text style={styles.textllmk}>Lấy lại mật khẩu</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.textNote}>Vui lòng nhập email bạn đã đăng ký!</Text>
      </View>

      <View style={styles.view3}>
        <TextInput
          style={styles.textEmail}
          placeholder="Nhập Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.view4}>
        <Pressable style={styles.PreQMK} onPress={handleSubmit}>
          <Text style={styles.textNext}>Reset</Text>
        </Pressable>
      </View>
      
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
  textllmk: {
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
  view2:{
    backgroundColor: "#D9D9D9",
  },
  textNote:{
    fontSize: 16,
  },
  view3: {
    marginTop: 20,
    alignItems: "center",
  },
  textEmail: {
    height: 50,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  view4: {
    alignItems: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreQMK: {
    backgroundColor: "#418df8",
    height: 50,
    width: "60%",
    borderRadius: 25, 
    justifyContent: "center", 
    alignItems: "center",
  },
});

