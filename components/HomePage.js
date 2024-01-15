import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../services/Config";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const auth = getAuth();

export default function HomePage({ navigation, route }) {

    const [userName, setUserName] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                getDocs(collection(db, "users")).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.data().uid === uid) {
                            setUserName(doc.data().name);
                        }
                    });
                });
                setUserName(user.displayName);
            } else {
                setUserName("");
            }
        });
        return () => unsubscribe();
    }, []);

    const disposeGarbage = () => {
        navigation.navigate('Detect Garbage');
    };

    const showLeaderboard = () => {
        navigation.navigate('Leaderboard');
    };

    const navigateCredits = () => {
        navigation.navigate('Credits');
    };

    const logoutButton = async () => {
        try {
            await auth.signOut();
            setUser(null);
            navigation.navigate('Landing Screen');
            await AsyncStorage.removeItem('userToken');
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome <Text>{userName}</Text></Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={disposeGarbage}>
                    <Text style={styles.buttonText}>Dispose Garbage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={showLeaderboard}>
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={navigateCredits}>
                    <Text style={styles.buttonText}>Credits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <StatusBar hidden={true} />
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
        width: '80%',
        alignItems: 'stretch',
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
