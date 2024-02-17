import React, { useState, useRef, useEffect } from "react";
import {
    Button,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

const modelJSON = require("../model/model.json");
const modelWeights = require("../model/weights.bin");

export default function DetectGarbage({ navigation }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isLive, setIsLive] = useState(true);
    const cameraRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            // await tf.setBackend("cpu");
            const model = await tf
                .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
                .catch((e) => {
                    console.log("[LOADING ERROR] info:", e);
                });
            console.log("model loaded");
        };
        loadModel();
    }, []);

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
                <Button
                    title="Request Camera Permission"
                    onPress={requestPermission}
                />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>Permission not granted</Text>
                <Button
                    title="Request Camera Permission"
                    onPress={requestPermission}
                />
            </View>
        );
    }

    const showLeaderboard = () => {
        console.log("Leaderboard Button Clicked");
        navigation.navigate("Leaderboard");
    };

    const homePageButton = () => {
        navigation.navigate("HomePage");
    };

    function toggleCameraType() {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.Back
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setCapturedImage(data.uri);
            setIsLive(false);
            // predictImage();
        }
    };

    // const predictImage = async () => {
    //     const model = await tf
    //         .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
    //         .catch((e) => {
    //             console.log("[LOADING ERROR] info:", e);
    //         });
    //     console.log("model loaded");
    // };

    const retakePicture = () => {
        setCapturedImage(null);
        setIsLive(true);
    };

    return (
        <View style={styles.container}>
            {isLive ? (
                <View style={styles.cameraContainer}>
                    <Camera
                        style={styles.camera}
                        type={type}
                        ref={cameraRef}
                    ></Camera>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.clickPhotoButton}
                            onPress={takePicture}
                        >
                            <Text style={styles.buttonText}>Click Picture</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: capturedImage }}
                        style={styles.capturedImage}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={retakePicture}
                        >
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    style={styles.leaderboardButton}
                    onPress={showLeaderboard}
                >
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={homePageButton}
                >
                    <Text style={styles.buttonText}>Back to Homepage</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        display: "flex",
        height: "60%",
        width: "100%",
        justifyContent: "center",
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 20,
    },
    clickPhotoButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    capturedImage: {
        display: "flex",
        height: "60%",
        width: "100%",
        justifyContent: "center",
    },
    retakeButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    bottomButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    leaderboardButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    homeButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
