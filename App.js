import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingScreen from "./components/LandingScreen";
import HomePage from "./components/HomePage";
import Leaderboard from "./components/Leaderboard";
import DetectGarbage from "./components/DetectGarbage";
import TensorFlowInitializer from "./TensorFlowInitializer";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import Credits from "./components/Credits";

const modelJSON = require("./model/model.json");
const modelWeight1 = require("./model/group1-shard1of13.bin");
const modelWeight2 = require("./model/group1-shard2of13.bin");
const modelWeight3 = require("./model/group1-shard3of13.bin");
const modelWeight4 = require("./model/group1-shard4of13.bin");
const modelWeight5 = require("./model/group1-shard5of13.bin");
const modelWeight6 = require("./model/group1-shard6of13.bin");
const modelWeight7 = require("./model/group1-shard7of13.bin");
const modelWeight8 = require("./model/group1-shard8of13.bin");
const modelWeight9 = require("./model/group1-shard9of13.bin");
const modelWeight10 = require("./model/group1-shard10of13.bin");
const modelWeight11 = require("./model/group1-shard11of13.bin");
const modelWeight12 = require("./model/group1-shard12of13.bin");
const modelWeight13 = require("./model/group1-shard13of13.bin");
// const weight = require("./model/weights.bin");

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [model, setModel] = useState(null);

    useEffect(() => {
        TensorFlowInitializer();
        checkLoginState();
        const loadModel = async () => {
            try {
                const model = await tf.loadGraphModel(
                    bundleResourceIO(modelJSON, [
                        modelWeight1,
                        modelWeight2,
                        modelWeight3,
                        modelWeight4,
                        modelWeight5,
                        modelWeight6,
                        modelWeight7,
                        modelWeight8,
                        modelWeight9,
                        modelWeight10,
                        modelWeight11,
                        modelWeight12,
                        modelWeight13,
                    ])
                );
                setModel(model);
                console.log("Model loaded successfully");
            } catch (e) {
            }
        };
        loadModel();
    }, []);

    const checkLoginState = async () => {
        try {
            const userToken = await AsyncStorage.getItem("userToken");
            if (userToken) {
                setUser({ token: userToken });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking login state:", error);
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Landing Screen" component={LandingScreen} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="Leaderboard" component={Leaderboard} />
                <Stack.Screen
                    name="Detect Garbage"
                    component={DetectGarbage}
                    initialParams={{ model }}
                />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Credits" component={Credits} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
