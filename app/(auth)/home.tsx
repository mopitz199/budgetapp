import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage } from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import uuid from 'react-native-uuid';

const Home = () => {
  const auth = getAuth()
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [images_uri, setImagesURI] = useState<string[]>([]);

  const pickImageAsync = async () => {
    setLoading(true)
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: .1,
    })

    if(!result.canceled){
      console.log("result picker", result)
      let aux_images_uri = []
      for (const asset of result.assets) {
        aux_images_uri.push(asset.uri)
      }
      setImagesURI(aux_images_uri)
      //uploadImage(result["assets"][0]["uri"])
    }else{
      console.log("picker canceled")
    }
    setLoading(false)
  }

  const readImages = async (token: string, images_urls: string[]) => {
    const response = await fetch('http://169.254.17.3:8080/analyze-bank-transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // 👈 Enviar token como Bearer
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        images_url: images_urls
      }),
    });
    return response
  }

  const uploadImage = async () => {
    const auth = getAuth()
    const user = auth.currentUser;

    if(user){
      setLoading(true)

      let images_urls = []
      console.log("images_uri", images_uri)
      for (const uri of images_uri) {
        const path = `/statements/${user?.uid}/${uuid.v4()}`
        const storage = getStorage()
        const reference = storage.ref(path);
        await reference?.putFile(uri);
        const url = await reference?.getDownloadURL();
        images_urls.push(url)
      }

      try {
        console.log("empezar a subir a openai")
        const token = await user.getIdToken();
        const response = await readImages(token, images_urls)
        console.log(response)
      } catch (err) {
        console.log("error", err)
      }
    }else{
      console.log("user does not exist")
    }
    setLoading(false)
  }

  return (
    <View className='flex-1'>
      {/*<Button title="Sign out" onPress={() => {
        auth.signOut()
      }}/>*/}
      {images_uri.length > 0 ?
        <View className='flex-1'>
          <ScrollView>
            <View className='flex-1 flex-row p-2 flex-wrap justify-around items-start bg-background'>
              {(images_uri.map((uri, index) => (
                <View className='w-[50%] p-2 bg-background' key={index}>
                  <View className=' bg-surfaceCard rounded-2xl p-2'>
                    <Image
                      className='h-72 rounded-2xl'
                      resizeMode='contain'
                      key={index}
                      source={{ uri }}
                    />
                  </View>
                </View>
              )))}
            </View>
          </ScrollView>
          <PrimaryButton className="mr-6 ml-6 mb-4" text={loading ? "Loading..." : "Upload"} disabled={loading} onPress={uploadImage} />
          <SecondaryButton className="mr-6 ml-6 mb-10" text="Pick" disabled={loading} onPress={pickImageAsync} />
        </View> :
        <View className='flex-1 justify-center'>
          <PrimaryButton className="m-4" text={loading ? "Loading..." : "Pick"} disabled={loading} onPress={pickImageAsync} />
        </View>
      }
    </View>
  )
}
export default Home;