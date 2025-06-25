import { SafeAreaView, Text, View } from "react-native";

export default function Stats() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 border-4 p-5">
        <Text className="text-2xl font-bold">Stats</Text>
        <Text className="mt-4">This is the stats page.</Text>
      </View>
    </SafeAreaView>
  );
}