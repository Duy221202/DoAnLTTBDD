import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, StatusBar, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../../config/firebase';
import { useRoute } from '@react-navigation/native'; // Import useRoute

export default function DatTenUser({ navigation}) {
  const [name, setName] = useState('');
  const db = getFirestore();
  const route = useRoute(); // Sử dụng useRoute để lấy route params
  const { email, pass } = route.params;
  
  const onHandleSignup = () => {
    if (name !== '') {
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        // Lưu tên người dùng vào Firestore
        setDoc(doc(db, "users", auth.currentUser.uid), {
          name: name,
          userId: email // Sử dụng email từ params
        }).then(() => {
          // console.log('Chuyển hướng đến TinNhan');
          alert(
            'Signup success',
            'You have signed up successfully!',
            [{ text: 'OK'}]
          //);navigation.navigate('TinNhan');
          );navigation.navigate('Profile');
        }).catch((error) => {
          console.log("Error adding document: ", error);
        });
      }).catch((error) => {
        console.log("Update profile error: ", error);
      });
    } else {
    alert("Name is required", "Please enter your name.");
    }
  };

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
          <Text style={styles.TaoTK}>Tạo tài khoản</Text>
      </View>

      <View style={styles.view2}>
        <Text style={styles.text1}>Tên Zalo</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => setName(text)}>
        </TextInput>
        
      </View>
      
      <View style={styles.view3}>
        <Text style={styles.textNote}>Lưu ý khi đặt tên</Text>
        <View style={styles.view3_1}>
          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Không vi phạm <Text style={styles.blueText}>Quy định đặt tên trên Zalo</Text></Text>
          </Text>

          <Text style={styles.textNote1}>
            <Icon name="ellipse" size={16} color="black" />
            <Text> Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
          </Text>
        </View>
      </View>

      <View style={styles.view4}>
        <Pressable style={styles.PreDK} onPress={() => onHandleSignup()}>
          <Text style={styles.textNext}>Tiếp tục</Text>
        </Pressable>
      </View>

      <View style={styles.view5}>
        <Text style={styles.textdieukhoan}>
          <Text> Tiếp tục nghĩa là bạn đồng ý với các </Text> 
          <Text style={[styles.textdieukhoan, styles.blueText]}>
            Điều khoản sử dụng Zalo
          </Text>
        </Text>
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
  TaoTK: {
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
  view2: {
    flexDirection: 'column',
  },
  text1: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
  },
  input: {
    height: 50,
    width: 380,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18,
    marginLeft: 10,
  },
  view3: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  textNote: {
    fontSize: 18,
  },
  view3_1: {
    marginTop: 15,
  },
  textNote1: {
    fontSize: 16,
    marginBottom: 15,
  },
  blueText: {
    color: 'blue',
    fontWeight: '400',
  },
  view4: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
    textAlign: "center",
  },
  PreDK: {
    margin: 40,
    backgroundColor: "#66E86B",
    height: 50,
    width: 230,
    borderRadius: 20,
    padding: 10,
  },
  view5: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },  
  textdieukhoan: {
    fontSize: 16,
    textAlign: 'center',
  },
});


// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable, StatusBar, Alert } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";
// import { imgDB,nameDB } from "../../../config/firebase";
// import { v4 } from "uuid";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { auth } from '../../../config/firebase';
// import Modal from "react-native-modal";

// function DatTenUser({ route }) {
//   const navigation = useNavigation();
//   const [name,setName] = useState('')
//   const [img,setImg] = useState('')
//   const [data,setData] = useState([])
//   const { email, pass } = route.params;
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // State để lưu URL của ảnh đã được upload

//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const toggleModal = () => {
//     setIsModalVisible(!isModalVisible);
//   };

