import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from "react-native";
import { db } from "../services/Config";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';

const auth = getAuth();

export default function Leaderboard({ navigation }) {
    const [leaderboardDataDB, setLeaderboardDataDB] = useState([]);
    const [animatedValues, setAnimatedValues] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const flatListRef = useRef(null);

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

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                getDoc(doc(db, "users", user.uid)).then((doc) => {
                    if (doc.exists()) {
                        setCurrentUser(doc.data());
                        const index = leaderboardDataDB.findIndex(item => item.name === doc.data().name);
                        if (index >= 0) {
                            flatListRef.current.scrollToIndex({ animated: true, index });
                        } else {
                            flatListRef.current.scrollToEnd({ animated: true });
                        }
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        });

        fetchData();
        return () => unsubscribe();
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
            <Text style={styles.title}>Leaderboard</Text>
            <FlatList
                ref={flatListRef}
                data={leaderboardDataDB}
                renderItem={({ item, index }) => (
                    <Animated.View style={[styles.leaderboardItem(index), {
                        opacity: animatedValues[index],
                        borderColor: item.name === currentUser?.name ? '#aa0000' : 'transparent',
                        borderLeftWidth: item.name === currentUser?.name ? 10 : 1,
                    }]}>
                        <Text style={styles.leaderboardText(index)}>{item.name === currentUser?.name ? item.name + '' : item.name}</Text>
                        <Text style={styles.leaderboardText(index)}>{item.score}</Text>
                    </Animated.View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.leaderboard}
            />

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={disposeGarbage}>
                    <Text style={styles.buttonText}>Dispose Garbage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={homePageButton}>
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
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: '#006400',
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
        flexGrow: 1,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20,
    },
    leaderboardItem: (index) => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: index === 0 ? 'green' : index === 1 ? '#3CB371' : index === 2 ? '#90EE90' : '#d4d4d4',
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
        fontSize: index === 0 ? 20 : index === 1 ? 18 : 14 || index === 2 ? 16 : 14,
        color: index === 0 ? 'white' : '#000000',
        fontWeight: index === 0 ? 'bold' : 'normal',
    }),
    buttonsContainer: {
        flexDirection: 'row',
        paddingBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 20,
        backgroundColor: 'rgb(255, 255, 255)',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
