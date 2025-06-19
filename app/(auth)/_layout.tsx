import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name='home' options={{headerShown: true, title: 'Home'}} />
      <Stack.Screen name='EmailVerification' options={{title: t("verifyYourEmail")}}/>
    </Stack>
  )
}
export default Layout;