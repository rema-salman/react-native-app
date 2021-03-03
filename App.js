import { StatusBar } from "expo-status-bar";
import React from "react";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { LocationProvider } from "./src/contexts/LocationContext";

// import LoginScreen from "./src/screens/LoginScreen";

import MapScreen from "./src/screens/MapScreen";
import CameraScreen from "./src/screens/CameraScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <LocationProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
          }}
          // initialRouteName="Login"
          initialRouteName="Map"
        >
          {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          // options={{ headerShown: false }}
        /> */}

          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>
      </LocationProvider>
    </NavigationContainer>
  );
}
