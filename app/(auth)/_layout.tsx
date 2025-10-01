import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerBackButtonMenuEnabled: false,
      }}
    >
      <Stack.Screen name='(tabs)' options={({ route }) => {
        const skip = (route.params as { skipAnimation?: string })?.skipAnimation;
        return {
          headerShown: false,
          title: 'Home',
          animation: skip === '1' ? 'none' : 'slide_from_right',
        }
      }} />
      {/*<Stack.Screen name='home' options={{headerShown: true, title: 'Home'}} />
      <Stack.Screen name='RealHome' options={{headerShown: false}} />*/}
      <Stack.Screen name='EmailVerification'/>
      <Stack.Screen name='SelectTransactionType' options={{animation: 'fade_from_bottom', headerShown: false}}/>
      <Stack.Screen name='TransactionsPreview'/>
      <Stack.Screen name='UploadFiles'/>
    </Stack>
  )
}
export default Layout;