import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native'; // Import useRoute

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  ScrollView, 
  SafeAreaView,
  FlatList
} from "react-native";

const TinNhan = () => {
  const navigation = useNavigation();
  // const [input, setInput] = useState("");
  // const handleInputChange = (text) => {
  //   setInput(text);
  // };
  // const [state, SetState] = useState();
  // const truncateName = (name, maxLength) => {
  //   if (name.length > maxLength) {
  //     return name.substring(0, maxLength) + '...';
  //   } else {
  //     return name;
  //   }
  // };

  // const renderItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     <Pressable>
  //       <Image style={styles.image} source={item.img} />
  //       <Text style={styles.text}>{truncateName(item.name, 9)}</Text>
  //     </Pressable>
  //   </View>
  // );

  // useEffect(() => {
  //   navigation.navigate('Chat_Quy');
  // }, []); // Empty dependency array ensures this effect only runs once after initial render

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView>
      {/* Header */}
      <View style={styles.searchContainer}>
          <Pressable >
            <Icon name="search" size={20} color="white" />
          </Pressable>

          <Pressable style={styles.searchInput} onPress={() => navigation.navigate("TimKiem_BanBe")}>
            <Text style={styles.textSearch}>Tìm kiếm</Text>
          </Pressable>
          
          <Icon name="qr-code" size={25} color="white" />
          <Icon name="add" size={30} color="white" style={styles.icon} />
      </View>   

      <View>
        <Pressable style={styles.itemuser} onPress={() => navigation.navigate('Chat_Quy')}>
          <Text style={styles.textnvd}>Nhấn vào đây</Text>
        </Pressable>
      </View>

      {/* <View>
      <FlatList
        data={state}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        // contentContainerStyle={{ flexGrow: 1 }}
      />
      </View> */}
      
      
      {/* <View style={styles.body}>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('DoanChat')}
        >
          <Icon
            name="person-circle-outline"
            size={50}
            color="#66E86B"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Cloud của tôi</Text>
            <Text style={styles.userMessage}>
              Bạn đã nhận được một tin nhắn mới
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.userContainer}
          onPress={() => navigation.navigate('Chat')}
        >
          <Icon
            name="person-circle-outline"
            size={50}
            color="#66E86B"
            style={styles.userIcon}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userMessage}>Hello</Text>
          </View>
        </Pressable>
      </View>
      
      
      <View style={styles.footer}>
        
      </View> */}
      </SafeAreaView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color:"white",
    fontWeight:'500'
  },
  body: {
    paddingHorizontal: 10,
    //paddingVertical: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userMessage: {
    fontSize: 16,
    color: 'gray',
  },
  footer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginLeft: 10,
  },
  textnvd: {
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: "#66E86B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 50,
    borderRadius: 5,
    width: '40%',
  }
});

export default TinNhan;
