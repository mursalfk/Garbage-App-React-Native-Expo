import React, { useState } from "react";
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";

export default function Leaderboard({ navigation }) {
    const disposeGarbage = () => {
        console.log("Dispose Garbage Clicked");
        // navigation.navigate('HomePage');
    };

    const homePageButton = () => {
        navigation.navigate('HomePage');
    };

    // Sample data for the leaderboard
    const leaderboardData = [
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        { name: "User 1", score: 100 },
        { name: "User 2", score: 90 },
        { name: "User 3", score: 80 },
        { name: "User 4", score: 70 },
        // Add more data as needed
    ];

    return (
        <View style={styles.container}>
            {/* Leaderboard title */}
            <Text style={styles.title}>Leaderboard</Text>
            
            {/* Leaderboard */}
            <View style={styles.leaderboard}>
                <FlatList
                    data={leaderboardData}
                    renderItem={({ item }) => (
                        <View style={styles.leaderboardItem}>
                            <Text style={styles.leaderboardText}>{item.name}</Text>
                            <Text style={styles.leaderboardText}>{item.score}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={disposeGarbage}>
                    <Text style={styles.buttonText}>Dispose Garbage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={homePageButton}>
                    <Text style={styles.buttonText}>Back to Homepage</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    leaderboard: {
        flex: 1,
        marginBottom: 20,
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    leaderboardText: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
