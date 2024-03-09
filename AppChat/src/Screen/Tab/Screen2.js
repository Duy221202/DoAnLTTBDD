import React, { useEffect, useState } from "react";
import {StyleSheet,View,Text,Image,TextInput,Pressable,Alert,} from "react-native";


 const Screen1 = ({ navigation, route }) => {
  const [name, setUser] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
       const data = await (
        await fetch("https://654460405a0b4b04436c4cda.mockapi.io/user")
      ).json();

      // set state when the data received
      setData(data);
    };

    dataFetch();
  }, []);

  return (
    <View style={styles.container}>
      
      <View style={{backgroundColor:'limegreen',flexDirection:'row',width:'400px',height:'50px',alignItems:"center",justifyContent:"center"}}>
            <Image source={require("../../IMG/search2.png")} style={{width:35, height:35,alignItems:"flex-start",justifyContent:"flex-start",left:"-10px"}}/>
            <TextInput style={{width:240,height:35, color:"grey",fontSize:"16px"}} placeholder="Tim Kiem"></TextInput>
            <Image source={require("../../IMG/pen.png")} style={{width:35, height:35,}}/>
            <Image source={require("../../IMG/ringing.png")} style={{width:35, height:35,left:"10px"}}/>
      </View>

      <View style={{alignItems:"center"}}>
        <View style={{flexDirection:"row",alignItems:"center"}}>
        <Image source={require('../../IMG/shogun.png')} style={{width:125,height:150,left:"-30px"}}/>
        <Text style={{fontSize:16,fontWeight:"0",color:"grey",left:"-30px"}}>Hôm nay bạn thế nào ?</Text>
        </View>

        <View style={{flexDirection:"row",justifyContent:"space-between",width:"90%"}}>
        <View style={{flexDirection:"row",alignItems:"center", backgroundColor:"lightgrey",borderRadius:"10px",width:"110px",justifyContent:"center"}}>
           <Image source={require("../../IMG/picture.png")} style={{width:25, height:25,}}/>
           <Text> Đăng ảnh</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:"center", backgroundColor:"lightgrey",borderRadius:"10px",width:"110px",justifyContent:"center"}}>
           <Image source={require("../../IMG/video-player.png")} style={{width:20, height:20,}}/>
           <Text> Đăng video</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:"center", backgroundColor:"lightgrey",borderRadius:"10px",width:"110px",justifyContent:"center"}}>
           <Image source={require("../../IMG/photo-album.png")} style={{width:25, height:25,}}/>
           <Text> Tạo album </Text>
        </View>
      </View>

      <Text>   </Text>
      <View style={{width:"100%", height:16,backgroundColor:"lightgrey", borderRadius:"0px"}}></View>

      </View>
      <Text>   </Text>
      <Text>     Khoảnh khắc</Text>
      <View style={{}}>
          <Image source={require('../../IMG/shogun.png')} style={{width:125,height:150,left:""}}/>
      </View>
      <View style={{width:"100%", height:20,backgroundColor:"lightgrey", borderRadius:"0px"}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
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
