import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";
import HotterVsColderGame from "./components/HotterVsColderGame";

const Stack = createStackNavigator();
export default function App() {
  return (
    <SQLiteProvider
      databaseName="cities.db"
      assetSource={{assetId: require("./assets/cities.db")}}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Hotter VS Colder">
          <Stack.Screen
            name="Hotter VS Colder"
            component={HotterVsColderGame}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
