import { ImageBackground, StyleSheet } from "react-native";
import isNight from "../utils/isNight";

const MenuBackground = ({ children }: { children: React.ReactNode }) => {
  const cityImage = isNight()
    ? require("../assets/night-city.jpg")
    : require("../assets/day-city.jpg");

  return (
    <ImageBackground source={cityImage} style={styles.background}>
      {children}
    </ImageBackground>
  );
};

export default MenuBackground;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
