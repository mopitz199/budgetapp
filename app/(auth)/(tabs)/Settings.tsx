import { SafeAreaView, Text, View } from "react-native";

export default function Settings() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 border-4 p-5">
        <Text className="text-2xl font-bold">Settings</Text>
        <Text className="mt-4">This is the settings page.</Text>
      </View>
    </SafeAreaView>
  );
}