import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, Button, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function signup() {

  const dpLogoPath = require("../assets/images/dpLogo.png");

  const [getImage, setImage] = useState(null);
  // setImage(dpLogoPath);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassaword] = useState("");

  const [loaded, error] = useFonts(
    {
      'Fredoka-Regular': require("../assets/fonts/Fredoka-Regular.ttf"),
      'Fredoka-Light': require("../assets/fonts/Fredoka-Light.ttf"),
      'Fredoka-SemiBold': require("../assets/fonts/Fredoka-SemiBold.ttf"),
    }
  );

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  const logoPath = require("../assets/favicon.png");
  // const logoPath = require("./assets/images/logo.gif");

  return (

    <LinearGradient colors={['']} style={stylesheet.view1}>

      <ScrollView>

        <View style={stylesheet.scrollview1}>

          {/* <Image source={logoPath} style={stylesheet.image1} contentFit={"contain"} /> */}

          <Text style={stylesheet.text1}>Create Account</Text>

          <Text style={stylesheet.text2}>Hello! Welcome to Chat"Me"</Text>

          <View style={stylesheet.view2}>

            <View style={stylesheet.view3}>
              <Text style={stylesheet.text3}>Mobile</Text>
              <TextInput style={stylesheet.input1} inputMode={"tel"} cursorColor={"black"} maxLength={10} onChangeText={
                (text) => {
                  setMobile(text);
                }
              } />
            </View>

            <Pressable onPress={
              async () => {

                let result = await ImagePicker.launchImageLibraryAsync(
                  {
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  }
                );

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                }

              }
            } style={stylesheet.avatar1}>
              <Image source={getImage == null ? dpLogoPath : getImage} style={stylesheet.avatar1} contentFit={"contain"} />
            </Pressable>
          </View>

          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} cursorColor={"black"} onChangeText={
            (text) => {
              setFirstName(text);
            }
          } />

          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} cursorColor={"black"} onChangeText={
            (text) => {
              setLastName(text);
            }
          } />

          <Text style={stylesheet.text3}>Password</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} maxLength={20} secureTextEntry={true} cursorColor={"black"} onChangeText={
            (text) => {
              setPassaword(text);
            }
          } />

          <Pressable style={stylesheet.pressable1} onPress={
            async () => {

              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != null) {
                formData.append("avatarImage",
                  {
                    name: "avatar.png",
                    type: "image/png",
                    uri: getImage
                  }
                );
              }

              let response = await fetch(
                "http://192.168.1.183:8080/SmartChat/SignUp",
                {
                  method: "POST",
                  body: formData
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  //user registration complete
                  router.replace("/");

                } else {
                  //problem occured
                  Alert.alert("Error", json.message);
                }

              }

            }
          }>
            <Text style={stylesheet.text4}>Sign Up</Text>
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
          </Pressable>

          <Pressable style={stylesheet.pressable2} onPress={
            () => {
              router.push("/");
            }
          }>
            <Text style={stylesheet.text5}>Already Registered? Go to Sign In</Text>
          </Pressable>

        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create(
  {
    view1: {
      flex: 1,
      justifyContent: "center",
    },

    scrollview1: {
      paddingVertical: 87,
      paddingHorizontal: 20,
      rowGap: 10,
      justifyContent:"center",
    },

    view2: {
      flexDirection: "row",
      justifyContent: "center",
      columnGap: 20,
      marginTop: 15,
    },

    view3: {
      flex: 3,
      rowGap: 10
    },

    text1: {
      fontSize: 30,
      fontFamily: "Fredoka-SemiBold",
      color: "white",
      alignSelf: "center",
    },

    text2: {
      fontSize: 18,
      fontFamily: "Fredoka-Light",
      alignSelf: "center",
      color:"white",
    },

    text3: {
      fontSize: 16,
      fontFamily: "Fredoka-SemiBold",
      color: "white",
    },

    text4: {
      fontSize: 22,
      color: "white",
      fontFamily: "Fredoka-Regular",
    },

    text5: {
      fontSize: 17,
      fontFamily: "Fredoka-Light",
      color: "white",
    },

    image1: {
      marginBottom: 10,
      width: "100%",
      height: 70,
    },

    input1: {
      width: "100%",
      height: 50,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 15,
      paddingStart: 10,
      fontSize: 18,
      fontFamily: "Fredoka-Regular",
      borderColor: "white",
      color:"white",
    },

    pressable1: {
      height: 50,
      flexDirection: "row",
      columnGap: 10,
      backgroundColor: "#095906",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      marginTop: 10,
      backgroundColor: "#095906",
    },

    pressable2: {
      height: 25,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },

    avatar1: {
      flex: 1,
      borderRadius: 200,
      height: 80,
      width: 80,
      alignSelf: "center",
    },
  }
);
