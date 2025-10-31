// HomeScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Image } from 'expo-image';
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { desc, eq } from "drizzle-orm";

import { entries, categories } from "@/db/schema";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "lucide-react-native";

// Import the details screen
import DetailsScreen from "@/components/DetailsScreen";

type Status = "current" | "planned" | "completed" | "dropped" | "hold";

interface EntryRow {
  entryId: string;
  title: string;
  status: Status;
  coverImageUrl?: string | null;
  tier?: "S" | "A" | "B" | "C" | "D" | "E" | null;
  isFavorite?: boolean | number | null;
  categoryName?: string | null;
  updatedAt: number;
}

const { width } = Dimensions.get("window");
const CARD_SPACING = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_SPACING * 2) / 3;

function EntryCard({ entry, onPress }: { entry: EntryRow; onPress: () => void }) {
  const fav = !!entry.isFavorite;
  
  const getTierColor = (tier: string | null | undefined) => {
    switch (tier) {
      case "S": return "bg-purple-500";
      case "A": return "bg-blue-500";
      case "B": return "bg-green-500";
      case "C": return "bg-yellow-500";
      case "D": return "bg-orange-500";
      case "E": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <TouchableOpacity 
      className="mb-3 bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm"
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Cover Image */}
      <View className="relative">
        {entry.coverImageUrl ? (
          <Image
            source={entry.coverImageUrl}
            className="w-full rounded-t-xl bg-muted"
            style={{ height: CARD_WIDTH * 1.4 }}
          />
        ) : (
          <View 
            className="w-full bg-muted justify-center items-center rounded-t-xl"
            style={{ height: CARD_WIDTH * 1.4 }}
          >
            <Text className="text-xs text-muted-foreground text-center px-2">
              No Image
            </Text>
          </View>
        )}

        {/* Favorite Badge */}
        {fav && (
          <View className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
            <Icon as={StarIcon} size={12} className="text-yellow-400" fill="#facc15" />
          </View>
        )}

        {/* Tier Badge */}
        {entry.tier && (
          <View className={`absolute top-2 left-2 ${getTierColor(entry.tier)} rounded-md px-2 py-0.5`}>
            <Text className="text-xs font-bold text-white">{entry.tier}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-2">
        <Text 
          className="text-xs font-semibold mb-1" 
          numberOfLines={2}
          style={{ minHeight: 32 }}
        >
          {entry.title}
        </Text>

        {entry.categoryName && (
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {entry.categoryName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function CollapsibleSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const getStatusColor = (title: string) => {
    switch (title.toLowerCase()) {
      case "current": return "text-green-500";
      case "completed": return "text-blue-500";
      case "planned": return "text-purple-500";
      case "dropped": return "text-red-500";
      case "hold": return "text-orange-500";
      default: return "text-foreground";
    }
  };

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setIsExpanded((s) => !s)}
        className="flex-row items-center justify-between px-4 py-3 bg-muted/30 rounded-lg mx-4 mb-3"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-2">
          <Text className={`text-base font-bold ${getStatusColor(title)}`}>
            {title}
          </Text>
          <View className="bg-muted px-2 py-0.5 rounded-full">
            <Text className="text-xs font-medium text-muted-foreground">{count}</Text>
          </View>
        </View>
        <Icon 
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon} 
          size={20} 
          className="text-muted-foreground"
        />
      </TouchableOpacity>

      {isExpanded && <View>{children}</View>}
    </View>
  );
}

export default function HomeScreen() {
  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);

  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const statuses: Status[] = useMemo(
    () => ["current", "planned", "completed", "dropped", "hold"],
    []
  );

  const {
    data: rows = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<EntryRow[]>({
    queryKey: ["entries-with-category"],
    queryFn: async () => {
      const res = await db
        .select({
          entryId: entries.entryId,
          title: entries.title,
          status: entries.status,
          coverImageUrl: entries.coverImageUrl,
          tier: entries.tier,
          isFavorite: entries.isFavorite,
          categoryName: categories.name,
          updatedAt: entries.updatedAt,
        })
        .from(entries)
        .leftJoin(categories, eq(entries.categoryId, categories.categoryId))
        .orderBy(desc(entries.updatedAt));
      return res;
    },
    staleTime: 1000 * 60 * 2,
  });

  const grouped = useMemo(() => {
    const map = new Map<Status, EntryRow[]>();
    statuses.forEach((s) => map.set(s, []));
    rows.forEach((r) => {
      const s = (r.status as Status) ?? "planned";
      const arr = map.get(s) ?? [];
      arr.push(r);
      map.set(s, arr);
    });
    return map;
  }, [rows, statuses]);

  const totalCount = rows.length;

  // If an entry is selected, show details screen
  if (selectedEntryId) {
    return (
      <DetailsScreen
        entryId={selectedEntryId}
        onBack={() => setSelectedEntryId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-muted-foreground">Loading your tracker...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-lg font-semibold mb-2">Failed to load entries</Text>
          <Text className="text-muted-foreground mb-6 text-center">
            Something went wrong. Please try again.
          </Text>
          <Button onPress={() => refetch()} size="lg">
            <Text>Retry</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 border-b border-border/50">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-bold">My Tracker</Text>
            <Text className="text-sm text-muted-foreground mt-0.5">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} tracked
            </Text>
          </View>

          <Button
            variant="outline"
            size="sm"
            className="flex-row items-center gap-1.5"
            onPress={() => {
              /* open filter modal */
            }}
          >
            <Icon as={FilterIcon} size={16} />
            <Text className="text-sm">Filter</Text>
          </Button>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4 pb-6">
          {statuses.map((status) => {
            const items = grouped.get(status) ?? [];
            if (items.length === 0) return null;
            
            return (
              <CollapsibleSection
                key={status}
                title={status.charAt(0).toUpperCase() + status.slice(1)}
                count={items.length}
              >
                <View 
                  className="px-4 flex-row flex-wrap"
                  style={{ gap: CARD_SPACING }}
                >
                  {items.map((entry) => (
                    <EntryCard 
                      key={entry.entryId} 
                      entry={entry}
                      onPress={() => setSelectedEntryId(entry.entryId)}
                    />
                  ))}
                </View>
              </CollapsibleSection>
            );
          })}

          {totalCount === 0 && (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-lg font-semibold mb-2">No entries yet</Text>
              <Text className="text-muted-foreground text-center px-8">
                Start tracking your favorite anime, dramas, novels, and more!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}