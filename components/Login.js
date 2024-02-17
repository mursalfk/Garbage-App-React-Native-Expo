import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
// import firebase from 'firebase/app';
// import 'firebase/auth';

import "../services/Config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, collection, getDocs } from "firebase/firestore"; 


// Import your logo image
import logoImage from "../assets/icon.png"; // Replace with the actual path to your image

const auth = getAuth();

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checking = () => {
    // Here you can add your sign-in logic
    console.log("Signing in with:", username, password);
    // Example navigation to another screen
    navigation.navigate('HomePage');
  };

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in successfully!", user.uid)
        const usersCollection = collection(db, "users", user.uid);
        // console.log(usersCollection.id);
        const usersSnapshot = await getDocs(usersCollection);
        
        usersSnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
        alert("Signed in successfully!");
        navigation.navigate('HomePage');
        onChangeLoggedInUser(user.username);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error signing in. Please try again."); // Example error message handling
      });
  };

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.createAccountText}>Don't have an account? <Text
          style={styles.createAccountLink}
          onPress={() => navigation.navigate('SignUp')}
        >Create Account</Text></Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
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
  logo: {
    width: 100, // Adjust the width and height as needed for your logo
    height: 100,
    borderRadius: 50, // Make it circular by setting half of the width/height as the border radius
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  createAccountLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  createAccountText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
