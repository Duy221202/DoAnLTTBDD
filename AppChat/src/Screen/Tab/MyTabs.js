import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";
import {  StyleSheet } from "react-native";

import TinNhan from "./TinNhan";
import DanhBa1 from "./DanhBa1";
import KhamPha from "./KhamPha";
import NhatKy from "./NhatKy";
import CaNhan from "./CaNhan";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        // tabBarStyle: {
        //   marginTop: 10, // Điều chỉnh khoảng cách từ thanh tab đến đáy màn hình
        // },
      }}
    >
      <Tab.Screen
        name="Tin Nhắn"
        component={TinNhan}
        options={{
          headerShown: false,
          //tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Icon name="chatbubbles-outline" size={24} color="blue" />
            ) : (
              <Icon name="chatbubbles-outline" size={24} color="#66E86B" />
            )
          ),
        }}
      />
      <Tab.Screen
        name="Danh Bạ"
        component={DanhBa1}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Icon name="person-outline" size={24} color="blue" />
            ) : (
              <Icon name="person-outline" size={24} color="#66E86B" />
            )
          ),
        }}
      />
      <Tab.Screen
        name="Khám Phá"
        component={KhamPha}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Icon name="apps" size={24} color="blue" />
            ) : (
              <Icon name="apps" size={24} color="#66E86B" />
            )
          ),
        }}
      />
      <Tab.Screen
        name="Nhật Ký"
        component={NhatKy}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Icon name="book-outline" size={24} color="blue" />
            ) : (
              <Icon name="book-outline" size={24} color="#66E86B" />
            )
          ),
        }}
      />
      <Tab.Screen
        name="Cá Nhân"
        component={CaNhan}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Icon name="person-circle-outline" size={24} color="blue" />
            ) : (
              <Icon name="person-circle-outline" size={24} color="#66E86B" />
            )
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    // Adjust the margin from the bottom of the screen
    marginTop: 10,
  },
});

export default MyTabs;
