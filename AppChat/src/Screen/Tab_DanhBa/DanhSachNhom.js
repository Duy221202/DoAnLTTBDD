// import React, { useState, useEffect ,useRef } from 'react';
// import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList,TouchableOpacity, ScrollView } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs, query , orderBy, where} from 'firebase/firestore';
// import GroupChat from '../Chat/GroupChat';

// const DanhSachNhom = () => {
//   const [nhom, setNhom] = useState([]);
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [currentUserUid, setCurrentUserUid] = useState(null);
//   const [showChat, setShowChat] = useState(false);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const auth = getAuth();
//         setCurrentUserUid(auth.currentUser.uid);
        
//         const db = getFirestore();
//         const groupsRef = collection(db, 'groups');
//         const unsubscribe = onSnapshot(groupsRef, (snapshot) => {
//           const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//           setNhom(data.filter(group => group.members.includes(auth.currentUser.uid)));
//         });

//         return () => unsubscribe();
//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const handleGroupClick = (groupId) => {
//     setCurrentGroup(groupId);
//     setShowChat(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Danh sách nhóm:</Text>
//       <FlatList
//         data={nhom}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleGroupClick(item.id)} style={styles.groupItem}>

//             <Text><Text style={styles.groupName}>{item.nameGroup}</Text> - Thành viên: {item.members.length}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id}
//       />

//       {
//       showChat && currentGroup && 
//         <View style={styles.showChat}>
//             <ScrollView>
//                 <GroupChat groupId={currentGroup} currentUserUid={currentUserUid} />
//             </ScrollView>
//         </View>
//       }

//     </View>
//   );
// };


// // const DanhSachNhom = () => {
// //   const [nhom, setNhom] = useState([]);
// //   const [currentGroup, setCurrentGroup] = useState(null);
// //   const [currentUserUid, setCurrentUserUid] = useState(null);
// //   const [showChat, setShowChat] = useState(false);

// //   useEffect(() => {
// //     const fetchGroups = async () => {
// //       try {
// //         const auth = getAuth();
// //         setCurrentUserUid(auth.currentUser.uid);
        
// //         const db = getFirestore();
// //         const groupsRef = collection(db, 'groups');
// //         const unsubscribe = onSnapshot(groupsRef, (snapshot) => {
// //           const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //           setNhom(data.filter(group => group.members.includes(currentUserUid))); // Lọc nhóm để chỉ hiển thị nhóm mà người dùng hiện tại là thành viên
// //         });

// //         return () => unsubscribe();
// //       } catch (error) {
// //         console.error('Error fetching groups:', error);
// //       }
// //     };

// //     fetchGroups();
// //   }, [currentUserUid]); // Thêm currentUserUid vào danh sách dependency của useEffect để nó sẽ được gọi lại mỗi khi currentUserUid thay đổi

// //   const handleGroupClick = (groupId) => {
// //     setCurrentGroup(groupId);
// //     setShowChat(true);
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Danh sách nhóm:</Text>
// //       <FlatList
// //         data={nhom}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity onPress={() => handleGroupClick(item.id)} style={styles.groupItem}>
// //             <Text><Text style={styles.groupName}>{item.nameGroup}</Text> - Thành viên: {item.members.length}</Text>
// //           </TouchableOpacity>
// //         )}
// //         keyExtractor={(item) => item.id}
// //       />

// //       {
// //       showChat && currentGroup && 
// //         <View style={styles.showChat}>
// //             <ScrollView>
// //                 <GroupChat groupId={currentGroup} currentUserUid={currentUserUid} />
// //             </ScrollView>
// //         </View>
// //       }

// //     </View>
// //   );
// // };

// // const DanhSachNhom = () => {
// //   const [nhom, setNhom] = useState([]);
// //   const [currentGroup, setCurrentGroup] = useState(null);
// //   const [currentUserUid, setCurrentUserUid] = useState(null);
// //   const [showChat, setShowChat] = useState(false);

// //   useEffect(() => {
// //     const auth = getAuth();
// //     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
// //       if (user) {
// //         setCurrentUserUid(user.uid);
// //       } else {
// //         setCurrentUserUid(null);
// //       }
// //     });

// //     return () => unsubscribeAuth();
// //   }, []);

// //   useEffect(() => {
// //     if (currentUserUid) {
// //       const fetchGroups = async () => {
// //         try {
// //           const db = getFirestore();
// //           const groupsRef = collection(db, 'groups');
// //           const unsubscribe = onSnapshot(groupsRef, (snapshot) => {
// //             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //             setNhom(data.filter(group => group.members.includes(currentUserUid))); // Lọc nhóm để chỉ hiển thị nhóm mà người dùng hiện tại là thành viên
// //           });

// //           return () => unsubscribe();
// //         } catch (error) {
// //           console.error('Error fetching groups:', error);
// //         }
// //       };

// //       fetchGroups();
// //     }
// //   }, [currentUserUid]);

// //   const handleGroupClick = (groupId) => {
// //     setCurrentGroup(groupId);
// //     setShowChat(true);
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Danh sách nhóm:</Text>
// //       <FlatList
// //         data={nhom}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity onPress={() => handleGroupClick(item.id)} style={styles.groupItem}>
// //             <Text><Text style={styles.groupName}>{item.nameGroup}</Text> - Thành viên: {item.members.length}</Text>
// //           </TouchableOpacity>
// //         )}
// //         keyExtractor={(item) => item.id}
// //       />

// //       {
// //       showChat && currentGroup && 
// //         <View style={styles.showChat}>
// //             <ScrollView>
// //                 <GroupChat groupId={currentGroup} currentUserUid={currentUserUid} />
// //             </ScrollView>
// //         </View>
// //       }

// //     </View>
// //   );
// // };


// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 10,
//     },
//     title: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 10,
//     },
//     groupItem: {
//       padding: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#ccc',
//     },
//     groupName: {
//       fontWeight: 'bold',
//     },
//     showChat: {
//       flex: 5,
//     },
//   });

// export default DanhSachNhom;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import GroupChat from '../Chat/GroupChat';

const DanhSachNhom = () => {
  const [nhom, setNhom] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const navigation = useNavigation();
  const db = getFirestore(); // Khởi tạo biến db ở cấp component
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const auth = getAuth();
        setCurrentUserUid(auth.currentUser.uid);
        
        const groupsRef = collection(db, 'groups'); // Sử dụng biến db đã khởi tạo
        const unsubscribe = onSnapshot(groupsRef, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNhom(data);
        });
    
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    
    fetchGroups();
  }, [db]); // Thêm db vào dependency array để useEffect chạy lại khi db thay đổi

  const handleGroupClick = async (groupId) => {
    try {
        const groupRef = doc(db, 'groups', groupId); // Sử dụng biến db đã khởi tạo
        const groupDoc = await getDoc(groupRef);
        const groupData = groupDoc.data();
        // if (groupData.members.includes(currentUserUid)) {
            setCurrentGroup(groupId);
            setShowChat(true);
        // } else {
        //     console.log('Bạn không có quyền truy cập vào nhóm này');
        // }
    } catch (error) {
        console.error('Error checking group access:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách nhóm:</Text>
      <FlatList
        data={nhom}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupClick(item.id)} style={styles.groupItem}>
            <Text><Text style={styles.groupName}>{item.groupName}</Text> - Thành viên: {item.members.length}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      {showChat && currentGroup && <View style={styles.showChat}><GroupChat groupId={currentGroup} currentUserUid={currentUserUid} /></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    //backgroundColor: 'blue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  groupName: {
    fontWeight: 'bold',
  },
  showChat: {
    flex: 1,
  },
});

export default DanhSachNhom;
