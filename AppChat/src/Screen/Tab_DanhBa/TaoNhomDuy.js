import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert,ScrollView ,FlatList,SafeAreaView,Pressable,Image} from 'react-native';
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc, query, where } from 'firebase/firestore';
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

// const handleCreateGroup = async () => {
//     try {
//         if (!groupName.trim()) { // Kiểm tra tên nhóm không được để trống
//             Alert.alert('Vui lòng nhập tên nhóm');
//             return;
//         }

//         if (selectedFriends.length < 2) { // Kiểm tra ít nhất 2 thành viên được chọn
//             Alert.alert('Vui lòng chọn ít nhất 2 thành viên');
//             return;
//         }

//         const groupsRef = collection(db, 'groups');
//         const newGroupRef = await addDoc(groupsRef, {
//             nameGroup: groupName,
//             members: [auth.currentUser?.uid, ...selectedFriends], // Thêm thành viên đã chọn và người tạo nhóm vào danh sách thành viên
//         });

//         const groupId = newGroupRef.id; // Lấy ID của nhóm vừa tạo

//         console.log('Group created successfully!');
//         Alert.alert('Tạo nhóm thành công');

//         // Lưu danh sách thành viên của nhóm vào Firestore
//         await setDoc(doc(db, 'groups', groupId), {nameGroup: groupName, members: [auth.currentUser?.uid, ...selectedFriends] });

//         setGroupName(''); // Reset the group name input
//         setSelectedFriends([]); // Clear the selected friends
//         // // Truyền dữ liệu nhóm qua màn hình chat
//         // navigation.navigate("DanhSachNhom", {
//         //     groupId: groupId,
//         //     groupName: groupName,
//         //     memberCount: selectedFriends.length + 1, // Số lượng thành viên của nhóm bao gồm người tạo nhóm
//         //     // Bạn cũng có thể truyền thêm các thông tin khác về nhóm tại đây nếu cần
//         // });
//     } catch (error) {
//         console.error('Error creating group:', error);
//     }
// };

const handleCreateGroup = async () => {
    try {
        if (!groupName.trim() || selectedFriends.length === 0) {
            Alert.alert('Vui lòng nhập tên nhóm và chọn ít nhất một thành viên');
            return;
        }

        const groupsRef = collection(db, 'groups');
        const newGroupRef = await addDoc(groupsRef, {
            groupName: groupName,
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
// const isFriendSelected = (user) => {
//     return Array.isArray(selectedFriends) && selectedFriends.includes(user.uid);
// };

return (
    <View style={styles.container}>
        <Text style={styles.title}>Tạo nhóm từ bạn bè sau:</Text>
        <ScrollView>
            {Object.keys(userFriendsList).length === 0 ? (
                <Text>Bạn không có bạn bè nào</Text>
            ) : (
                <View>
                    {userFriendsList.map((friend) => (
                        <View key={friend.name} style={styles.friendItem}>
                            <Pressable onPress={() => handleFriendClick(friend.id)} style={styles.itemContainer}>
                                <View style={styles.itemuser} onPress={() => toggleSelectFriend(friend.id)}>
                                    <Image style={styles.image} source={{ uri: friend.photoUrl }} />
                                    <Text style={styles.text}>{friend.name}</Text>
                                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleCheckboxPress(friend.id)}>
                                        <View style={[styles.checkbox, selectedFriends.includes(friend.id) && styles.checked]} />
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </View>
                    ))}
                </View>
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
friendItem: {
    marginBottom: 10,
},
itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
},
itemuser: {
    flexDirection: 'row',
},
tickIcon: {
    width: 20,
    height: 20,
    marginLeft: 'auto', // Hiển thị ở bên phải của mục bạn bè
    tintColor: 'green', // Màu của dấu tick
},
image: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
},
text: {
    fontSize: 18,
    marginTop: 18,
    marginLeft: 20,
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
//
//
checkboxContainer: {
    position: 'absolute',
    top: 20, // Điều chỉnh vị trí theo cần thiết
    right: 20, // Điều chỉnh vị trí theo cần thiết
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#418df8', // Màu viền của ô tròn để chọn
  },
  checked: {
    backgroundColor: '#418df8', // Màu nền của ô tròn khi đã được chọn
  },
};



