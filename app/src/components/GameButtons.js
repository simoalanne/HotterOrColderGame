import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import OpenMapButton from './OpenMapButton';

const GameButtons = ({
  isGuessButtonsEnabled,
  onGuess,
  onQuit,
  onNextCity,
  isCorrect,
  guessedCityName,
  disabled,
}) => (
  <View style={styles.buttonContainer}>
    {isGuessButtonsEnabled && (
      <>
        <CustomButton
          label="Hotter 🌞"
          onPress={() => onGuess('higher')}
          gradientColors={['#FFD700', '#FFDD44', '#FFCA3D']}
          icon={<AntDesign name="caretup" size={24} color="white" />}
        />
        <CustomButton
          label="Colder ❄️"
          onPress={() => onGuess('lower')}
          gradientColors={['#00BFFF', '#1E90FF', '#ADD8E6']}
          icon={<AntDesign name="caretdown" size={24} color="white" />}
        />
        <OpenMapButton cityName={guessedCityName} />
      </>
    )}

    {isCorrect === false && (
      <CustomButton
        label="Quit"
        onPress={onQuit}
        gradientColors={['#FF6347', '#FF4500', '#FF0000']}
        icon={<AntDesign name="close" size={24} color="white" />}
      />
    )}

    {isCorrect === true && (
      <CustomButton
        label="Next City"
        onPress={onNextCity}
        gradientColors={['#32CD32', '#3CB371', '#98FB98']}
        icon={<AntDesign name="arrowright" size={24} color="white" />}
        disabled={disabled}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
});

export default GameButtons;
