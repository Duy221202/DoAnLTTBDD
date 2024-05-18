import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, deleteDoc , writeBatch, onSnapshot } from "firebase/firestore";

const Friend_Sent = () => {
  // const navigation = useNavigation();
  // const auth = getAuth();
  // const [userFriendsList, setUserFriendsList] = useState([]);

  // useEffect(() => {
  //   const fetchUserFriends = async () => {
  //     try {
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  
  //       if (user) {
  //         const userDocRef = doc(db, "users", user.uid);
  
  //         const unsubscribe = onSnapshot(userDocRef, async (userDocSnapshot) => {
  //           if (userDocSnapshot.exists()) {
  //             const userData = userDocSnapshot.data();
  
  //             // Thực hiện truy vấn để lấy danh sách gửi lời mời kết bạn
  //             const friendsCollectionRef = collection(db, "users", user.uid, "friend_Sents");
  //             const friendsQuery = query(friendsCollectionRef);
              
  //             const unsubscribeFriends = onSnapshot(friendsQuery, async (friendsSnapshot) => {
  //               const userFriends = [];
  //               const batch = writeBatch(db);
  
  //               for (const friendDoc of friendsSnapshot.docs) {
  //                 const friend_Sents = friendDoc.data();
  
  //                 const friendUID = friend_Sents.UID_fr;
                  
  //                 // truy cập dữ liệu firestore của friendData
  //                 const friendDataRef = collection(db, "users", user.uid, "friendData");
  //                 const friendDataQuery = query(friendDataRef, where("UID_fr", "==", friendUID));
  //                 const friendDataSnapshot = await getDocs(friendDataQuery);
  
  //                 if (!friendDataSnapshot.empty) {
  //                   // Nếu UID_fr tồn tại trong friendData, xóa nó từ friend_Sents
  //                   batch.delete(friendDoc.ref);
  //                 } else {
  //                   // Nếu không, thêm vào mảng userFriends
  //                   userFriends.push({
  //                     id: friendDoc.id,
  //                     name: friend_Sents.name_fr,
  //                     photoUrl: friend_Sents.photoURL_fr,
  //                     userId: friend_Sents.userId_fr,
  //                     UID: friend_Sents.UID_fr
  //                   });
  //                 }
  //               }
  
  //               // Thực hiện các thao tác ghi trong batch
  //               await batch.commit();
  
  //               setUserFriendsList(userFriends);
  //             });
  
  //             return () => {
  //               unsubscribeFriends();
  //             };
  //           } else {
  //             console.error("Tài liệu người dùng không tồn tại!");
  //           }
  //         });
  
  //         return () => unsubscribe();
  //       } else {
  //         console.error("Không có người dùng nào đăng nhập!");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi tìm nạp bạn bè của người dùng!", error);
  //     }
  //   };
  
  //   fetchUserFriends();
  // }, []);
  

  // const renderUserFriendItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     <Pressable>
  //       <Image style={styles.image} source={{ uri: item.photoUrl }} />
  //       <Text style={styles.text}>{item.name}</Text>
  //     </Pressable>
  //   </View>
  // );

  // return (
  //   <View style={styles.container}>
  //     <SafeAreaView>
  //       <View>
  //         <FlatList
  //           data={userFriendsList}
  //           renderItem={renderUserFriendItem}
  //           keyExtractor={(item) => item.id}
  //         />
  //       </View>
  //     </SafeAreaView>
  //   </View>
  // );


  const [invitations, setInvitations] = useState([]);
  const [receivers, setReceivers] = useState({});

  const auth = getAuth(); // Lấy thông tin xác thực của người dùng hiện tại
  
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const db = getFirestore();
        const invitationsRef = collection(db, "invitations");
        const q = query(invitationsRef, where("senderId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const invitationsData = [];
        querySnapshot.forEach((doc) => {
          invitationsData.push({ id: doc.id, ...doc.data() });
        });
        setInvitations(invitationsData);
      } catch (error) {
        console.error("Lỗi khi lấy lời mời:", error);
      }
    };

    const fetchReceivers = async () => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const receiversData = {};
        usersSnapshot.forEach((doc) => {
          receiversData[doc.id] = doc.data();
        });
        setReceivers(receiversData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchInvitations();
    fetchReceivers();
  }, [auth.currentUser.uid]);

  // Function to translate status to Vietnamese
  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "đang chờ";
      case "confirmed":
        return "đã xác nhận";
      case "declined":
        return "đã từ chối";
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Lời mời đã gửi:</Text> */}
      <View style={styles.invitationList}>
        {invitations.map((invitation) => (
          <View key={invitation.id} style={styles.invitationItem}>
            <Image
              source={{ uri: receivers[invitation.receiverId]?.photoURL }}
              style={styles.image}
            />
            <Text style={{ fontSize: 15, marginTop: 5 }}>
              {receivers[invitation.receiverId]?.name}: {translateStatus(invitation.status)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 15,
  },
  /////////
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invitationList: {
    flexDirection: 'column',
  },
  invitationItem: {
    flexDirection: 'column',
    //alignItems: 'center',
    marginBottom: 25,
    marginLeft: 30
  },
});

export default Friend_Sent;
