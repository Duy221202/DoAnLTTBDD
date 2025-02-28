import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert,ScrollView ,FlatList,SafeAreaView,Pressable,Image} from 'react-native';
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';


const TaoNhomDuy = () => {
const [userFriends, setUserFriends] = useState({});
const navigation = useNavigation();
const [selectedFriends, setSelectedFriends] = useState([]);
const [groupName, setGroupName] = useState('');
const [userFriendsList, setUserFriendsList] = useState([]);
const auth = getAuth();
const db = getFirestore();
const user = auth.currentUser;
const [userGroups, setUserGroups] = useState([]);

const [senders, setSenders] = useState({});
const [selectedFriend, setSelectedFriend] = useState(null);

const toggleSelectFriend = (friendId) => {
    if (selectedFriends.includes(friendId)) {
        setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
        setSelectedFriends([...selectedFriends, friendId]);
    }
};

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(user);
            fetchUserFriends(); // Lấy danh sách bạn bè khi người dùng được xác thực
            fetchUserGroups();
            const db = getFirestore();
            const userDocRef = doc(db, "users", user.uid);
            const friendsCollectionRef = collection(userDocRef, "friendData");

            const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
                const userFriends = [];
                let index = 0; // Bắt đầu với index = 0    Mới
                snapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        //id: doc.id,
                        id: index++, // Gán ID bằng index và tăng index sau mỗi lần sử dụng
                        name: friendData.name_fr,
                        photoUrl: friendData.photoURL_fr,
                        userId: friendData.userId_fr,
                        UID_fr: friendData.UID_fr
                    });
                });
                console.log(userFriends);
                setUserFriendsList(userFriends); // Update friends list
                // Sắp xếp bạn bè của người dùng theo thứ tự chữ cái của tên
                // userFriends.sort((a, b) => a.name.localeCompare(b.name));
            });
            

            return () => unsubscribe(); // Hủy đăng ký khi thành phần bị xóa
        } else {
            console.log("No user signed in!");
        }
    });

    return unsubscribe;
}, []);

const fetchUserGroups = async () => {
    try {
        const userGroupsRef = collection(db, 'groups');
        const userGroupsQuery = query(userGroupsRef, where('members', 'array-contains', auth.currentUser.uid));
        const userGroupsSnapshot = await getDocs(userGroupsQuery);

        const groups = [];
        userGroupsSnapshot.forEach((doc) => {
            groups.push({ id: doc.id, ...doc.data() });
        });

        setUserGroups(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
    }
};

useEffect(() => {
    const fetchUserFriends = async () => {
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userDoc = userDocSnap.data();
        if (userDocSnap.exists()) {
        setUserFriends(userDocSnap.data().friends || {});
        }
    } catch (error) {
        console.error('Error fetching user friends:', error);
    }
    };

    fetchUserFriends();
}, []);

const handleFriendClick = (friendId) => {
    setSelectedFriends([...selectedFriends, friendId]);
    toggleSelectFriend(friendId); // Gọi hàm toggleSelectFriend để thay đổi trạng thái của bạn bè khi bạn nhấn vào
};

const handleCheckboxPress = (friendId) => {
    toggleSelectFriend(friendId); // Gọi hàm toggleSelectFriend để thay đổi trạng thái của bạn bè khi bạn nhấn vào checkbox
};

const handleGroupNameChange = (text) => {
    setGroupName(text);
};

const fetchUserFriends = async () => {
    try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const friendsCollectionRef = collection(userDocRef, "friendData");
                const friendsSnapshot = await getDocs(friendsCollectionRef);

                const userFriends = [];
                friendsSnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        id: doc.id,
                        name: friendData.name_fr,
                        photoUrl: friendData.photoURL_fr,
                        userId: friendData.userId_fr,
                        UID_fr: friendData.UID_fr
                    });
                });

                setUserFriendsList(userFriends);
            } else {
                console.error("User document does not exist!");
            }
        } else {
            console.error("No user signed in!");
        }
    } catch (error) {
        console.error("Error fetching user friends:", error);
    }
};

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(user);
            fetchUserFriends(); // Lấy danh sách bạn bè khi người dùng được xác thực

            const db = getFirestore();
            const userDocRef = doc(db, "users", user.uid);
            const friendsCollectionRef = collection(userDocRef, "friendData");

            const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
                const userFriends = [];
                let index = 0; // Bắt đầu với index = 0    Mới
                snapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        //id: doc.id,
                        id: index++, // Gán ID bằng index và tăng index sau mỗi lần sử dụng
                        name: friendData.name_fr,
                        photoUrl: friendData.photoURL_fr,
                        userId: friendData.userId_fr,
                        UID_fr: friendData.UID_fr
                    });
                });
                console.log(userFriends);
                setUserFriendsList(userFriends); // Update friends list
            });
            

            return () => unsubscribe(); // Hủy đăng ký khi thành phần bị xóa
        } else {
            console.log("No user signed in!");
        }
    });

    return unsubscribe;
}, []);

