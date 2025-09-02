import { View, Text, StyleSheet } from "react-native";
import useStats from "../hooks/useStats";
import MenuBackground from "../components/MenuBackground";

const StatsScreen = () => {
  const { highScore, totalGames, averageScore } = useStats();

  return (
    <MenuBackground>
      <View style={styles.dialogContent}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total Games: {totalGames}</Text>
          <Text style={styles.statsText}>High Score: {highScore}</Text>
          <Text style={styles.statsText}>Average Score: {averageScore}</Text>
        </View>
      </View>
    </MenuBackground>
  );
};

const styles = StyleSheet.create({
  dialogContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 10,
    width: "90%",
  },
  statsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backArrow: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  statsText: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
});

export default StatsScreen;