//   // const handleUpload = (e) =>{
//   //   console.log(e.target.files[0])
//   //   const imgs = ref(imgDB,`Imgs/${v4()}`)
//   //   uploadBytes(imgs,e.target.files[0]).then(data=>{
//   //   console.log(data,"imgs")
//   //     getDownloadURL(data.ref).then(val=>{
//   //       setImg(val)
//   //     })
//   //   })
//   // }

//   // const handleInputChange = (e) => {
//   //   const file = e.target.files[0];
//   //   setImg(file);
//   //   const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho tập tin vừa chọn
//   //   setUploadedImageUrl(imageUrl); // Lưu URL của ảnh vào state để hiển thị
//   //   console.log('Tải ảnh thành công');
//   // };

//   const handleInputChange = async (e) => {
//     const file = e.target.files[0]; 
//     setImg(file);
//     const imgs = ref(imgDB, `Imgs/${v4()}`);

//     try {
//       await uploadBytes(imgs, file) // Upload tệp lên storage
//       .then(data=>{
//         getDownloadURL(data.ref).then(val=>{
//           setImg(val)
//         })
//       })
//       // Lấy URL của ảnh từ storage và cập nhật state
//       const imageUrl = await getDownloadURL(imgs);
//       setUploadedImageUrl(imageUrl);
//       console.log('Tải ảnh thành công');
//     } catch (error) {
//       console.error('Lỗi khi tải ảnh:', error);
//       // Xử lý lỗi (ví dụ: hiển thị cảnh báo cho người dùng)
//       alert('Lỗi! Đã xảy ra lỗi khi tải ảnh lên server.');
//     }
//   };

//   const handleClick = async () =>{
//     const valRef = collection(nameDB,'users') 
//       toggleModal();
//       //alert("Data added successfully")
//       await addDoc(valRef,{userId: email, name:name, img:img })  /// thêm email
//         alert(
//           'Signup success',
//           'You have signed up successfully!',
//           [{ text: 'OK'}]
//     );navigation.navigate('MyTabs', { name: name, img: img });
//   }

//   const getData = async () =>{
//       const valRef = collection(nameDB,'NameData')
//       const dataDb = await getDocs(valRef)
//       const allData = dataDb.docs.map(val=>({...val.data(),id:val.id}))
//       setData(allData)
//       console.log(dataDb)
//   }

//   useEffect(()=>{
//       getData()
//   }, []);

//   return(
//     <View style={styles.container}>
//       <View style={styles.view1}>
//             <Pressable
//             onPress={() => {
//                 navigation.goBack();
//             }}>
//               <View style={styles.iconback}>
//                   <Icon name="chevron-back" size={25} color="white" />
//               </View>
//             </Pressable>
//           <Text style={styles.TaoTK}>Tạo tài khoản</Text>
//       </View>

//       <View style={styles.view2}>
//         <Text style={styles.text1}>Tên Zalo</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your name"
//           autoCapitalize="words"
//           value={name}
//           onChangeText={(text) => setName(text)}>   
//         </TextInput>
        
//       </View>
      
//       <View style={styles.view3}>
//         <Text style={styles.textNote}>Lưu ý khi đặt tên</Text>
//         <View style={styles.view3_1}>
//           <Text style={styles.textNote1}>
//             <Icon name="ellipse" size={16} color="black" />
//             <Text> Không vi phạm <Text style={styles.blueText}>Quy định đặt tên trên Zalo</Text></Text>
//           </Text>

//           <Text style={styles.textNote1}>
//             <Icon name="ellipse" size={16} color="black" />
//             <Text> Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
//           </Text>
//         </View>
//       </View>

//       <View style={styles.view4}>
//         <Pressable style={styles.PreDK} onPress={() => onHandleSignup()}>
//           <Text style={styles.textNext}>Tiếp tục</Text>
//         </Pressable>
//       </View>

//       <View style={styles.view5}>
//         <Text style={styles.textdieukhoan}>
//           <Text> Tiếp tục nghĩa là bạn đồng ý với các </Text> 
//           <Text style={[styles.textdieukhoan, styles.blueText]}>
//             Điều khoản sử dụng Zalo
//           </Text>
//         </Text>
//       </View>

