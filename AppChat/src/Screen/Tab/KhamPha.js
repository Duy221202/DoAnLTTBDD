import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native'; // Import useRoute

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
} from "react-native";

const KhamPha = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={25} color="white" style={styles.icon} />
          <TextInput style={styles.textTK} placeholder="Tìm kiếm"></TextInput>
        </View>
        <View style={styles.iconContainer2}>
          <Icon name="qr-code" size={25} color="white" style={styles.icon} />
        </View>
      </View>
      
      {/* Body */}
      <View style={styles.body}>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="videocam-outline"
            size={50}
            color="#66E86B"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Khám phá nè</Text>
            <Text style={styles.userMessage}>123</Text>
          </View>
        </Pressable>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        
      </View>
    </View>
  );
};

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 35,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#66E86B",
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    iconContainer: {
      marginLeft: 5,
      flexDirection: 'row',
    },
    textTK: {
      marginLeft: 5,
      fontSize: 18,
      color: 'white',
      width: 250,
    },
    iconContainer2: {
      marginRight: 15,
      flexDirection: 'row',
    },
    body: {
      flex: 1,
      paddingHorizontal: 10,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    userIcon: {
      marginRight: 10,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    userMessage: {
      fontSize: 16,
      color: 'gray',
    },
    footer: {
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: 20,
    },
    icon: {
      marginLeft: 10,
    },
});
export default KhamPha;