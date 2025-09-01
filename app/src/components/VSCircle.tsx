import { View, Text, StyleSheet, ColorValue } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export type VSState = "Neutral" | "Correct" | "Incorrect";

type VSConfig = {
  color: ColorValue;
  icon: React.ReactNode;
};

type VSCircleProps = {
  state: VSState;
  config?: Record<VSState, VSConfig>;
};

const VSCircle = ({
  state,
  config = {
    ["Neutral"]: {
      color: "white",
      icon: <Text style={styles.vsText}>VS</Text>,
    },
    ["Correct"]: {
      color: "green",
      icon: <AntDesign name="check" size={40} color="white" />,
    },
    ["Incorrect"]: {
      color: "red",
      icon: <AntDesign name="close" size={40} color="white" />,
    },
  },
}: VSCircleProps) => {
  const { color, icon } = config[state];

  return (
    <View
      style={{
        ...styles.vsCircle,
        backgroundColor: color,
      }}
    >
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  vsCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -30,
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  vsText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VSCircle;
