import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage } from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import uuid from 'react-native-uuid';

const UploadFiles = () => {

  const { t } = useTranslation();
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
    const response = await fetch('http://192.168.1.85:8080/analyze-bank-transactions', {
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
    const router = useRouter();

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
        const token = await user.getIdToken();
        const response = await readImages(token, images_urls)
        if(response.ok){
          const data = await response.json();
          router.replace(
            {
              pathname: '/(auth)/TransactionsPreview',
              params: { transactionsId: data.id },
            }
          )
          setImagesURI([]); // Clear images after successful upload
        }else{
          const errorData = await response.json();
          console.error("Error processing images:", errorData);
          Alert.alert("Error", "An error occurred while processing the images. Please try again later.");
        }
      } catch (err) {
        Alert.alert("Error", "An error occurred while reading the images. Please try again later.");
      }
    }else{
      Alert.alert("Error", "The user is not authenticated. Please log in again.");
    }
    setLoading(false)
  }

  useEffect(() => {
    pickImageAsync();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {loading?
        <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
          <View className='absolute top-0 left-0 right-0 opacity-20 bg-black inset-0 h-max z-10 justify-center' />
          <View className="absolute top-0 left-0 right-0 inset-0 h-max z-20 justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      : null}

      <View className="flex-1">
        {images_uri.length > 0 ?
          <View className='flex-1'>
            <ScrollView>
              <View className='flex-1 flex-row p-8 flex-wrap justify-around items-start bg-background'>
                {(images_uri.map((uri, index) => (
                  <View className='w-[50%] p-2 bg-background' key={index}>
                    <View className=' bg-surfaceCard rounded-2xl p-2'>
                      <Image
                        className='h-60 rounded-2xl'
                        resizeMode='contain'
                        key={index}
                        source={{ uri }}
                      />
                    </View>
                  </View>
                )))}
              </View>
            </ScrollView>
            <PrimaryButton className="mr-10 ml-10 mb-4 mt-4" text={loading ? t("loading") : t("upload")} disabled={loading} onPress={uploadImage} />
            <SecondaryButton className="mr-10 ml-10 mb-10" text={t("selectAgain")} disabled={loading} onPress={pickImageAsync} />
          </View> :
          <View className='flex-1 justify-center p-10'>
            <Image
              source={require('@/assets/images/image-icon.png')} 
              resizeMode='contain'
              className="h-36 w-full"
            />
            <Text className='text-center text-xl text-primaryTextOverLight'>{t("addYourImages")}</Text>
            <PrimaryButton className="mt-4 p-6" text={loading ? t("loading") : t("select")} disabled={loading} onPress={pickImageAsync} />
          </View>
        }
      </View>
    </SafeAreaView>
  )
}
export default UploadFiles;