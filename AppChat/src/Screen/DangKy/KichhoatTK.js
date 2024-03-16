import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Image,
    TextInput,
    TouchableOpacity,
  } from "react-native";

  const KichhoatTK = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params;
    const [timeLeft, setTimeLeft] = useState(60); // Thời gian còn lại ban đầu là 60 giây
    
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [inputValue3, setInputValue3] = useState("");
    const [inputValue4, setInputValue4] = useState("");
    useEffect(() => {
      // Bắt đầu đếm ngược
      const interval = setInterval(() => {
        // Giảm thời gian còn lại mỗi giây
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
  
      // Xóa bộ đếm khi component bị unmount
      return () => clearInterval(interval);
    }, []);

    const handleTextChange1 = (text) => {
      const formattedText = text.replace(/[^0-9]/g, "");
      setInputValue1(formattedText);
    };
    
    const handleTextChange2 = (text) => {
        const formattedText = text.replace(/[^0-9]/g, "");
        setInputValue2(formattedText);
    };
    
    const handleTextChange3 = (text) => {
        const formattedText = text.replace(/[^0-9]/g, "");
        setInputValue3(formattedText);
    };
    
    const handleTextChange4 = (text) => {
        const formattedText = text.replace(/[^0-9]/g, "");
        setInputValue4(formattedText);
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
              <Text style={styles.KichhoatTK}>Kích hoạt tài khoản</Text>
          </View>
            
          <View style={styles.view2}>
            <Text style={styles.textNote}>Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản</Text>
          </View>

          <View style={styles.view3}>
            <Image
              source={require("../../../src/Image/call.gif")}
              style={styles.callImage}
            />
          </View>

          <View style={styles.view4}>
            <Text style={styles.textnsdt}>Đang gọi đến số </Text> 
            <Text style={styles.textsdt}>(+84) {phoneNumber.slice(1)} </Text>
          </View>

          <View style={styles.view5}>
            <Text style={styles.textNote2}>Vui lòng nhập mã đã được gửi</Text>
              {/* Các ô nhập mã */}
              <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={handleTextChange1}
                    value={inputValue1}
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={handleTextChange2}
                    value={inputValue2}
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={handleTextChange3}
                    value={inputValue3}
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={handleTextChange4}
                    value={inputValue4}
                  />
              </View>

              {/* Thời gian đếm ngược */}
              <View style={styles.texttgian}>
                <Text style={styles.textglm}>Gửi lại mã sau: </Text>
                <Text style={[styles.timerText, {color: 'blue'}]}>
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                </Text>
              </View>
          </View>

          <View style={styles.view6}>
            <Pressable style={styles.PreKHTK} onPress={() => handleNext()}>
              <Text style={styles.textNext}>Tiếp tục</Text>
            </Pressable>
          </View>

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#66E86B",
  },
  KichhoatTK: {
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
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callImage: {
    width: 120,
    height: 120,
    borderRadius: 200,
  },
  view4: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textnsdt: {
    fontSize: 20,
  },
  textsdt: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  view5: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  textNote2: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginHorizontal: 5,
    textAlign: "center",
    width: 40,
    fontSize: 24,
  },
  texttgian: {
    flexDirection: 'row',
    marginTop: 15,
  },
  textglm: {
    fontSize: 20,
    fontWeight: "400",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "500",
  },
  view6: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreKHTK: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
});
export default KichhoatTK