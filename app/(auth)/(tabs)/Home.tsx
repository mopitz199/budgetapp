import { CustomSafeAreaView } from '@/components/customMainView';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from '@react-native-firebase/auth/lib/modular';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from "expo-router";
import { Button, Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();

  const auth = getAuth()
  const router = useRouter();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

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
    <CustomSafeAreaView style={{ marginBottom: -insets.bottom }} className="bg-background dark:bg-darkMode-background">
      <View className="flex-1">
        <Text>{bottomTabBarHeight}</Text>
        <Text className="text-onSurface dark:text-darkMode-onSurface">Holaassslleel</Text>
        <Button title="Sign Out" onPress={() => signOut(auth)} />
        <BaseHome />
      </View>
    </CustomSafeAreaView>
  )
}
export default Home;