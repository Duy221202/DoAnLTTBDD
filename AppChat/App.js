import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./src/Screen/Welcome/Welcome";
import Login from "./src/Screen/DangNhap/Login";
import MyTabs from "./src/Screen/Tab/MyTabs";
import Login2 from "./src/Screen/DangNhap/Login2";
import DangKyMail from "./src/Screen/DangKy/DangKyMail";
import DatTenUser from "./src/Screen/DangKy/DatTenUser";
import Dangky from "./src/Screen/DangKy/Dangky";
import Dangky2 from "./src/Screen/DangKy/Dangky2";
import KichhoatTK from "./src/Screen/DangKy/KichhoatTK";
import Quenmatkhau from "./src/Screen/DangKy/Quenmatkhau";
import Maxacthuc from "./src/Screen/DangKy/Maxacthuc";
import XacthucMK from "./src/Screen/DangKy/XacthucMK";
import TaoMK from "./src/Screen/DangKy/TaoMK";

import TinNhan from "./src/Screen/Tab/TinNhan";
import DanhBa1 from "./src/Screen/Tab/DanhBa1";
import KhamPha from "./src/Screen/Tab/KhamPha";
import NhatKy from "./src/Screen/Tab/NhatKy";
import CaNhan from "./src/Screen/Tab/CaNhan";

import ThongTinUser from "./src/Screen/User/ThongTinUser";

import Profile from "./src/Screen/Tab/Profile";
import CaiDat from "./src/Screen/CaiDat/CaiDat";

import Screen1 from "./src/Screen/Tab/Screen1";
import Screen2 from "./src/Screen/Tab/Screen2";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />       
        <Stack.Screen name="Login2" component={Login2} />
        <Stack.Screen name="MyTabs" component={MyTabs} />
        <Stack.Screen name="ThongTinUser" component={ThongTinUser} />
        <Stack.Screen name="DangKyMail" component={DangKyMail} />
        <Stack.Screen name="DatTenUser" component={DatTenUser} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CaiDat" component={CaiDat} />

        {/* <Stack.Screen name="Dangky" component={Dangky} />
        <Stack.Screen name="Dangky2" component={Dangky2} /> */}
        <Stack.Screen name="KichhoatTK" component={KichhoatTK} />
        <Stack.Screen name="Quenmatkhau" component={Quenmatkhau} />
        <Stack.Screen name="Maxacthuc" component={Maxacthuc} />
        <Stack.Screen name="XacthucMK" component={XacthucMK} />
        <Stack.Screen name="TaoMK" component={TaoMK} />

        {/* <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

