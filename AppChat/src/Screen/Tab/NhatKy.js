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
  ScrollView, 
  SafeAreaView,
} from "react-native";

const NhatKy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView>
      {/* Header */}
      <View style={styles.searchContainer}>
          <Pressable >
          <Icon name="search" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_BanBe")}>
          <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          <Icon name="image-outline" size={25} color="white" style={styles.icon} />
          <Icon name="notifications-outline" size={25} color="white" style={styles.icon} />
      </View>
      
      {/* Body */}
      <View style={styles.body}>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Icon
            name="person-circle-outline"
            size={50}
            color="#66E86B"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Nhật ký</Text>
            <Text style={styles.userMessage}>123</Text>
          </View>
        </Pressable>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        
      </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 32,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#418df8",
      padding: 9,
      height: 48,
      width: '100%',
    },
    searchInput: {   
      flex: 1,
      justifyContent:"center",
      height:48,
      marginLeft: 10,      
    },
    textSearch:{
      color:"white",
      fontWeight:'500'
    },
    body: {
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
export default NhatKy;