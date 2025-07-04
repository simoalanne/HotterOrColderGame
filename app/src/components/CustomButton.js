import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({
  label,
  onPress,
  gradientColors = ['#00FF00', '#008000'],
  icon,
  buttonStyle,
  textStyle,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{ ...styles.horizontalButton, ...buttonStyle }}>
    <LinearGradient
      colors={gradientColors}
      style={{ ...styles.gradient, ...buttonStyle }}>
      <View style={styles.contentContainer}>
        {label && (
          <Text style={{ ...styles.buttonText, ...textStyle }}>{label}</Text>
        )}
        {icon && icon}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  horizontalButton: {
    margin: 10,
    borderRadius: 30,
    width: 200,
    height: 50,
  },
  gradient: {
    borderRadius: 30,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