const handleCreateGroup = async () => {
    try {
        if (!groupName.trim() || selectedFriends.length === 0) {
            Alert.alert('Vui lòng nhập tên nhóm');
            return;
        }

        if (selectedFriends.length < 2) { // Kiểm tra ít nhất 2 thành viên được chọn
            Alert.alert('Vui lòng chọn ít nhất 2 thành viên');
            return;
        }

        const groupsRef = collection(db, 'groups');
        const newGroupRef = await addDoc(groupsRef, {
            name: groupName,
            members: [auth.currentUser?.uid, ...selectedFriends], // Thêm thành viên đã chọn và người tạo nhóm vào danh sách thành viên
        });

        const groupId = newGroupRef.id; // Lấy ID của nhóm vừa tạo

        console.log('Group created successfully!');
        Alert.alert('Nhóm tạo thành công');
        
        setGroupName(''); // Reset the group name input
        setSelectedFriends([]); // Clear the selected friends

        // Lưu danh sách thành viên của nhóm vào Firestore
        const addedMembers = await Promise.all(selectedFriends.map(async (friendId) => {
            // Lấy thông tin của thành viên từ Firestore
            const friendDoc = await getDoc(doc(db, 'users', friendId));
            if (friendDoc.exists()) {
                const friendData = friendDoc.data();
                // Cập nhật quyền truy cập cho thành viên trong nhóm
                await setDoc(doc(db, 'users', friendId), {
                    ...friendData,
                    groups: [...(friendData.groups || []), groupId] // Thêm ID nhóm mới vào danh sách nhóm của thành viên
                });
                // Gửi thông báo đến thành viên
                return sendNotification(friendData.token, 'Bạn đã được thêm vào nhóm', 'Nhóm mới', { groupId: groupId });
            }
        }));

        // Cập nhật quyền truy cập cho người tạo nhóm
        const currentUserDocRef = doc(db, 'users', auth.currentUser?.uid);
        const currentUserDocSnap = await getDoc(currentUserDocRef);
        if (currentUserDocSnap.exists()) {
            const currentUserData = currentUserDocSnap.data();
            await setDoc(currentUserDocRef, {
                ...currentUserData,
                groups: [...(currentUserData.groups || []), groupId] // Thêm ID nhóm mới vào danh sách nhóm của người tạo nhóm
            });
        }

        console.log('Group created successfully!');
        Alert.alert('Nhóm tạo thành công');

    } catch (error) {
        console.error('Error creating group:', error);
    }
};
const isFriendSelected = (user) => {
    return Array.isArray(selectedFriends) && selectedFriends.includes(user.uid);
};

useEffect(() => {
    const db = getFirestore();

    const unsubscribeUserFriends = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserFriends(doc.data().friends || {});
      }
    }, (error) => {
      console.error("Error fetching user friends:", error);
    });

    const fetchSenders = async () => {
      try {
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

    fetchSenders();

    return () => {
      unsubscribeUserFriends();
    };
}, [auth.currentUser.uid]);

// const renderFriend = ({ item: friendId }) => (
//     <TouchableOpacity key={friendId} onPress={() => handleFriendClick(friendId)} style={styles.itemuser}>
//       <Image style={styles.image}
//         source={{ uri: senders[friendId]?.photoURL }}
//         alt={senders[friendId]?.name}
//       />
//       <Text style={styles.text}>{senders[friendId]?.name}</Text>
//     </TouchableOpacity>
// );

const renderFriend = ({ item: friendId }) => (
    <TouchableOpacity key={friendId} onPress={() => handleFriendClick(friendId)} style={[styles.itemuser, selectedFriends.includes(friendId) && styles.selected]}>
      <Image style={styles.image}
        source={{ uri: senders[friendId]?.photoURL }}
        alt={senders[friendId]?.name}
      />
      <Text style={styles.text}>{senders[friendId]?.name}</Text>
      <TouchableOpacity style={styles.selectButton} onPress={() => toggleSelectFriend(friendId)}>
        <Text>{selectedFriends.includes(friendId) ? 'Bỏ chọn' : 'Chọn'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
);

return (
    <View style={styles.container}>
        <Text style={styles.title}>Tạo nhóm từ bạn bè sau:</Text>
        <ScrollView>
            {Object.keys(userFriends).length === 0 ? (
              <Text>Bạn không có bạn bè nào</Text>
            ) : (
              <FlatList
                data={Object.keys(userFriends)}
                renderItem={renderFriend}
                keyExtractor={(friendId) => friendId}
              />
            )}
        </ScrollView>

        {selectedFriends.length > 0 && (
            <View>
                <TextInput
                    style={styles.input}
                    value={groupName}
                    onChangeText={handleGroupNameChange}
                    placeholder="Nhập tên nhóm"
                />
                <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
                    <Text>Tạo nhóm chat</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);
};    

export default TaoNhomDuy;

const styles = {
container: {
    flex: 1,
    padding: 20,
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},
itemuser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
},
image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
},
text: {
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
},
input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
},
createGroupButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
},
selected: {
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
},
selectButton: {
    padding: 8,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
},
};



