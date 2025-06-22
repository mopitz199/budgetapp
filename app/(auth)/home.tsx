import { getAuth } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, Image, Text, View } from "react-native";
import uuid from 'react-native-uuid';

const Home = () => {
  const auth = getAuth()
  const user = auth.currentUser;
  let token = ""

  const [imageUri, setImageUri] = useState("");

  const getToken = async () => {
    if(user){
      token = await user.getIdToken();
      readImage(token)
      console.log("Token: ", token)
    }
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: .1,
    })

    if(!result.canceled){
      console.log("result picker", result)
      uploadImage(result["assets"][0]["uri"])
    }else{
      console.log("picker canceled")
    }
  }

  const readImage = async (token: string) => {
    const response = await fetch('http://localhost:8080/analyze-bank-transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // 👈 Enviar token como Bearer
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        images_url: [
          "https://upload.wikimedia.org/wikipedia/commons/c/cb/BankStatementChequing.png"
        ]
      }),
    });
    console.log(response)
  }

  const uploadImage = async (uri: string) => {
    //setImageUri(uri)
    //const storage = getStorage()
    const path = `/statements/${user?.uid}/${uuid.v4()}`
    const reference = storage().ref(path);
    
    try {
      console.log("Mandar a cargar")
      const task = reference?.putFile(uri);
      // const url = await reference?.getDownloadURL();
      // console.log("URL de descarga:", url);

      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      task.then(() => {
        console.log('Image uploaded to the bucket!');
      });

    } catch (err) {
      console.log("error", err)
    }
  }

  useEffect(() => {
    //console.log(user?.uid) 
    //uploadImage();
    // getToken();
  })

  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Button title="Sign out" onPress={() => {
        auth.signOut()
      }}/>
      <Button title="Pick" onPress={pickImageAsync} />
      <Image
        source={{uri: imageUri}}
        style={{ width: 200, height: 200 }}
      />
    </View>
  )
}
export default Home;