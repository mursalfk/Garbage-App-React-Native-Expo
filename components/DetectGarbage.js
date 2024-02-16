import React, { useState } from "react";
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { RNCamera } from "react-native-camera";
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { Camera, CameraType } from 'expo-camera';


export default function DetectGarbage({ navigation }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission) {
        return ( <View style={styles.container}>
            <Text>No access to camera</Text>
            <Button title="Request Camera Permission" onPress={requestPermission} />
        </View>
        );
    }

    if (!permission.granted) {
        return ( <View style={styles.container}>
            <Text>Permission not granted</Text>
            <Button title="Request Camera Permission" onPress={requestPermission} />
        </View>
        );
    }



    const showLeaderboard = () => {
        console.log("Leaderboard Button Clicked");
        navigation.navigate('Leaderboard');
    };

    const homePageButton = () => {
        navigation.navigate('HomePage');
    };

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.Back))
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={type}>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                {/* <RNCamera
                    style={ViewPropTypes.camera}
                    type={RNCamera.Constants.Type.back}
                    // other camera props
                /> */}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.leaderboardButton} onPress={showLeaderboard}>
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={homePageButton}>
                    <Text style={styles.buttonText}>Back to Homepage</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    leaderboardButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    homeButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
