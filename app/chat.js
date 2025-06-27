import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { autoScroll, FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");


    //get parameters
    const params = useLocalSearchParams();
    const item = JSON.parse(params.item);
    const user_id = params.userId; //get from home

    const [loaded, error] = useFonts(
        {
            'Fredoka-Regular': require("../assets/fonts/Fredoka-Regular.ttf"),
            'Fredoka-Light': require("../assets/fonts/Fredoka-Light.ttf"),
            'Fredoka-SemiBold': require("../assets/fonts/Fredoka-Medium.ttf"),
        }
    );

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );


    //fetch chat array from server
    useEffect(
        () => {
            async function fetchChatArray() {
                // let userJson = await AsyncStorage.getItem("user");
                // let user = JSON.parse(userJson);

                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/LoadChat?logged_user_id=" + user_id + "&other_user_id=" + item.other_user_id);
                if (response.ok) {
                    let chatArray = await response.json();
                    setChatArray(chatArray);
                }
            }

            fetchChatArray();
            setInterval(() => {
                fetchChatArray();
            }, 3000);
        }, []
    );

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={['']} style={stylesheet.view1}>
            <StatusBar backgroundColor={"#B9FDD5"} />

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {item.avatar_image_found ? //or avatar_image_found = "true"
                        <Image style={stylesheet.image1} source={process.env.EXPO_PUBLIC_URL+"/AvatarImages/" + item.other_user_mobile + ".png"} />
                        :
                        <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }
                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                                <Text style={stylesheet.text4}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text3}>{item.datetime}</Text>
                                    {item.side == "right" ?
                                        <FontAwesome6 name={item.status == 1 ? "check-double" : "check"} color={item.status == 1 ? "green" : "gray"} size={15} />
                                        :
                                        null
                                    }

                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />

            </View>

            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} cursorColor={"white"} placeholder="Message here..." value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text)
                    }
                } />
                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {

                        if (getChatText == "") {
                            Alert.alert("Error", "Message is emply");
                        } else {
                            let response = await fetch(process.env.EXPO_PUBLIC_URL+"/SendChat?logged_user_id=" + user_id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Messsage Sent");
                                    setChatText("");
                                }
                            }
                        }

                    }
                }>
                    <FontAwesome6 name={"paper-plane"} color={"white"} size={15} />
                </Pressable>
            </View>

        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
        },

        view2: {
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 15,
            justifyContent: "center",
            alignItems: "center",
        },

        view3: {
            backgroundColor: "black",
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "dashed",
            borderColor: "red",
            borderWidth: 2,
        },

        view4: {
            flex: 1,
        },

        image1: {
            width: 70,
            height: 70,
            borderRadius: 40,
        },

        text1: {
            fontSize: 38,
            fontFamily: "Fredoka-SemiBold",
            alignSelf: "center",
            color:"white",
        },

        text2: {
            fontSize: 25,
            fontFamily: "Fredoka-SemiBold",
            color:"white",
        },

        text3: {
            fontSize: 15,
            fontFamily: "Fredoka-Regular",
            color:"white",
        },

        view5_1: {
            backgroundColor: "#022410",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,
        },

        view5_2: {
            backgroundColor: "#022410",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
        },

        view6: {
            flexDirection: "row",
            columnGap: 10,
            width: "auto",
        },

        text4: {
            fontSize: 16,
            fontFamily: "Fredoka-Regular",
            color:"white",
        },

        view7: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            columnGap: 10,
            paddingHorizontal: 20,
            marginBottom: 10,
        },

        input1: {
            // backgroundColor:"#e8e8e8",
            height: 40,
            borderRadius: 15,
            borderStyle: "solid",
            borderColor:"white",
            borderWidth: 1,
            fontFamily: "Fredoka-Regular",
            fontSize: 20,
            flex: 1,
            paddingStart: 10,
            color:"white",
        },

        pressable1: {
            backgroundColor: "#83a4d4",
            borderRadius: 15,
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
        },

        center_view: {
            flex: 1,
            marginVertical: 20,
        }

    }
);