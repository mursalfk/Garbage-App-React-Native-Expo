import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import logoImage from "../assets/icon.png";
import "../services/Config";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const auth = getAuth()
  const db = getFirestore();

  const createUser = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user;
      const userData = {
        name: name,
        email: email,
        uid: user.uid,
        score: 0,
      }
      await addDoc(collection(db, "users"), userData);

      alert("Account created successfully!");
      navigation.navigate('Landing Screen');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error("Error creating user:", errorCode, errorMessage);
      alert(errorMessage);
    }
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
  loginLink: {
    marginTop: 10,
    textAlign: 'center',
  },
  loginText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'green',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});