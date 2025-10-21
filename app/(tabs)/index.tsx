//TODO: utilise react query for db calls
//TODO: research above useLiveQuery from drizzle or expo-sqlite
import { useQuery } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { eq } from 'drizzle-orm';
import { entries, categories } from '@/db/schema';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { FilterIcon } from 'lucide-react-native';
import * as React from 'react';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { EntryCard } from '@/components/EntryCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const result = await drizzleDb
        .select({
          entryId: entries.entryId,
          title: entries.title,
          status: entries.status,
          coverImageUrl: entries.coverImageUrl,
          userRating: entries.userRating,
          categoryName: categories.name,
        })
        .from(entries)
        .leftJoin(categories, eq(entries.categoryId, categories.categoryId))
        .orderBy(entries.updatedAt);
      return result;
    },
  });

  const statuses = ['current', 'planned', 'completed', 'dropped', 'hold'];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      {/* Filters */}
      <View className="p-4 border-b border-border">
        <Button variant="outline" className="flex-row items-center gap-2">
          <Icon as={FilterIcon} size={16} />
          <Text>Filters</Text>
        </Button>
      </View>

      {/* Collapsible Sections */}
      <ScrollView className="flex-1">
        {statuses.map((status) => {
          const statusEntries = entriesData?.filter(entry => entry.status === status) || [];
          return (
            <CollapsibleSection key={status} title={status.charAt(0).toUpperCase() + status.slice(1)} count={statusEntries.length}>
              <View className="px-4 pb-4">
                {statusEntries.map((entry) => (
                  <EntryCard key={entry.entryId} entry={entry} />
                ))}
              </View>
            </CollapsibleSection>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
