import { CustomSafeAreaView } from '@/components/customMainView';
import { logger } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getCrashlytics, recordError } from '@react-native-firebase/crashlytics';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from "expo-router";
import { Button, Pressable, Text, useColorScheme, View } from "react-native";
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  const auth = getAuth()
  const router = useRouter();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const sendLog = () => {
    const crashlytics = getCrashlytics();
    logger("Send the logs to Crashlytics");
    recordError(crashlytics, new Error('Ejemplo de pruebaaaa'));
  }

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
      <View className="flex-1 p-4">
        <View className='flex-row justify-end'>
          <Ionicons
            name="settings-outline"
            size={24}
            onPress={() => router.push('/(auth)/Settings')}
            color={colors.onSurface}
            style={{
              padding: 4,
              borderRadius: 16
            }} />
        </View>
        <Text>{bottomTabBarHeight}</Text>
        <Text className="text-onSurface dark:text-darkMode-onSurface">Holaassslleel</Text>

        <Button title="Crash" onPress={() => {sendLog()}} />
        <Button title="Sign Out" onPress={() => signOut(auth)} />
        <BaseHome />
      </View>
    </CustomSafeAreaView>
  )
}
export default Home;