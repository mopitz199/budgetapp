import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SelectTransactionType = () => {

  const router = useRouter();

  const ButtonsSelection = () => {
    let { bottomTabBarHeight } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    bottomTabBarHeight = bottomTabBarHeight as string;

    return (
      <View className="
        justify-center
        items-center
        absolute
        bottom-10
        right-10
        "
        style={{
          marginBottom: parseInt(bottomTabBarHeight) - (Platform.OS === 'ios' ? insets.bottom : 0)
        }}
      >
        <View className='flex-1'>
          <View className='flex-row items-center justify-end mb-8 mr-2'>
            <Text className='m-4 text-xl text-primaryTextOverLight'>Manually</Text>
            <Pressable className='
              bg-surfaceCard
              border-divider
              border
              w-16 h-16
              rounded-2xl
              justify-center
              items-center
              shadow-sm
              '
            >
              <Ionicons name="hand-right-outline" size={30} color="#0057FF" />
            </Pressable>
          </View>
          <View className='flex-row items-center justify-end mb-8 mr-2'>
            <Text className='m-4 text-xl text-primaryTextOverLight'>Upload files</Text>
            <Pressable className='
              bg-surfaceCard
              border-divider
              border
              w-16 h-16
              rounded-2xl
              justify-center
              items-center
              shadow-sm
              '
              onPress={() => router.push('/(auth)/UploadFiles')}
            >
              <Ionicons name="document-outline" size={30} color="#0057FF" />
            </Pressable>
          </View>
          <View className='flex-1 items-end'>
            <Pressable className='
              bg-primary
              w-20 h-20
              rounded-2xl
              justify-center
              items-center
              shadow-sm
              '
              onPress={() => router.replace(
                {
                  pathname: '/Home',
                  params: { skipAnimation: '1' },
                }
              )}
            >
              <Ionicons name="close-outline" size={35} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <ButtonsSelection />
      </View>
    </SafeAreaView>
  )
}
export default SelectTransactionType;