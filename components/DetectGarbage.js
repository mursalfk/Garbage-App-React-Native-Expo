import React, { useState, useRef, useEffect } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity, Image, Vibration, ActivityIndicator } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import { getAuth } from "firebase/auth";
import { db } from "../services/Config";
import { doc, setDoc, getDoc,  } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';

const auth = getAuth();

export default function DetectGarbage({ navigation }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isLive, setIsLive] = useState(true);
    const cameraRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [predictResult, setPredictResult] = useState("");
    const [disposalInstructions, setDisposalInstructions] = useState("");
    const [userData, setUserData] = useState(null);
    const [model, setModel] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            setUserData(docSnap.data());
                        } else {
                            setUserData(null);
                        }
                    })
                    .catch((error) => {
                        setUserData(null);
                    });
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const initializeTensorFlow = async () => {
            try {
                await tf.ready();
                console.log("TensorFlow.js is ready");
                const model = await tf.loadGraphModel(
                    bundleResourceIO(require("../model/model.json"), [
                        require("../model/group1-shard1of13.bin"),
                        require("../model/group1-shard2of13.bin"),
                        require("../model/group1-shard3of13.bin"),
                        require("../model/group1-shard4of13.bin"),
                        require("../model/group1-shard5of13.bin"),
                        require("../model/group1-shard6of13.bin"),
                        require("../model/group1-shard7of13.bin"),
                        require("../model/group1-shard8of13.bin"),
                        require("../model/group1-shard9of13.bin"),
                        require("../model/group1-shard10of13.bin"),
                        require("../model/group1-shard11of13.bin"),
                        require("../model/group1-shard12of13.bin"),
                        require("../model/group1-shard13of13.bin"),
                    ])
                );
                setModel(model);
                setModelLoaded(true);
                console.log("Model loaded successfully");
            } catch (e) {
                console.error("Error loading model:", e);
            }
        };
        initializeTensorFlow();
    }, []);


    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
                <Button
                    title="Request Camera Permission"
                    onPress={requestPermission}
                />
                <StatusBar hidden={true} />
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
                <StatusBar hidden={true} />
            </View>
        );
    }

    const showLeaderboard = () => {
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
            predictImage(data.uri);
            Vibration.vibrate();
        }
    };

    const transformImageToTensor = async (uri) => {
        const img64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
        const raw = new Uint8Array(imgBuffer);
        let imgTensor = decodeJpeg(raw);
        imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
        imgTensor = tf.cast(imgTensor, "float32");
        const img = tf.reshape(imgTensor, [1, 224, 224, 3]);
        return img;
    };

    const predictImage = async (uri) => {
        const imgTensor = await transformImageToTensor(uri);
        const classes = {
            0: "battery",
            1: "biological",
            2: "brown-glass",
            3: "cardboard",
            4: "clothes",
            5: "green-glass",
            6: "metal",
            7: "paper",
            8: "plastic",
            9: "shoes",
            10: "trash",
            11: "white-glass",
        };
        const predictions = await model.predict(imgTensor);
        const value = predictions.dataSync();
        const predictedClass = value.indexOf(Math.max(...value))
        setPredictResult(classes[predictedClass].charAt(0).toUpperCase() + classes[predictedClass].slice(1));

        const disposalInstruction = generateDisposalInstruction(classes[predictedClass]);
        setDisposalInstructions(disposalInstruction)
        updateScore();
        Vibration.vibrate();
    };

    const updateScore = async () => {
        if (userData) {
            const userRef = doc(db, "users", userData.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userScore = userDoc.data().score;
                const newScore = userScore + 10;
                await setDoc(userRef, { score: newScore }, { merge: true });
                alert("10 Points Added!");
            }
        }
    };

    const generateDisposalInstruction = (garbageClass) => {
        switch (garbageClass.toLowerCase()) {
            case "battery":
                return "Dispose of batteries at designated battery recycling centers to prevent environmental contamination.";
            case "biological":
                return "Biological waste, such as food scraps and yard waste, should be composted to reduce landfill waste and produce nutrient-rich soil.";
            case "brown-glass":
            case "green-glass":
            case "white-glass":
                return "Glass bottles and jars can be recycled. Rinse them thoroughly and place them in your recycling bin.";
            case "cardboard":
                return "Cardboard boxes and packaging materials can be recycled. Flatten cardboard boxes before recycling to save space.";
            case "clothes":
                return "Donate gently used clothes to local charities or clothing donation centers. Torn or heavily worn clothes can be repurposed into cleaning rags or recycled into new textiles.";
            case "metal":
                return "Metal cans, foil, and other metal items can be recycled. Rinse them thoroughly and place them in your recycling bin.";
            case "paper":
                return "Paper, including newspapers, magazines, and office paper, can be recycled. Place clean, dry paper in your recycling bin.";
            case "plastic":
                return "Plastic containers, bottles, and packaging materials with recycling symbols can be recycled. Check your local recycling guidelines for specific instructions.";
            case "shoes":
                return "Donate gently used shoes to local charities or shoe donation centers. Worn-out shoes can often be recycled into materials for playgrounds or sports fields.";
            case "trash":
                return "Dispose of general trash in your designated trash bin. Make sure to separate recyclable materials from non-recyclable waste.";
            default:
                return "Dispose of this item according to your local waste management guidelines.";
        }
    };

    const retakePicture = () => {
        setPredictResult("");
        setDisposalInstructions("");
        setCapturedImage(null);
        setIsLive(true);
    };

    return (
        <View style={styles.container}>
            {modelLoaded ? (
                isLive ? (
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
                                disabled={!modelLoaded}
                            >
                                <Text style={styles.buttonText}>Click Picture</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.imageContainer}>
                        <Text style={styles.predictionText}>
                            {predictResult ? "Predicted Garbage Type: " + predictResult : "Predicted Garbage Type: Predicting..."}
                        </Text>
                        <Image
                            source={{ uri: capturedImage }}
                            style={styles.capturedImage}
                        />
                        <Text style={styles.predictionText}>
                            {disposalInstructions ? "Disposal Instructions: " + disposalInstructions : "Disposal Instructions: Predicting..."}
                        </Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={retakePicture}
                            >
                                <Text style={styles.buttonText}>Dispose More!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="green" />
                    <Text>Initializing Model...</Text>
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
            <StatusBar hidden={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    predictionText: {
        alignSelf: "center",
        backgroundColor: "lightgrey",
        padding: 10,
        width: "100%",
        textAlign: "center",
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
        resizeMode: "cover",
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
