import AsyncStorage from "@react-native-async-storage/async-storage"

async function arrow(){

    const user = {
        Name:"name",
        mobile:"mobile"
    }
    await AsyncStorage.setItem("user",JSON.stringify(user));

}