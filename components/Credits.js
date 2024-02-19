import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function Credits({ navigation }) {
    const openLinkedInProfile = (profileUrl) => {
        Linking.openURL(profileUrl);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Sapienza_Roma_Logo_Complete.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Project by:</Text>
            <View style={styles.studentContainer}>
                <View style={styles.studentRow}>
                    <Image
                        source={require('../assets/Mursal.png')}
                        style={styles.studentImage}
                    />
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>Mursal Furqan Kumbhar</Text>
                        <Text style={styles.rollNumber}>Matricola: 2047419</Text>
                    </View>
                    <TouchableOpacity onPress={() => openLinkedInProfile('https://www.linkedin.com/in/mursalfurqan/')} style={styles.iconContainer}>
                        <Image
                            source={require('../assets/linkedin-icon.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.studentRow}>
                    <Image
                        source={require('../assets/Srinjan.png')}
                        style={styles.studentImage}
                    />
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>Srinjan Ghosh</Text>
                        <Text style={styles.rollNumber}>Matricola: 2053796</Text>
                    </View>
                    <TouchableOpacity onPress={() => openLinkedInProfile('https://www.linkedin.com/in/srinjan-ghosh-09973a195/')} style={styles.iconContainer}>
                        <Image
                            source={require('../assets/linkedin-icon.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomePage')}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <StatusBar hidden={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    image: {
        width: '86%',
        height: 92,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    studentContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '90%',
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#90EE90',
        borderRadius: 25,
        padding: 10,
    },
    studentInfo: {
        flexDirection: 'column',
        marginLeft: 10,
        flex: 1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rollNumber: {
        fontSize: 14,
        color: '#666',
    },
    studentImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    iconContainer: {
        padding: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    backButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'green',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: '80%',
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
