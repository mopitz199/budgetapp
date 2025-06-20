import { getAuth } from '@react-native-firebase/auth';
import { Button, Text, View } from "react-native";

const Home = () => {
  const auth = getAuth()
  const user = auth.currentUser;
  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Button title="Sign out" onPress={() => {
        auth.signOut()
      }}/>
    </View>
  )
}
export default Home;