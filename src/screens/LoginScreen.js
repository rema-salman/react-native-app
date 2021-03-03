import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";
import { Foundation, Entypo } from "@expo/vector-icons";

export default function LoginScreen() {
  //  fix this later
  const signIn = () => {
    console.log("Login clicked later");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Foundation name="social-500px" size={200} color="black" />

      <Pressable onPress={signIn}>
        <Entypo
          style={{ marginRight: "10px" }}
          name="twitter"
          size={24}
          color="white"
        />
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    width: 300,
    padding: 20,
    backgroundColor: "black",
  },
});
