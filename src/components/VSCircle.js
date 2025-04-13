import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const VSCircle = ({ isCorrect }) => {
  const getIcon = (isCorrect) => {
    if (isCorrect === true)
      return <AntDesign name="check" size={40} color="white" />;
    if (isCorrect === false)
      return <AntDesign name="close" size={40} color="white" />;
    return <Text style={styles.vsText}>VS</Text>;
  };

  return (
    <View
      style={{
        ...styles.vsCircle,
        backgroundColor: isCorrect
          ? 'green'
          : isCorrect === false
          ? 'red'
          : 'white',
      }}>
      {getIcon(isCorrect)}
    </View>
  );
};

const styles = StyleSheet.create({
  vsCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  vsText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VSCircle;
