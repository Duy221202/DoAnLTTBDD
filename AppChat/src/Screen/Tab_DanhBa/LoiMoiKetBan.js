import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Friend_Received from '../Tab_DanhBa/Friend_Received';
import Friend_Sent from '../Tab_DanhBa/Friend_Sent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const LoiMoiKetBan = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();

  // const handleGoBack = () => {
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'Main' }],
  //   });
  // };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon2 name="arrowleft" size={20} color="white" />
          </Pressable>
          <Text style={styles.textSearch}>Lời mời kết bạn</Text>
          <Icon name="settings-outline" size={24} color="white" />
        </View>
        <Tab.Navigator>
            <Tab.Screen name="Đã Nhận" component={Friend_Received} />
            <Tab.Screen name="Đã gửi" component={Friend_Sent} />
        </Tab.Navigator>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
    marginTop: 35,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006AF5",
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
    flex:1,
    color:"white",
    fontWeight:'500',
    marginLeft:20
  },
  itemContainer: {
    marginTop: 20,
    flex: 1,
    margin: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  text: {
    marginTop: 10,
  },
});

export default LoiMoiKetBan;
