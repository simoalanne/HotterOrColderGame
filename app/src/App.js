import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";
import HotterOrColderGame from "./screens/HotterOrColderGame";
import MainMenu from "./screens/MainMenu";
import StatsScreen from "./screens/StatsScreen";

const Stack = createStackNavigator();
export default function App() {
  return (
    <SQLiteProvider
      databaseName="cities.db"
      assetSource={{ assetId: require("./assets/cities.db") }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main Menu">
          <Stack.Screen name="Main Menu" component={MainMenu} options={{ headerShown: false }} />
          <Stack.Screen name="Game" component={HotterOrColderGame} options={{ headerShown: true }} />
          <Stack.Screen name="Stats" component={StatsScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
