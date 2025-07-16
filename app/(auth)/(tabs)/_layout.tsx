import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={() => {
        const isDark = useColorScheme() === 'dark';
        return {
          headerShown: false,
          tabBarActiveTintColor: '#0057FF',
          tabBarInactiveTintColor: isDark ? '#FFFFFF' : '#1D2430',
          tabBarStyle: {
            backgroundColor: isDark ? '#1D2430' : '#F3F4F6',
            borderTopWidth: 0,
          }
        }
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Stats"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
