import auth from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Text, TextInput, View } from "react-native";

export default function Index() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      alert("Check your email!")
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      alert("Check your email!")
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Login failed: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center items-center border-2 border-gray-500 rounded-sm">
      <Text className="text-5xl text-light-600 border-2 border-gray-500 rounded-sm flex-grow w-full text-center">Welcome!!</Text>
      <KeyboardAvoidingView behavior="padding" className="border-2 border-gray-500 rounded-sm flex-grow w-full">
        <TextInput
          className="text-3xl border-2 border-gray-500 rounded-sm"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
        />
        <TextInput
          className="text-3xl border-2 border-gray-500 rounded-sm"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        <View>
          {loading ? (
            <ActivityIndicator size={'small'} className="text-3xl border-2 border-gray-500 rounded-sm mt-6"/>
          ) : (
            <>
              <Button onPress={signIn} title="Login"/>
              <Button onPress={signUp} title="Create account"/>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
