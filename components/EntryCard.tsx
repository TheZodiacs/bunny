import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { StarIcon } from 'lucide-react-native';

interface Entry {
  entryId: string;
  title: string;
  status: string;
  coverImageUrl?: string | null;
  userRating?: number | null;
  categoryName?: string | null;
}

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <View className="flex-row p-3 mb-2 bg-card rounded-lg border border-border">
      {entry.coverImageUrl && (
        <Image
          source={{ uri: entry.coverImageUrl }}
          className="w-16 h-24 rounded mr-3"
          resizeMode="cover"
        />
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1" numberOfLines={2}>
          {entry.title}
        </Text>
        {entry.categoryName && (
          <Text className="text-sm text-muted-foreground mb-1">
            {entry.categoryName}
          </Text>
        )}
        {entry.userRating && (
          <View className="flex-row items-center">
            <Icon as={StarIcon} size={14} className="text-yellow-500 mr-1" />
            <Text className="text-sm">{entry.userRating}/5</Text>
          </View>
        )}
      </View>
    </View>
  );
}