import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./src/Screen/Welcome/Welcome";
import Login from "./src/Screen/DangNhap/Login";
import Home from "./src/Components/ScreenWelcome/Home";
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

//import Groups from "./src/Screen/Tab/Groups";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="TinNhan" component={TinNhan} />
        <Stack.Screen name="DanhBa1" component={DanhBa1} />
        {/* <Stack.Screen name="Groups" component={Groups} /> */}
        <Stack.Screen name="KhamPha" component={KhamPha} />
        <Stack.Screen name="NhatKy" component={NhatKy} />
        <Stack.Screen name="CaNhan" component={CaNhan} />
        
        <Stack.Screen name="Dangky" component={Dangky} />
        <Stack.Screen name="Dangky2" component={Dangky2} />
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

