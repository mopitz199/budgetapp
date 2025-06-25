import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

const Home = () => {

  const router = useRouter();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const BaseHome = () => {
    return (
      <Pressable className='
        bg-primary
        w-20 h-20
        rounded-2xl
        justify-center
        items-center
        absolute
        bottom-10
        right-10
        shadow-sm'
        onPress={() => router.replace(
          {
            pathname: '/(auth)/SelectTransactionType',
            params: { bottomTabBarHeight: bottomTabBarHeight },
          }
        )}
      >
        <Ionicons name="add-outline" size={35} color="#FFFFFF" />
      </Pressable>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <Text>{bottomTabBarHeight}</Text>
        <BaseHome />
      </View>
    </SafeAreaView>
  )
}
export default Home;