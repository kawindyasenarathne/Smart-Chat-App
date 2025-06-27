import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, Button, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from "expo-navigation-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {

    // NavigationBar.setBackgroundColorAsync("");

    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassaword] = useState("");
    const [getName, setName] = useState("AB");

    const [loaded, error] = useFonts(
        {
            'Fredoka-Regular': require("../assets/fonts/Fredoka-Regular.ttf"),
            'Fredoka-Light': require("../assets/fonts/Fredoka-Light.ttf"),
            'Fredoka-SemiBold': require("../assets/fonts/Fredoka-SemiBold.ttf"),
        }
    );

    useEffect(
        () => {
            async function checkUser() {
                try {

                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson != null) {
                        router.replace("/home");
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            checkUser();
        }, []
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

        <LinearGradient colors={[ '']} style={stylesheet.view1}>

            <StatusBar backgroundColor={"#C3E0FD"} />

            <ScrollView>

                <View style={stylesheet.scrollview1}>

                    {/* <Image source={logoPath} style={stylesheet.image1} contentFit={"contain"} /> */}

                    <Text style={stylesheet.text1}>Sign In</Text>

                    <Text style={stylesheet.text2}>Hello! Welcome to Chat"Me"</Text>

                    <View style={stylesheet.avatar1}>
                        <Text style={stylesheet.text1}>{getName}</Text>
                    </View>

                    <Text style={stylesheet.text3}>Mobile</Text>
                    <TextInput style={stylesheet.input1} inputMode={"tel"} cursorColor={"black"} maxLength={10} onChangeText={
                        (text) => {
                            setMobile(text);
                        }
                    } onEndEditing={
                        async () => {
                            if (getMobile.length == 10) {
                                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/GetLetters?mobile=" + getMobile);

                                if (response.ok) {
                                    let json = await response.json();
                                    setName(json.letters)
                                }
                            }
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

                            let response = await fetch(
                                process.env.EXPO_PUBLIC_URL+"/SignIn",
                                {
                                    method: "POST",
                                    body: JSON.stringify(
                                        {
                                            mobile: getMobile,
                                            password: getPassword,
                                        }
                                    ),
                                    headers: {
                                        "Content-Type": "application/json",
                                    }
                                }
                            );

                            if (response.ok) {
                                let json = await response.json(); //json means a jsvaScript object, not a java json.

                                if (json.success) {
                                    //user registration complete
                                    let user = json.user;
                                    // Alert.alert("Success", "Hi " + user.first_name + " " + json.message);

                                    try {

                                        // console.log(user);
                                        await AsyncStorage.setItem('user', JSON.stringify(user));
                                        router.replace("/home");

                                    } catch (e) {
                                        Alert.alert("Error", "Unable to process your access");
                                    }

                                } else {
                                    //problem occured
                                    Alert.alert("Error", json.message);
                                }

                            }

                        }
                    }>
                        <Text style={stylesheet.text4}>Sign In</Text>
                        <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
                    </Pressable>

                    <Pressable style={stylesheet.pressable2} onPress={
                        () => {
                            router.push("/signup");
                        }
                    }>
                        <Text style={stylesheet.text5}>New User? Go to Sign Up</Text>
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
            paddingVertical: 140,
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
            color: "white",
            alignSelf: "center",
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
            color: "white",
        },

        pressable1: {
            height: 50,
            flexDirection: "row",
            columnGap: 10,
            backgroundColor: "red",
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
            backgroundColor: "#095906",
            borderRadius: 50,
            borderColor: "gray",
            borderWidth: 1,
            height: 75,
            width: 75,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
        },
    }
);
