import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={({ route }) => {
        const skip = (route.params as { skipAnimation?: string })?.skipAnimation;
        return {
          headerShown: true,
          title: 'Home',
          animation: skip === '1' ? 'none' : 'slide_from_right',
        }
      }} />
      {/*<Stack.Screen name='home' options={{headerShown: true, title: 'Home'}} />
      <Stack.Screen name='RealHome' options={{headerShown: false}} />*/}
      <Stack.Screen name='EmailVerification' options={{title: t("verifyYourEmail")}}/>
      <Stack.Screen name='SelectTransactionType' options={{animation: 'none', headerShown: false}}/>
    </Stack>
  )
}
export default Layout;