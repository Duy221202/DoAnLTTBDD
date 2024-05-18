import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./src/Screen/Welcome/Welcome";
import MyTabs from "./src/Screen/Tab/MyTabs";
import Login2 from "./src/Screen/DangNhap/Login2";
import DangKyMail from "./src/Screen/DangKy/DangKyMail";
import DatTenUser from "./src/Screen/DangKy/DatTenUser";
import Quenmatkhau from "./src/Screen/DangKy/Quenmatkhau";
import ThongTinUser from "./src/Screen/User/ThongTinUser";
import Profile from "./src/Screen/Tab/Profile";
import CaiDat from "./src/Screen/CaiDat/CaiDat";

import TimKiem_BanBe from "./src/Screen/Tab_DanhBa/TimKiem_BanBe";
import TimKiem_Chat from "./src/Screen/Tab_DanhBa/TimKiem_Chat";
import LoiMoiKetBan from "./src/Screen/Tab_DanhBa/LoiMoiKetBan";

import BanBe from "./src/Screen/Tab_DanhBa/BanBe";
import Chat from "./src/Screen/Chat/Chat";
import Chat_fr from "./src/Screen/Chat/Chat_fr";

import ThongTin from "./src/Screen/User/ThongTin";

import DangKy from "./src/Screen/DangKy/DangKy";
import PlayVideo from "./src/Screen/Chat/PlayVideo";

import GroupChat from "./src/Screen/Chat/GroupChat";
import NhomDuy from "./src/Screen/Tab_DanhBa/NhomDuy";
import TaoNhomDuy from "./src/Screen/Tab_DanhBa/TaoNhomDuy";
import DanhSachNhom from "./src/Screen/Tab_DanhBa/DanhSachNhom";

import ChatNhom from "./src/Screen/Chat/ChatNhom";

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
        {/* <Stack.Screen name="DatTenUser" component={DatTenUser} /> */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CaiDat" component={CaiDat} />
        <Stack.Screen name="TimKiem_BanBe" component={TimKiem_BanBe} />
        <Stack.Screen name="TimKiem_Chat" component={TimKiem_Chat} />
        <Stack.Screen name="LoiMoiKetBan" component={LoiMoiKetBan} />
        
        <Stack.Screen name="Quenmatkhau" component={Quenmatkhau} />
        
        <Stack.Screen name="BanBe" component={BanBe} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Chat_fr" component={Chat_fr} />

        <Stack.Screen name="ThongTin" component={ThongTin} />

        <Stack.Screen name="DangKy" component={DangKy} />

        <Stack.Screen name="PlayVideo" component={PlayVideo} />

        <Stack.Screen name="GroupChat" component={GroupChat} />
        <Stack.Screen name="NhomDuy" component={NhomDuy} />
        <Stack.Screen name="TaoNhomDuy" component={TaoNhomDuy} />
        <Stack.Screen name="DanhSachNhom" component={DanhSachNhom} />

        <Stack.Screen name="ChatNhom" component={ChatNhom} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

