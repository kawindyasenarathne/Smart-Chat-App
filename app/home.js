import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();

export default function home() {

    const dpLogoPath = require("../assets/images/dpLogo.png");

    const [getUser, setUser] = useState([]);
    const [getChatArray, setChatArray] = useState([]);

    // NavigationBar.setBackgroundColorAsync("#C3E0FD");

    const [loaded, error] = useFonts(
        {
            'Fredoka-Regular': require("../assets/fonts/Fredoka-Regular.ttf"),
            'Fredoka-Light': require("../assets/fonts/Fredoka-Light.ttf"),
            'Fredoka-SemiBold': require("../assets/fonts/Fredoka-Medium.ttf"),
        }
    );

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                setUser(user);

                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();

                    if (json.success) {

                        let chatArray = json.jsonChatArray;
                        setChatArray(chatArray);

                    }

                }

            }

            fetchData();
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

    return (
        <LinearGradient colors={['']} style={stylesheet.view1}>

            <StatusBar backgroundColor={"#B9FDD5"} />

            <FlashList
                data={getChatArray}
                renderItem={
                    ({ item }) =>
                        <Pressable style={stylesheet.view5} onPress={
                            () => {
                                router.push(
                                    {
                                        pathname: "/chat",
                                        params: {item:JSON.stringify(item), userId:getUser.id},
                                    }
                                );
                            }
                        }>

                            <View style={item.other_user_status == 1 ? stylesheet.view6_2 : stylesheet.view6_1}>

                                {item.avatar_image_found ?
                                    <Image source={process.env.EXPO_PUBLIC_URL+"/AvatarImages/" + item.other_user_mobile + ".png"} style={stylesheet.image1} contentFit={"contain"} />
                                    :
                                    <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                                }

                            </View>

                            <View style={stylesheet.view4}>
                                <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                                <Text style={stylesheet.text4} numberOfLines={1}>{item.message}</Text>

                                <View style={stylesheet.view7}>
                                    <Text style={stylesheet.text5}>{item.dateTime}</Text>
                                    <FontAwesome6 name={item.chat_status_id == 1 ? "check-double" : "check"} color={item.chat_status_id == 1 ? "green" : "gray"} size={15} />
                                </View>

                            </View>

                        </Pressable>
                }
                estimatedItemSize={200}
            />

            <View style={stylesheet.view2}>

                <View style={stylesheet.view3}></View>

                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text1}>{getUser.first_name + " " + getUser.last_name}</Text>
                    <Text style={stylesheet.text2}>{getUser.mobile}</Text>
                    <Text style={stylesheet.text3}>{getUser.registered_date_time}</Text>
                </View>

                <Pressable style={stylesheet.view8} onPress={
                    async ()=>{
                        await AsyncStorage.removeItem("user");
                        router.replace("/");
                    }
                }>
                    <FontAwesome6 name={"right-from-bracket"} size={20} color={"white"}/>
                </Pressable>

            </View>

        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
        },
        view8:{

        },

        view2: {
            flexDirection: "row",
            columnGap: 20,
            alignItems: "center",
            marginBottom: 20,
        },

        view3: {
            width: 80,
            height: 80,
            backgroundColor: "purple",
            borderRadius: 40,
        },

        view4: {
            flex: 1,
        },

        text1: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 24,
            color:"white",
        },

        text2: {
            fontFamily: "Fredoka-Regular",
            fontSize: 18,
            color:"white",
        },
        text3: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
            color:"white",
        },

        view5: {
            flexDirection: "row",
            alignContent: "center",
            columnGap: 20,
            marginVertical: 7,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 20,
            padding: 15,
        },

        view6_1: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#050545",
            borderStyle: "dotted",
            borderWidth: 3,
            borderColor: "red",
            justifyContent: "center",
            alignItems: "center",
        },

        view6_2: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#050545",
            borderStyle: "dotted",
            borderWidth: 3,
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
        },

        text4: {
            fontFamily: "Fredoka-Regular",
            fontSize: 16,
            color:"white",
        },

        text5: {
            fontFamily: "Fredoka-Regular",
            fontSize: 13,
            alignSelf: "flex-end",
            color:"white",
        },

        view7: {
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: "center",
        },

        image1: {
            width: 75,
            height: 75,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 40,
        },

        text6: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 35,
            color: "white",
        },

    }
);