import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./src/Screen/Welcome/Welcome";
import MyTabs from "./src/Screen/Tab/MyTabs";
import Login2 from "./src/Screen/DangNhap/Login2";
import DangKyMail from "./src/Screen/DangKy/DangKyMail";
import DatTenUser from "./src/Screen/DangKy/DatTenUser";
import KichhoatTK from "./src/Screen/DangKy/KichhoatTK";
import Quenmatkhau from "./src/Screen/DangKy/Quenmatkhau";
import Maxacthuc from "./src/Screen/DangKy/Maxacthuc";
import XacthucMK from "./src/Screen/DangKy/XacthucMK";
import TaoMK from "./src/Screen/DangKy/TaoMK";
import ThongTinUser from "./src/Screen/User/ThongTinUser";

import Profile from "./src/Screen/Tab/Profile";
import CaiDat from "./src/Screen/CaiDat/CaiDat";

import TimKiem_BanBe from "./src/Screen/Tab_DanhBa/TimKiem_BanBe";
import LoiMoiKetBan from "./src/Screen/Tab_DanhBa/LoiMoiKetBan";

import DoanChat from "./src/Screen/Chat/DoanChat";

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
        <Stack.Screen name="TimKiem_BanBe" component={TimKiem_BanBe} />
        <Stack.Screen name="LoiMoiKetBan" component={LoiMoiKetBan} />
        <Stack.Screen name="DoanChat" component={DoanChat} />

        {/* <Stack.Screen name="DanhBa1" component={DanhBa1} /> */}

        <Stack.Screen name="KichhoatTK" component={KichhoatTK} />
        <Stack.Screen name="Quenmatkhau" component={Quenmatkhau} />
        <Stack.Screen name="Maxacthuc" component={Maxacthuc} />
        <Stack.Screen name="XacthucMK" component={XacthucMK} />
        <Stack.Screen name="TaoMK" component={TaoMK} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

