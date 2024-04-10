import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OptionsMenu = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionsBtn} onPress={toggleOptions}>
        <Text style={styles.btnText}>Options</Text>
        <Icon name="caret-down" style={styles.icon} />
      </TouchableOpacity>
      
      {showOptions && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="undo" style={styles.optionIcon} />
            <Text>Thu hồi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="trash" style={styles.optionIcon} />
            <Text>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="share" style={styles.optionIcon} />
            <Text>Chuyển tiếp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="reply" style={styles.optionIcon} />
            <Text>Trả lời</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    marginRight: 5,
  },
  icon: {
    color: '#fff',
    fontSize: 20,
  },
  optionsMenu: {
    top: 10,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 5,
    elevation: 10,
  },
  optionItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  optionIcon: {
    fontSize: 15,
    paddingVertical: 5,
  },
});

export default OptionsMenu;

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const OptionsMenu = () => {
//   const [showOptions, setShowOptions] = useState(false);
//   let pressTimer;

//   const toggleOptions = () => {
//     pressTimer = setTimeout(() => {
//       setShowOptions(true);
//     }, 3000); // Khoảng thời gian nhấn giữ trước khi hiển thị menu (3000ms = 3 giây)
//   };

//   const handleRelease = () => {
//     clearTimeout(pressTimer);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.optionsBtn}
//         onPress={toggleOptions}
//         onLongPress={toggleOptions} // Sử dụng onLongPress thay vì onPress
//         onPressOut={handleRelease} // Sự kiện khi nhấc tay ra khỏi nút
//       >
//         <Text style={styles.btnText}>Options</Text>
//         <Icon name="caret-down" style={styles.icon} />
//       </TouchableOpacity>
      
//       {showOptions && (
//         <View style={styles.optionsMenu}>
//           <TouchableOpacity style={styles.optionItem}>
//             <Icon name="undo" style={styles.optionIcon} />
//             <Text>Thu hồi</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem}>
//             <Icon name="trash" style={styles.optionIcon} />
//             <Text>Xóa</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem}>
//             <Icon name="share" style={styles.optionIcon} />
//             <Text>Chuyển tiếp</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem}>
//             <Icon name="reply" style={styles.optionIcon} />
//             <Text>Trả lời</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   optionsBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   btnText: {
//     color: '#fff',
//     marginRight: 5,
//   },
//   icon: {
//     color: '#fff',
//     fontSize: 20,
//   },
//   optionsMenu: {
//     top: 10,
//     flexDirection: 'row',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 5,
//     padding: 5,
//     elevation: 10,
//   },
//   optionItem: {
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   optionIcon: {
//     fontSize: 15,
//     paddingVertical: 5,
//   },
// });

// export default OptionsMenu;
