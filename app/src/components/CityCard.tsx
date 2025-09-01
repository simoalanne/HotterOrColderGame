import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type CardBackground = "image" | "solidColor";

type CityCardProps = {
  imageURL: string | null;
  children?: React.ReactNode;
};

const CityCard = ({ imageURL, children }: CityCardProps) => {
  const [cardBackground, setCardBackground] = useState<CardBackground>("image");
  const gesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() =>
      setCardBackground((prev) => (prev === "image" ? "solidColor" : "image"))
    );
  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.card}>
        {cardBackground === "image" && imageURL ? (
          <>
            <Image
              source={imageURL}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={1000}
            />
            {/* Expo image does not support filter style prop so have to do it manually */}
            <View style={[StyleSheet.absoluteFill, styles.cardImage]} />
          </>
        ) : (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}
          />
        )}
        {children}
      </View>
    </GestureDetector>
  );
};

export default CityCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    zIndex: 0,
  },
  cardImage: {
    backgroundColor: "rgba(0,0,0,0.66)",
  },
});
