import React, { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BanBe from '../Tab_DanhBa/BanBe';
import Nhom from '../Tab_DanhBa/Nhom';
import OA from '../Tab_DanhBa/OA';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const DanhBa = () => {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.searchContainer}>
          <Pressable >
            <Icon name="search" size={20} color="white" />
          </Pressable>

          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_BanBe")}>
            <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          
          <Icon name="person-add-outline" size={25} color="white" />
        </View>   

        <Tab.Navigator>
          <Tab.Screen name="Bạn bè" component={BanBe} />
          <Tab.Screen name="Nhóm" component={Nhom} />
          {/* <Tab.Screen name="OA" component={OA} /> */}
        </Tab.Navigator>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
});

export default DanhBa;