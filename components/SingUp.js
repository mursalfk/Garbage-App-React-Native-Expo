import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";

import "../services/Config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Import your logo image
import logoImage from "../assets/icon.png"; // Replace with the actual path to your image

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const auth = getAuth()

  const createUser = () => {
    console.log(email, password)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        onChangeLoggedInUser(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? <Text
          style={styles.loginText}
        >Sign In</Text></Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={createUser}>
        <Text style={styles.buttonText}>Create</Text>
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
  loginLink: {
    marginTop: 10,
    textAlign: 'center',
  },
  loginText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'lightblue',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
