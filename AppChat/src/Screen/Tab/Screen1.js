import React, { useEffect, useState } from "react";
import {StyleSheet,View,Text,Image,TextInput,Pressable,Alert, FlatList,} from "react-native";

const array =[
    {
      icon:require('../../IMG/shop.png'),
      name:'Shop'
    },
    {
      icon:require('../../IMG/assets.png'),
      name:'Home and Car'
    },
    {
      icon:require('../../IMG/smile.png'),
      name:'Sticker'
    },
    {
      icon:require('../../IMG/palace.png'),
      name:'Egovernment'
    },
    {
      icon:require('../../IMG/credit-card.png'),
      name:'credit-card'
    },
    {
      icon:require('../../IMG/transfer.png'),
      name:'transfer'
    },
    {
      icon:require('../../IMG/bill.png'),
      name:'Hóa đơn'
    },
    {
      icon:require('../../IMG/application.png'),
      name:'App'
    },
    {
      icon:require('../../IMG/job.png'),
      name:'Job'
    },
    {
      icon:require('../../IMG/video-camera.png'),
      name:'Xem flim'
    },
]


 const Screen1 = ({ navigation, route }) => {
  const [name, setUser] = useState();
  const [data, setData] = useState([]);
  const [state,setState] = React.useState(array)


  return (
    <View style={styles.container}>
        <View style={{backgroundColor:'limegreen',flexDirection:'row',width:'400px',height:'50px',alignItems:"center",justifyContent:"center"}}>
            <Image source={require("../../IMG/search2.png")} style={{width:35, height:35,alignItems:"flex-start",justifyContent:"flex-start",left:"-30px"}}/>
            <TextInput style={{width:240,height:35, color:"grey",fontSize:"16px"}} placeholder="Tim Kiem"></TextInput>
            <Image source={require("../../IMG/qr-code.png")} style={{width:35, height:35,}}/>
        </View> 
        
          <Text style={{fontSize:"16px"}}> tiện ích cho bạn </Text>
        <View>
        <View style={{width:"100%"}}>
          <FlatList
        numColumns={4}
        data={state}
        style={{width:"480px"}}
        renderItem={({ item }) => {
          return(
            <View style={{flexDirection:"column",backgroundColor:"",justifyContent:"space-between", width:90,alignItems:"center"}}> 
            
              <Image source={item.icon}
                      style={{width:'35px',height:'35px', backgroundColor:"lightgrey",borderRadius:"10px"}}/>
              <Text style={{justifyContent:"center", textAlign:"center"}}>{item.name}</Text>
            </View>
          )
        }}
        />
        </View>

        <View style={{width:"100%", height:10,backgroundColor:"grey", borderRadius:"5px"}}></View>

        <View style={{flexDirection:"row"}}>
        <Image source={require('../../IMG/lottery-game.png')} style={{width:20,height:20}}/>
        <Text>  Dò vé sổ số </Text>
        <Text style={{color:"grey"}}>  * Miền nam</Text>
        </View>

        <View style={{justifyContent:"center",alignItems:"center"}}>
        <View style={{width:"80%", height:120,backgroundColor:"mistyrose",borderRadius:"5px" , justifyContent:"center"}}>
          <View style={{flexDirection:"row"}}>
              <Image source={require("../../IMG/fire.png")} style={{width:20,height:20}}/>
              <Text style={{color:"red"}}>Xem chi tiết kết quả hôm nay  </Text>
          </View >
          <View style={{justifyContent:"space-between"}}>
            <View style={{justifyContent:"space-between", flexDirection:"row",alignItems:"stretch"}}>
            <Text style={{color:"",fontSize:20}}> Đà lạt </Text>
            <Text style={{color:"red",fontSize:20}}> 030202 </Text>
            </View>
            <View style={{justifyContent:"space-between", flexDirection:"row",alignItems:"stretch"}}>
            <Text style={{color:"",fontSize:20}}> Kiên Giang  </Text>
            <Text style={{color:"red",fontSize:20,textAlign:"justify"}}> 024122 </Text>
            </View>
            <View style={{justifyContent:"space-between", flexDirection:"row",alignItems:"stretch"}}>
            <Text style={{color:"",fontSize:20}}> Tiền Giang </Text>
            <Text style={{color:"red",fontSize:20}}> 024122 </Text>

            </View>
          </View>
        </View>

        </View>

        </View >
        
        <View style={{width:"100%", height:20,backgroundColor:"grey", borderRadius:"0px"}}></View>


        <View style={{flexDirection:"row"}}>
        <Image source={require('../../IMG/calendar.png')} style={{width:20,height:20}}/>
        <Text> Lịch Việt </Text>
        <Text style={{color:"grey"}}>  * Xem lịch tháng</Text>
        </View>

        <View style={{alignItems:"center"}}>
        <View style={{width:"80%", height:120,backgroundColor:"mistyrose",borderRadius:"10px",flexDirection:"row", justifyContent:"space-evenly"}}>
            <View style={{width:"30%",alignItems:"center",justifyContent:"center"}}>
              <Text style={{fontSize:17}}> Thứ 3</Text>
              <Text style={{fontSize:18, color:"green",fontWeight:"700"}}> 27 </Text>
              <Text style={{fontSize:16}}>Tháng 2</Text>
              <Text style={{fontSize:17}}> 2024</Text>
            </View>
            <View style={{width:"70%",alignItems:"flex-start",backgroundColor:"lightgray",justifyContent:"center"}}>
              <Text style={{fontSize:17}}> Ngày 19 tháng 1 </Text>
              <Text style={{fontSize:18, color:"green",fontWeight:"700"}}> </Text>
              <Text style={{fontSize:16}}>Năm Giáp Thìn</Text>
              <Text style={{fontSize:17}}> ( Âm lịch )</Text>
            </View>
        
        </View>
        </View>

        <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between"}}>
          <View style={{flexDirection:"column",width:"20%",alignItems:"center"}}>
          <Image source={require('../../IMG/chat-bubble.png')} style={{width:30,height:30}}/>
          <Text style={{textAlign:"center"}}>Tin Nhan</Text>
          </View>
          <View style={{flexDirection:"column",width:"20%",alignItems:"center"}}>
          <Image source={require('../../IMG/phonebook.png')} style={{width:30,height:30}}/>
          <Text style={{textAlign:"center"}}>Danh bạ</Text>
          </View>
          <View style={{flexDirection:"column",width:"20%",alignItems:"center"}}>
          <Image source={require('../../IMG/data-discovery.png')} style={{width:30,height:30}}/>
          <Text style={{textAlign:"center"}}>Khám phá</Text>
          </View>
          <View style={{flexDirection:"column",width:"20%",alignItems:"center"}}>
          <Image source={require('../../IMG/clock.png')} style={{width:30,height:30}}/>
          <Text style={{textAlign:"center"}}>Nhật kí</Text>
          </View>
          <View style={{flexDirection:"column",width:"20%",alignItems:"center"}}>
          <Image source={require('../../IMG/user.png')} style={{width:35,height:35}}/>
          <Text style={{textAlign:"center"}}>Cá nhân</Text>
          </View>
        </View>

      <View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    marginTop: 50,
  },
  view1: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  view2: {
    marginTop: 50,
  },
  img: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  img1: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    position: "absolute",
    left: 20,
  },
  img2: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  text: {
    fontSize: 24,
    fontWeight: 700,
    width: 300,
    textAlign: "center",
  },
  textIn: {
    width: 330,
    height: 50,
    fontSize: 20,
    fontWeight: 500,
    paddingLeft: 70,
    padding: 10,
    backgroundColor: "#D2E3C8",
    borderRadius: 20,
    color: "#F875AA",
  },
  Pre: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "blue",
    width: 230,
    height: 50,
    borderRadius: 20,
  },
  textPre: {
    fontSize: 20,
    fontWeight: 200,
    color: "#fff",
  },
});
export default Screen1;
