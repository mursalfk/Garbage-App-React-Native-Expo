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
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

export default function DetectGarbage({ navigation, route }) {
    const { model } = route.params;
    if (model) console.log("model received");
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [isLive, setIsLive] = useState(true);
    const cameraRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [predictResult, setPredictResult] = useState("");
    const [disposalInstructions, setDisposalInstructions] = useState("");

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
        }
    };

    const transformImageToTensor = async (uri) => {
        console.log(uri);
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
        console.log("predict", uri);
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
        
        const disposalInstruction = generateDisposalInstruction(predictResult);
        setDisposalInstructions(disposalInstruction)
        
        console.log("Instructions", disposalInstruction);
        console.log("Predictions", classes[predictedClass]);
    };

    // Function to generate disposal instructions based on garbage type
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
        setCapturedImage(null);
        setIsLive(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.predictionText}>
                {predictResult ? "Predicted Garbage Type: " + predictResult : "Click Picture to Predict Garbage"}
            </Text>
            <Text style={styles.predictionText}>
                {disposalInstructions ? "Disposal Instructions: " + disposalInstructions : ""}
            </Text>
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
        justifyContent: "center",
        alignItems: "center",
    },
    predictionText: {
        alignSelf: "center",
        marginVertical: 10,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    camera: {
        flex: 1,
        width: "100%",
        aspectRatio: 3/4, // Adjust the aspect ratio as needed
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
        width: "100%",
    },
    capturedImage: {
        flex: 1,
        width: "100%",
        aspectRatio: 3/4, // Adjust the aspect ratio as needed
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