//       {/* Body */}
//       <View style={styles.body}>
//         <View style={styles.cutLine}></View>

//         <View style={styles.avatarContainer}>
//           <TouchableOpacity onPress={toggleModal} style={styles.iconContainer2}>
//             <View style={styles.iconCircle}>
//               {uploadedImageUrl ? (
//                 <Image source={{ uri: uploadedImageUrl }} style={styles.iconCircle} />
//               ) : (
//                 <Icon name="camera-outline" size={35} color="black"/>
//               )}
//             </View>
//           </TouchableOpacity>

//         </View>
//       </View>

//       {/* Modal */}
//       <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
//         <View style={styles.modalButtonContainer}>
//           <TouchableOpacity style={styles.modalButton}>
//           <input type="file" onChange={handleInputChange} style={styles.chooseimg}/>
//             <Text style={styles.modalButtonText}>Chọn ảnh</Text>
//           </TouchableOpacity>

//           {uploadedImageUrl && (
//               <View style={styles.uploadedImage} >
//                 <Image source={{ uri: uploadedImageUrl }} style={styles.uploadedImage2} />
//               </View>
//             )}

//           <TouchableOpacity onPress={handleClick} style={styles.modalButton}>
//            <Text style={styles.modalButtonText}>Upload</Text>
//           </TouchableOpacity>

//         </View>
//       </Modal>
      
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   view1: {
//     flexDirection: "row",
//     backgroundColor: "#66E86B",
//   },
//   TaoTK: {
//     marginLeft: 10,
//     marginTop: 10,
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: 'white',
//   },
//   iconback: {
//     marginTop: 15,
//     height: 20,
//     width: 20,
//   },
//   view2: {
//     flexDirection: 'column',
//   },
//   text1: {
//     fontSize: 22,
//     marginLeft: 10,
//     marginTop: 10,
//   },
//   input: {
//     height: 50,
//     width: 380,
//     borderColor: "gray",
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     fontSize: 18,
//     marginLeft: 10,
//   },
//   view3: {
//     flexDirection: 'column',
//     marginLeft: 15,
//   },
//   textNote: {
//     fontSize: 18,
//   },
//   view3_1: {
//     marginTop: 15,
//   },
//   textNote1: {
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   blueText: {
//     color: 'blue',
//     fontWeight: '400',
//   },
//   view4: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textNext: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ffff",
//     textAlign: "center",
//   },
//   PreDK: {
//     margin: 40,
//     backgroundColor: "#66E86B",
//     height: 50,
//     width: 230,
//     borderRadius: 20,
//     padding: 10,
//   },
//   view5: {
//     position: 'absolute',
//     bottom: 0,
//     marginBottom: 10,
//   },  
//   textdieukhoan: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   //
//   //
//   body: {
//     flex: 1,
//     alignItems: "center",
//   },
//   cutLine: {
//     width: "100%",
//     height: 1,
//     backgroundColor: "black",
//     position: "absolute",
//     top: "38%",
//   },
//   avatarContainer: {
//     alignItems: "center",
//     position: "absolute",
//     top: "22%",
//   },
//   iconContainer2: {
//     position: 'absolute',
//   },
//   iconCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor: 'white', 
//     borderWidth: 5,
//   },
//   // Modal
//   modalButtonContainer: {
//     flexDirection: 'column',
//   },
//   modalButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 50,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center', // Canh giữa văn bản
//   },
//   // footer
//   footer: {
//     flex: 1,
//   },
//   uploadimg: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   chooseimg: {
//     width: "27%",
//     height: 25,
//     borderRadius: 20,
//     backgroundColor: '#ccc',
//   },
//   uploadButton: {
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   uploadText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   uploadedImage: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadedImage2: {
//     width: 200,
//     height: 200,
//   },
// });
// export default DatTenUser;