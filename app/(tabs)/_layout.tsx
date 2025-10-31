import { Tabs } from 'expo-router';
import { HomeIcon, PlusIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
          },
          tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#666666',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color, size }) => <PlusIcon color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}