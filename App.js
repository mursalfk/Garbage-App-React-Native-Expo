import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login";
import SignUp from "./components/SingUp";
import LandingScreen from "./components/LandingScreen";
import HomePage from "./components/HomePage";
import Leaderboard from "./components/Leaderboard";
import DetectGarbage from "./components/DetectGarbage";
import { useEffect } from "react";
import TensorFlowInitializer from "./TensorFlowInitializer";

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        TensorFlowInitializer();
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Landing Screen" component={LandingScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="Leaderboard" component={Leaderboard} />
                <Stack.Screen name="Detect Garbage" component={DetectGarbage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
