import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.view1}>
            <Pressable
            onPress={() => {
                navigation.goBack();
            }}>
              <View style={styles.iconback}>
                  <Icon name="chevron-back" size={25} color="white" />
              </View>
            </Pressable>
          <Text style={styles.textHome}>Home</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    flexDirection: "row",
    backgroundColor: "#66E86B",
  },
  textHome: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: 'white',
  },
  iconback: {
    marginTop: 15,
    height: 20,
    width: 20,
  },
});

export default Home;