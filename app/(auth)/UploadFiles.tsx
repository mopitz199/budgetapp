import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { CurrencyPickerModal } from '@/components/currencyPickerModal';
import { CustomMainView } from '@/components/customMainView';
import { headerSettings } from '@/utils';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage } from '@react-native-firebase/storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, useColorScheme, View } from "react-native";
import { Icon } from 'react-native-paper';
import uuid from 'react-native-uuid';

const UploadFiles = () => {

  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // 👉 'light' o 'dark'
  const { colors } = useTheme() as any;

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [images_uri, setImagesURI] = useState<string[]>([]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("uploadYourImages"),
    ), [navigation, colorScheme]
  );

  const pickImageAsync = async () => {
    setLoading(true)
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: .1,
    })

    if(!result.canceled){
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
    const response = await fetch('http://192.168.1.95:8080/analyze-bank-transactions', {
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
              params: {
                transactionsId: data.id,
                selectedCurrency: selectedCurrency,
              },
            }
          )
          setImagesURI([]); // Clear images after successful upload
        }else{
          const errorData = await response.json();
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
    //pickImageAsync();
  }, []);

  return (
    <CustomMainView>
      {loading?
        <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
          <View className='absolute top-0 left-0 right-0 opacity-20 bg-black inset-0 h-max z-10 justify-center' />
          <View className="absolute top-0 left-0 right-0 inset-0 h-max z-20 justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      : null}

      <CurrencyPickerModal
        showCurrencyModal={showCurrencyModal}
        setShowCurrencyModal={setShowCurrencyModal}
        colors={colors}
        currencyValue={selectedCurrency}
        onCurrencyChange={(previousCurrencyValue: string, newCurrencyValue: string) => {
          setSelectedCurrency(newCurrencyValue);
        }}
      />

      <View className="flex-1">
        {images_uri.length > 0 ?
          <View className='flex-1'>
            <ScrollView>
              <View className='flex-1 flex-row p-8 flex-wrap justify-around items-start dark:bg-darkMode-background bg-background'>
                {(images_uri.map((uri, index) => (
                  <View className='w-[50%] p-2 dark:bg-darkMode-background bg-background' key={index}>
                    <View className=' bg-surface rounded-2xl p-2'>
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
            <Text className='text-center text-xl text-onSurface dark:text-darkMode-onSurface'>{t("addYourImages")}</Text>
            <SecondaryButton
              className="mt-4"
              text={selectedCurrency}
              disabled={loading}
              onPress={() => setShowCurrencyModal(true)}
              rightIcon={
                <View className='absolute right-0'>
                  <Icon
                    source="arrow-down-drop-circle"
                    color={colors.primary}
                    size={25}
                  />
                </View>
              }
            />
            <PrimaryButton
              className="mt-4"
              text={loading ? t("loading") : t("select")}
              disabled={loading}
              onPress={pickImageAsync}
            />
          </View>
        }
      </View>
    </CustomMainView>
  )
}
export default UploadFiles;