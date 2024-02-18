import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from "react-native";
import { db } from "../services/Config";
import { collection, getDocs } from "firebase/firestore";

export default function Leaderboard({ navigation }) {
    const [leaderboardDataDB, setLeaderboardDataDB] = useState([]);
    const [animatedValues, setAnimatedValues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ name: doc.data().name, score: doc.data().score });
                });
                data.sort((a, b) => b.score - a.score);
                setLeaderboardDataDB(data);
                setAnimatedValues(Array(data.length).fill(new Animated.Value(0)));
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        animateRows();
    }, [animatedValues]);

    const animateRows = () => {
        animatedValues.forEach((value, index) => {
            Animated.timing(value, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        });
    };

    const disposeGarbage = () => {
        navigation.navigate('Detect Garbage');
    };

    const homePageButton = () => {
        navigation.navigate('HomePage');
    };

    return (
        <View style={styles.container}>
            {/* Leaderboard title */}
            <Text style={styles.title}>Leaderboard</Text>

            {/* Leaderboard */}
            <View style={styles.leaderboard}>
                <FlatList
                    data={leaderboardDataDB}
                    renderItem={({ item, index }) => (
                        <Animated.View style={[styles.leaderboardItem(index), { opacity: animatedValues[index] }]}>
                            <Text style={styles.leaderboardText(index)}>{item.name}</Text>
                            <Text style={styles.leaderboardText(index)}>{item.score}</Text>
                        </Animated.View>
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
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'green',
        width: '60%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
        color: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leaderboard: {
        flex: 1,
        marginBottom: 20,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    leaderboardItem: (index) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: index === 0 ? '#006400' : index === 1 ? '#3CB371' : index === 2 ? '#90EE90' : '#d4d4d4',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }),
    leaderboardText: (index) => ({
        fontSize: index === 0 ? 24 : index === 1 ? 20 : 16 || index === 2 ? 18 : 16,
        color: index === 0 ? 'white' : '#000000',
        fontWeight: index === 0 ? 'bold' : 'normal',
    }),
    buttonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingBottom: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 20,
        backgroundColor: 'rgb(255, 255, 255)',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
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
