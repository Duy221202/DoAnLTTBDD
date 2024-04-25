import React, { useState, useEffect } from 'react';
import { SafeAreaView, Pressable, StyleSheet, Text, View, TextInput, Image, FlatList, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";

const BanBe = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const [userFriendsList, setUserFriendsList] = useState([]);

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
                    // Sắp xếp bạn bè của người dùng theo thứ tự chữ cái của tên
                    //userFriends.sort((a, b) => a.name.localeCompare(b.name));
                });
                

                return () => unsubscribe(); // Hủy đăng ký khi thành phần bị xóa
            } else {
                console.log("No user signed in!");
            }
        });

        return unsubscribe;
    }, []);

    // Sắp xếp danh sách người dùngFriendsList theo thứ tự bảng chữ cái theo tên
    const sortedUserFriendsList = userFriendsList.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // // Hàm chuẩn hóa các kí tự đặc biệt trong tiếng Việt
    // const normalizeVietnamese = (str) => {
    //     // Xác định một ánh xạ cho các kí tự đặc biệt
    //     const map = {
    //         'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    //         'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    //         'Đ': 'D',
    //         'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    //         'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    //         'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    //         'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U'
    //     };
    //     // Thay thế các kí tự đặc biệt bằng các kí tự tương ứng đã chuẩn hóa
    //     return str.replace(/[\u00C0-\u1EF9]/g, function(match) {
    //         return map[match] || match;
    //     });
    // };

    // // Hàm nhóm các bạn bè theo chữ cái đầu tiên của tên
    // const groupFriendsByFirstLetter = (friends) => {
    //     const groupedFriends = {};
    //     friends.forEach((friend) => {
    //         // Chuẩn hóa tên trước khi lấy chữ cái đầu tiên
    //         const normalizedFirstLetter = normalizeVietnamese(friend.name.charAt(0).toUpperCase());
    //         if (!groupedFriends[normalizedFirstLetter]) {
    //             groupedFriends[normalizedFirstLetter] = [];
    //         }
    //         groupedFriends[normalizedFirstLetter].push(friend);
    //     });
    //     return groupedFriends;
    // };

    // Hiển thị mục bạn bè người dùng
    const renderUserFriendItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {/* <Pressable style={styles.itemuser} onPress={() => navigation.navigate('DoanChat')}> */}
            {/* <Pressable style={styles.itemuser} onPress={() => navigation.navigate('DoanChat', { name: item.name, photoUrl: item.photoUrl })}> */}
            {/* <Pressable style={styles.itemuser} onPress={() => navigation.navigate('Chat_Quy')}> */}
            <Pressable style={styles.itemuser}>
                <Image style={styles.image} source={{ uri: item.photoUrl }} />
                <Text style={styles.text}>{item.name}</Text>
            </Pressable>
        </View>
    );

    // // Hiển thị nhóm các bạn bè của người dùng
    // const renderGroupedFriends = () => {
    //     const groupedFriends = groupFriendsByFirstLetter(userFriendsList);

    //     return Object.keys(groupedFriends).map((letter) => (
    //         <View key={letter}>
    //             <Text style={styles.textGroup}>{letter}</Text>
    //             <FlatList
    //                 data={groupedFriends[letter]}
    //                 renderItem={renderUserFriendItem}
    //                 keyExtractor={(item) => item.id}
    //                 horizontal={false}
    //             />
    //         </View>
    //     ));
    // };

    return (
        <SafeAreaView  style={styles.container}>
            <View>
                <Pressable onPress={() => navigation.navigate("LoiMoiKetBan")}>
                    <View style={styles.view1}>
                        <Icon name="user-friends" size={24} color="#006AF5" />
                        <Text style={styles.text1}>Lời mời kết bạn</Text>
                    </View>
                </Pressable>
                <View style={styles.view1}>
                    <Icon2 name="contacts" size={30} color="#006AF5" />
                    <Text style={styles.text1}>Danh bạ máy</Text>
                </View>
            </View>

            {/* Separator */}
            <View style={styles.separator} /> 

            <Text style={styles.textall}>Tất cả</Text>

            {/* <ScrollView>
                {renderGroupedFriends()}
            </ScrollView> */}

            <ScrollView>
                <FlatList
                    data={sortedUserFriendsList}
                    renderItem={renderUserFriendItem}
                    keyExtractor={(item) => item.id}
                />
            </ScrollView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    itemuser: {
        flexDirection: 'row',
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
    view1: {
        flexDirection: 'row',
        margin: 10,
    },
    text1: {
        fontSize: 15,
        justifyContent: "center",
        marginLeft: 10
    },
    separator: {
        height: 5,
        backgroundColor: '#ccc',
        marginVertical: 5,
    },
    textall: {
        fontSize: 16,
        marginLeft: 10,
        paddingHorizontal: 10,   
    },
    textGroup: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
    },
});

export default BanBe;
