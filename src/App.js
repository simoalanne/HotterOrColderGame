import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WeatherProvider from './context/WeatherProvider';

import Home from './components/Home';
import Forecast from './components/Forecast';
import Details from './components/Details';
import HotterVsColderGame from './components/HotterVsColderGame';

const Stack = createStackNavigator();
export default function App() {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Forecast" component={Forecast} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Hotter VS Colder" component={HotterVsColderGame} />
        </Stack.Navigator>
      </NavigationContainer>
    </WeatherProvider>
  );
}
