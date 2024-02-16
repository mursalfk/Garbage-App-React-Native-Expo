import React from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";

// Import your image
import landingImage from "../assets/landing-icon.png"; // Replace with the actual path to your image

export default function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Image source={landingImage} style={styles.image} />
            <Text style={styles.title}>Welcome to the Garbage Detector App</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '75%', // Adjust the width as needed
        height: "20%", // Adjust the height as needed
        marginBottom: 20, // Add margin bottom to create space between the image and buttons
    },
    buttonContainer: {
        width: '80%',
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
