import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
//Import userLocation from location Context
import { useLocation } from "../contexts/LocationContext";

//Import moment for date and time
import moment from "moment";
import axios from "axios";

const CameraScreen = () => {
  const { currentUserLocation } = useLocation();

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [tweet, setTweet] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  // Take picture function
  const takePicuter = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        base64: true,
      });
      setImage(data.uri); // use URI in frontend
      setImageBase64(data.base64);
    }
  };

  //   Pick an image from the photo-library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
      // quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setImageBase64(result.base64);
    }
  };

  // clear image
  const clearTweet = () => {
    setImage(null);
    setTweet("");
    setImageBase64("");
  };

  //Send tweet to server
  const handleTweet = () => {
    setLoading(true);
    if (tweet === "") {
      setLoading(false);
      return Alert.alert("Error Message", "Please add text to your tweet", [
        { text: "OK", onPress: clearTweet() },
      ]);
    }

    let tweetDate = moment().format("hh:mm:ss a");
    // Send REQUEST to server handel tweet request API
    axios
      .post("http://localhost:5000/tweet", {
        date: tweetDate,
        tweet: tweet,
        userLocation: currentUserLocation,
        postPhoto: imageBase64,
      })
      .then((res) => {
        // feedback on success: sucessful upload, alert and clean
        const URL = "https://twitter.com";
        return Alert.alert(
          "Success Message",
          `Tweet was successfully created at: ${res.data.created_at}`,
          [
            { text: "OK", onPress: clearTweet() },
            {
              text: "Open in Twitter",
              onPress: () =>
                Linking.openURL(URL).catch((err) =>
                  console.error("An error occurred", err)
                ),
            },
          ]
        );
      })
      .catch((error) => {
        //  error from server or message error status(400)
        if (error.response.status === 500) {
          Alert.alert("Error Message", `Bad connection on the server`, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          let errorMessage = error.response.data.msg;
          Alert.alert("Error Message", errorMessage, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
      });
    setLoading(false);
  };

  // handeling permission errors
  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return alert("No access to camera");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cameraConatiner}>
        <Camera
          style={styles.fixedRatio}
          ref={(ref) => setCamera(ref)}
          type={type}
          ratio={"4:5"}
        />
      </View>
      <View style={styles.cameraIcons}>
        <TouchableOpacity onPress={() => pickImage()}>
          <MaterialIcons name="photo-library" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => takePicuter()}>
          <MaterialIcons name="camera" size={60} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons name="flip-camera-ios" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {image && (
        <View style={styles.tweetImg}>
          <View>
            <Image source={{ uri: image }} style={styles.pickedImage} />
            <MaterialIcons
              style={{ position: "absolute", top: -15, right: -15 }}
              name="cancel"
              size={30}
              color="grey"
              onPress={() => clearTweet()}
            />
          </View>

          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setTweet(text)}
            placeholder="Write your tweet . . ."
          />
          <TouchableOpacity
            style={{ backgroundColor: "black", padding: 20, borderRadius: 50 }}
            onPress={handleTweet}
          >
            <AntDesign name="twitter" size={26} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  cameraConatiner: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 0.7, //return to 1 if the camera view is to big, when adding top&bottom navigations
  },
  cameraIcons: {
    flex: 1,
    // backgroundColor: "black",
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-around",
    alignItems: "center",
    // marginBottom: 20,
  },
  tweetImg: {
    flex: 1,
    marginTop: 50,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-around",
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  pickedImage: {
    height: 100,
    width: 75,
    borderRadius: 5,
    borderWidth: 4,
    borderColor: "gray",
    resizeMode: "cover",
  },
  textInput: {
    height: 100,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    width: Dimensions.get("window").width / 2,
    borderColor: "gray",
    borderWidth: 1,
  },
});
