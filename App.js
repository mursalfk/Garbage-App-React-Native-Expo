import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingScreen from "./components/LandingScreen";
import HomePage from "./components/HomePage";
import Leaderboard from "./components/Leaderboard";
import DetectGarbage from "./components/DetectGarbage";
import TensorFlowInitializer from "./TensorFlowInitializer";
import Credits from "./components/Credits";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    TensorFlowInitializer();
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setUser({ token: userToken });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login state:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Landing Screen" component={LandingScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Detect Garbage" component={DetectGarbage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Credits" component={Credits} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}