import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function HomePage({ navigation }) {

    const disposeGarbage = () => {
        console.log("Dispose Garbage Clicked");
        navigation.navigate('Detect Garbage');
    };

    const showLeaderboard = () => {
        console.log("Leaderboard Button Clicked");
        navigation.navigate('Leaderboard');
    };

    const logoutButton = () => {
        console.log("Logout Logic Here");
        navigation.navigate('Landing Screen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={disposeGarbage}>
                    <Text style={styles.buttonText}>Dispose Garbage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={showLeaderboard}>
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '80%', // Set the width to 80% of the parent container
        alignItems: 'stretch', // Align items along the cross axis (stretch means to fill the entire width)
    },
    button: {
        backgroundColor: 'lightblue',
        paddingVertical: 15,
        marginBottom: 10, // Add margin bottom to create space between buttons
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
