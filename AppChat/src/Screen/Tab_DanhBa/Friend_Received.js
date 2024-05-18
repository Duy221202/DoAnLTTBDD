import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, Alert } from 'react-native';
//import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
//import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, addDoc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";

const Friend_Received = () => {
  // const navigation = useNavigation();
  // const auth = getAuth();
  // const [userFriendsList, setUserFriendsList] = useState([]);

  // const fetchUserFriends = async () => {
  //   try {
  //     const db = getFirestore();
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (user) {
  //       const userDocRef = doc(db, "users", user.uid);
  //       const userDocSnapshot = await getDoc(userDocRef);

  //       if (userDocSnapshot.exists()) {
  //         const userData = userDocSnapshot.data();
  //         const friendsCollectionRef = collection(userDocRef, "friend_Receiveds");

  //         // lắng nghe thay đổi từ firestore
  //         const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
  //           const userFriends = [];
  //           snapshot.forEach((doc) => {
  //             const friend_Receiveds = doc.data();
  //             userFriends.push({
  //               id: doc.id,
  //               name: friend_Receiveds.name_fr,
  //               photoUrl: friend_Receiveds.photoURL_fr,
  //               userId: friend_Receiveds.userId_fr,
  //               UID: friend_Receiveds.UID_fr
  //             });
  //           });
  //           setUserFriendsList(userFriends); // cập nhật danh sách hiện thị
  //         });

  //         return () => unsubscribe(); // hủy việc lắng nghe
  //       } else {
  //         console.error("User document does not exist!");
  //       }
  //     } else {
  //       console.error("No user signed in!");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user friends:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserFriends();
  // }, []);

  // const handleAddFriend = async (friend) => {
  //   try {
  //     const db = getFirestore();
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (user) {
  //       const userDocRef = doc(db, "users", user.uid);
  //       const userDocSnapshot = await getDoc(userDocRef);

  //       if (userDocSnapshot.exists()) {
  //         const userData = userDocSnapshot.data();
  //         const friendData = {
  //           name_fr: friend.name,
  //           photoURL_fr: friend.photoUrl,
  //           userId_fr: friend.userId,
  //           UID_fr: friend.UID
  //         };

  //         // thêm bạn bè vào friendData Firebase will automatically create a unique ID
  //         await addDoc(collection(userDocRef, "friendData"), friendData);

  //         console.log("Friend added successfully!");

  //         // Xóa hồ sơ đã nhận 
  //         const friendReceivedDocRef = doc(userDocRef, "friend_Receiveds", friend.id);
  //         await deleteDoc(friendReceivedDocRef);

  //         console.log("Friend request removed from friend_Receiveds");

  //         // Cập nhật bạn bè vào thông tin người gửi
  //         const friendDocRef = doc(db, "users", friend.UID);
          
  //         const friendDocSnapshot = await getDoc(friendDocRef);
  //         if (friendDocSnapshot.exists()) { 
  //           const friendData = {
  //             name_fr: userData.name,
  //             photoURL_fr: userData.photoURL,
  //             userId_fr: userData.userId,
  //             UID_fr: userData.UID
  //           };
  //           await addDoc(collection(friendDocRef, "friendData"), friendData);
  //           console.log("Profile information added to friendData of the sender");
            
  //           // xóa hồ sơ dã gửi lời mời , từ người gửi
  //           const friendSentCollectionRef = collection(friendDocRef, "friend_Sents");
  //           const friendSentQuery = query(friendSentCollectionRef, where("UID_fr", "==", user.uid));
  //           const friendSentQuerySnapshot = await getDocs(friendSentQuery);
  //           friendSentQuerySnapshot.forEach(async (friendSentDoc) => {
  //             await deleteDoc(friendSentDoc.ref);
  //             console.log("Friend request removed from friend_Sents");
  //           });
  //         } else {
  //           console.error("Friend document does not exist!");
  //         }
          
  //         // Update the friends list after adding a new friend
  //         fetchUserFriends();
  //       } else {
  //         console.error("User document does not exist!");
  //       }
  //     } else {
  //       console.error("No user signed in!");
  //     }
  //   } catch (error) {
  //     console.error("Error adding friend:", error);
  //   }
  // };

  // const renderUserFriendItem = ({ item }) => (
  //   <View style={styles.itemContainer}>
  //     <Pressable>
  //       <Image style={styles.image} source={{ uri: item.photoUrl }} />
  //       <Text style={styles.text}>{item.name}</Text>
  //     </Pressable>
  //     <Pressable style={styles.addButton} onPress={() => handleAddFriend(item)}>
  //       <Text style={styles.addButtonText}>Add Friend</Text>
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
  const [senders, setSenders] = useState({});
  const auth = getAuth();

  // useEffect(() => {
  //   const fetchInvitations = async () => {
  //     try {
  //       const db = getFirestore();
  //       const invitationsRef = collection(db, "invitations");
  //       const q = query(invitationsRef, where("receiverId", "==", auth.currentUser.uid));
  //       const querySnapshot = await getDocs(q);
  //       const invitationsData = [];
  //       querySnapshot.forEach((doc) => {
  //         // Ensure fetched invitations are translated to Vietnamese if stored in English
  //         const status = doc.data().status === "confirmed" ? "đã xác nhận" : "đang chờ";
  //         invitationsData.push({ id: doc.id, ...doc.data(), status });
  //       });
  //       setInvitations(invitationsData);
  //     } catch (error) {
  //       console.error("Error fetching invitations:", error);
  //     }
  //   };

  //   const fetchSenders = async () => {
  //     try {
  //       const db = getFirestore();
  //       const usersRef = collection(db, "users");
  //       const usersSnapshot = await getDocs(usersRef);
  //       const sendersData = {};
  //       usersSnapshot.forEach((doc) => {
  //         sendersData[doc.id] = doc.data();
  //       });
  //       setSenders(sendersData);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchInvitations();
  //   fetchSenders();
  // }, [auth.currentUser.uid]);

  // Hàm để lấy danh sách lời mời kết bạn
  const fetchInvitations = async () => {
    try {
      const db = getFirestore();
      const invitationsRef = collection(db, "invitations");
      const q = query(invitationsRef, where("receiverId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const invitationsData = [];
      querySnapshot.forEach((doc) => {
        // Ensure fetched invitations are translated to Vietnamese if stored in English
        const status = doc.data().status === "confirmed" ? "đã xác nhận" : "đang chờ";
        invitationsData.push({ id: doc.id, ...doc.data(), status });
      });
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  // Hàm để lấy danh sách người gửi
  const fetchSenders = async () => {
    try {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const sendersData = {};
      usersSnapshot.forEach((doc) => {
        sendersData[doc.id] = doc.data();
      });
      setSenders(sendersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchSenders();
  }, [auth.currentUser.uid]);

  const confirmInvitation = async (invitationId) => {
    try {
      const db = getFirestore();
      const invitationRef = doc(db, "invitations", invitationId);
      await updateDoc(invitationRef, { status: "đã xác nhận" });
      console.log("Kết bạn thành công:", invitationId);

      // // Cập nhật trạng thái cục bộ sau khi xác nhận thành công
      // setInvitations(prevInvitations => {
      //   return prevInvitations.map(invitation => {
      //     if (invitation.id === invitationId) {
      //       return { ...invitation, status: "đã xác nhận" };
      //     }
      //     return invitation;
      //   });
      // });

      const invitation = invitations.find(inv => inv.id === invitationId);
      const { senderId, receiverId } = invitation;
      const senderRef = doc(db, "users", senderId);
      const receiverRef = doc(db, "users", receiverId);

      await updateDoc(senderRef, {
        friends: {
          ...senders[senderId]?.friends,
          [receiverId]: true
        }
      });

      await updateDoc(receiverRef, {
        friends: {
          ...senders[receiverId]?.friends,
          [senderId]: true
        }
      });
      // Hiển thị thông báo alert khi kết bạn thành công
      Alert.alert("Kết bạn thành công");

      // Cập nhật lại danh sách lời mời và người gửi để cập nhật giao diện
      await fetchInvitations();
      await fetchSenders();

    } catch (error) {
      console.error("Error confirming invitation:", error);
    }
  };

  return (
    <View style={styles.container}>
      {invitations.length === 0 ? (
        <Text style={styles.emptyList}>Danh sách trống</Text>
      ) : (
        <View style={styles.invitationList}>
          {invitations.map((invitation) => (
            <View key={invitation.id} style={styles.invitationItem}>
              <Image
                source={{ uri: senders[invitation.senderId]?.photoURL }}
                style={styles.image}
              />
              <Text style={{ fontSize: 13}}>Trạng thái: {invitation.status}{" "}</Text>
              <View style={styles.textContainer}>
                {/* <Text style={{ fontSize: 12}}>Trạng thái: {invitation.status}{" "}</Text> */}
                <Text style={{ fontSize: 15}}>{senders[invitation.senderId]?.name}</Text>
                {invitation.status === "đang chờ" && ( 
                  <Pressable
                    style={styles.addButton}
                    onPress={() => confirmInvitation(invitation.id)}
                  >
                    <Text style={styles.addbuttonText}>Xác nhận</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  // itemContainer: {
  //   marginTop: 20,
  //   flex: 1,
  //   margin: 20,
  // },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  // text: {
  //   marginTop: 10,
  // },
  addButton: {
    backgroundColor: '#006AF5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  emptyList: {
    fontSize: 16,
    textAlign: 'justify',
  },
  invitationList: {
    flexDirection: 'column',
  },
  invitationItem: {
    flexDirection: 'column',
    //alignItems: 'center',
    marginBottom: 25,
    marginLeft: 30,
  },
  textContainer: {
    marginTop: 10,
    width: "50%",
    flexDirection: 'column',  // Đặt các thành phần text theo chiều dọc
  },
});

export default Friend_Received;
