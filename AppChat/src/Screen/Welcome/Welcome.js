import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('vi');

  const handleLogin = () => {
    // Handle login navigation
    navigation.navigate('Login2');
  };

  const handleRegister = () => {
    // Handle registration navigation
    //navigation.navigate('Dangky');
    navigation.navigate('DangKyMail');
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Alo</Text>
        <Text style={styles.textwel}>Nơi giúp bạn trao đổi với mọi người thông qua chat và video call dễ dàng hơn</Text>
        <ScrollView horizontal={true} style={styles.imageContainer}>
          <Image
            source={require("../../../src/Image/conversation.gif")}
            style={styles.welcomeImage}
          />
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
          <TouchableOpacity onPress={() => handleLanguageChange('vi')}>
            <Text style={[styles.footerText, selectedLanguage === 'vi' ? { color: '#007bff' } : null]}>Tiếng Việt</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLanguageChange('en')}>
            <Text style={[styles.footerText, selectedLanguage === 'en' ? { color: '#007bff' } : null]}>English</Text>
          </TouchableOpacity>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
    marginTop: 30, // Canh chỉnh phù hợp với android
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: "bold",
    paddingTop: 20,
  },
  textwel: {
    fontSize: 16,
    fontWeight: "400",
    paddingTop: 20,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  welcomeImage: {
    width: 250,
    height: 250,
    marginLeft: 20,
    borderRadius: 200,
  },
  button: {
    backgroundColor: "#66E86B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-around',
  },
  footerText: {
    fontSize: 18,
    color: 'black',
  }
});

export default Welcome;
