import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import "../services/Config";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";


const auth = getAuth();

export default function HomePage({ navigation }) {

    const disposeGarbage = () => {
        navigation.navigate('Detect Garbage');
    };

    const showLeaderboard = () => {
        navigation.navigate('Leaderboard');
    };

    const logoutButton = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Landing Screen');
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out. Please try again."); // Example error message handling
        }
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
        backgroundColor: 'green',
        paddingVertical: 15,
        marginBottom: 10, // Add margin bottom to create space between buttons
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
