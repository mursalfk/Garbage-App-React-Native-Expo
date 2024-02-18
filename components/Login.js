import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../services/Config";
import logoImage from "../assets/icon.png";

const auth = getAuth();

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        navigation.navigate("HomePage");
        navigation.navigate('HomePage', { uid: userToken });
      }
    } catch (error) {
      console.error("Error checking login state:", error);
    }
  };

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        alert("Signed in successfully!");
        const uid = user.uid;
        await AsyncStorage.setItem("userToken", uid);
        navigation.navigate('HomePage', { uid });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error signing in. Please try again.");
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
