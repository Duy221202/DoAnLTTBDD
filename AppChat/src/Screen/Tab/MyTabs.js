import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";

import TinNhan from "./TinNhan";
import DanhBa from "./DanhBa";
import Chat from "../Chat/Chat";
import KhamPha from "./KhamPha";
import NhatKy from "./NhatKy";
import CaNhan from "./CaNhan";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: {
          paddingBottom: 10, // Đảm bảo khoảng cách dưới của thanh tab
          safeAreaInsets: { bottom: 0 } // Đảm bảo không bị chồng lên bởi safe area
        },
      }}
    >
      <Tab.Screen
        name="Tin Nhắn"
        //component={TinNhan}
        component={Chat}
        options={{
          headerShown: false,
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
        //component={DanhBa1}
        component={DanhBa}
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
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        name="Cá Nhân"
        //initialParams={{ name: name, img: img}} // Truyền name, img qua trang CaNhan
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
      {/* <Tab.Screen
        name="Cá Nhân"
        //initialParams={{ name: name, img: img}} // Truyền name, img qua trang CaNhan
        component={Profile}
        // options={{
        //   headerShown: false,
        //   tabBarIcon: ({ focused }) => (
        //     focused ? (
        //       <Icon name="person-circle-outline" size={24} color="blue" />
        //     ) : (
        //       <Icon name="person-circle-outline" size={24} color="#66E86B" />
        //     )
        //   ),
        // }}
      /> */}
    </Tab.Navigator>
  );
}

export default MyTabs;
