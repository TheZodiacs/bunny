import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Suspense } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// --- Database Imports ---
import { SQLiteProvider } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import migrations from '../drizzle/migrations';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// A simple component to show while the database is loading
function DatabaseLoading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color='#0000ff' />
      <Text style={{ marginTop: 8 }}>Loading Database...</Text>
    </View>
  );
}

// Separate your main layout content into its own component
function AppLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false, // Example: hide headers globally
          }}
        />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    // The Suspense boundary will show the fallback while the database is initializing
    <Suspense fallback={<DatabaseLoading />}>
      <SQLiteProvider
        databaseName='app.db'
        onInit={async (db) => {
          console.log('🚀 Initializing and migrating database...');
          try {
            await migrate(drizzle(db), migrations);
            console.log('✅ Database migrated successfully');
          } catch (error) {
            console.error('❌ Database migration failed', error);
          }
        }}
        // useSuspense is key to making this work with React Suspense
        useSuspense
      >
        <AppLayout />
      </SQLiteProvider>
    </Suspense>
  );
}