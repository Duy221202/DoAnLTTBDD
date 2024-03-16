import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OA = () => {
  return (
    <View style={styles.body}>
        <View style={styles.banbe}>
          <Pressable
            style={styles.userContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Icon
              name="wifi-outline"
              size={40}
              color="blue"
              style={styles.userIcon}/>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Tìm thêm Official Account</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.nhomdtg}>
            <Text style={styles.text1}>Official Account đã quan tâm</Text>
            <View style={styles.banbe}>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Cộng đồng</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Game</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Zing MP3</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Pay</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.userContainer}
                onPress={() => navigation.navigate('UserProfile')}>
                <Icon
                  name="person-add-outline"
                  size={30}
                  color="blue"
                  style={styles.userIcon}/>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Sticker</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  banbe: {
    flexDirection: 'column', 
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  userIcon: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
    // thanh cắt ngang
  separator: {
    height: 5, // Độ cao của thanh phân cách
    backgroundColor: '#ccc', // Màu sắc của thanh phân cách
    marginVertical: 5, // Khoảng cách dọc giữa các phần
  },
  userMessage: {
    fontSize: 12,
    color: 'gray',
  },
  // Groups
  tinhnangnoibat: {
    flexDirection: 'column',
  },
  noibat: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    marginVertical: 5, // Khoảng cách dọc giữa các icon
    paddingHorizontal: 25, // Khoảng cách ngang giữa biên và icon
  },
  text1:{
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 10,
  },
  iconnoibat: {
    alignItems: 'center', 
    marginRight: 20,
  },
  nhomdtg: {
    flexDirection: 'column',
  },
})

export default OA;

