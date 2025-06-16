import auth from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View
} from "react-native";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';

import { GoogleButton, PrimaryButton } from '@/components/buttons';
import { Input } from '@/components/inputs';
import { sleep } from '@/utils';

export default function Index() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  // Somewhere in your code
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response: any = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log("user", response.data);
        const googleCredential = auth.GoogleAuthProvider.credential(
          response.data.idToken,
        );
        console.log("google credential", googleCredential);
        await auth().signInWithCredential(googleCredential);
      } else {
        console.log('Sign in cancelled by the user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log('Error code:', error);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Sign in already in progress');
            Alert.alert('Information', 'Sign in already in progress', [{text: 'OK'}]);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            console.log('Play services not available or outdated');
            Alert.alert('Error', 'Play services not available or outdated', [{text: 'OK'}]);
            break;
          default:
            Alert.alert('Error', 'Please try again later', [{text: 'OK'}]);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log('An error that is not related to google sign in occurred:', error);
        Alert.alert('Error', 'Please try again later', [{text: 'OK'}]);
      }
    }
  }


  const signUp = async () => {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    /*try {
      const {user} = await auth().createUserWithEmailAndPassword(email, password);
      user.sendEmailVerification();
      alert("Check your email!")
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message)
    } finally {
      setLoading(false);
    }*/
  }

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      alert("Check your email!")
    } catch (e: any) {
      const err = e as FirebaseError;
      console.log("sign in error", err);
      Alert.alert('Error', 'Wrong email or password', [{text: 'OK'}]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 p-10 pt-20 bg-background">
      <SafeAreaView className="flex-1 justify-center">
        <View className="flex-1 items-center grow-[1] justify-end">
          <Image source={require('@/assets/images/logo.png')} resizeMode='contain' className="h-28 w-full" />
          <Image source={require('@/assets/images/logo-title.png')} resizeMode='contain' className="h-14 w-full mt-4" />
        </View>
        <View className="flex-1 pt-6 grow-[2] justify-start">
          {loading ? (
              <ActivityIndicator size={'large'} className="flex-1"/>
            ) : (
              <View>
                <View>
                  <KeyboardAvoidingView behavior="padding" className="">
                    <Input className='mb-2' value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />
                    <Text className='pl-2 mb-2 text-error text-lg'>Invalid email</Text>
                    <Input className='mb-2' value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" />
                    <Text className='pl-2 mb-2 text-error text-lg'>Wrong password</Text>
                    <PrimaryButton className='mt-2 mb-4' onPress={signIn} text={"Log In"}/>
                  </KeyboardAvoidingView>
                  <Text className="text-right text-primaryTextOverLight">Forgot Password?</Text>
                </View>
                <View className="flex-row">
                  <View className='flex-1 grow-[1] border-t border-divider mt-4'></View>
                  <Text className='text-end text-2xl mr-4 ml-4 text-secondaryTextOverLight'>or</Text>
                  <View className='flex-1 grow-[1] border-t border-divider mt-4'></View>
                </View>
                <View>
                  <GoogleButton onPress={googleSignIn} className='mt-4'/>
                  <View className='flex-row items-center justify-center mt-4'>
                    <Text className='text-md text-primaryTextOverLight'>Don't have an account?
                      <Text onPress={signUp} className="text-md text-linkTextOverLight"> Sign Up</Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}
        </View>
      </SafeAreaView>
    </View>
  );
}
