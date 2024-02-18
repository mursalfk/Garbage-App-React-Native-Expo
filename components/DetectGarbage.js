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
            predictImage(data.uri);
        }
    };

    const transformImageToTensor = async (uri) => {
        console.log(uri);
        //.ts: const transformImageToTensor = async (uri:string):Promise<tf.Tensor>=>{
        //read the image as base64
        const img64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
        const raw = new Uint8Array(imgBuffer);
        let imgTensor = decodeJpeg(raw);
        // const scalar = tf.scalar(255);
        //resize the image
        imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
        //normalize; if a normalization layer is in the model, this step can be skipped
        // const tensorScaled = imgTensor.div(scalar);
        //final shape of the rensor
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
        console.log("Predictions", classes[predictedClass]);
    };

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
