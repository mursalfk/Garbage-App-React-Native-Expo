import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LandingScreen from "./components/LandingScreen";
import HomePage from "./components/HomePage";
import Leaderboard from "./components/Leaderboard";
import DetectGarbage from "./components/DetectGarbage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Credits from "./components/Credits";

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          // Verify token integrity (e.g., validate signature)
          setUser({ token: userToken });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login state:", error);
        // Display user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    checkLoginState();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear authentication token
      await AsyncStorage.removeItem("userToken");
      setUser(null);
      // Redirect to landing screen or show logout confirmation message
    } catch (error) {
      console.error("Error logging out:", error);
      // Display user-friendly error message
    }
  };

  return (
    <NavigationContainer>
      {loading ? (
        // Show loading indicator or splash screen
        <LoadingScreen />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing Screen" component={LandingScreen} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
          <Stack.Screen name="Detect Garbage" component={DetectGarbage} />
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Credits" component={Credits} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
