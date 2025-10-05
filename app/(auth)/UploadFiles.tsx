import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { CurrencyPickerModal } from '@/components/currencyPickerModal';
import { CustomMainView } from '@/components/customMainView';
import { headerSettings } from '@/utils';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage } from '@react-native-firebase/storage';
import { usePreventRemove } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, useColorScheme, View } from "react-native";
import { Icon, useTheme } from 'react-native-paper';
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
      false,
    ), [navigation, colorScheme]
  );
  usePreventRemove(loading, ({ data }) => {});

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
    }else{
      console.log("picker canceled")
    }
    setLoading(false)
  }
  
  const readImages = async (token: string, images_urls: string[]) => {
    const response = await fetch('http://192.168.1.84:8080/analyze-bank-transactions', {
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

  return (
    <CustomMainView loading={loading} className='p-8 pb-14'>
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
            <SecondaryButton className="mt-4" text={t("selectAgain")} disabled={loading} onPress={pickImageAsync} />
            <PrimaryButton className="mt-4" text={loading ? t("loading") : t("upload")} disabled={loading} onPress={uploadImage} />
          </View> :
          <View className='flex-1'>
            <View className='flex-1 p-8 flex-wrap justify-center dark:bg-darkMode-background bg-background border-dashed border-2 border-onSurface dark:border-darkMode-onSurface mt-4 rounded-xl'>
              <Image
                source={require('@/assets/images/image-icon.png')} 
                resizeMode='contain'
                className="h-36 w-full"
              />
              <Text className='text-center text-xl text-onSurface dark:text-darkMode-onSurface'>{t("addYourImages")}</Text>
            </View>
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