import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react-native';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, count, children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View className="border-b border-border">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 bg-muted/50"
      >
        <Text className="text-lg font-semibold">
          {title} ({count})
        </Text>
        <Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} size={20} />
      </TouchableOpacity>
      {isExpanded && <View>{children}</View>}
    </View>
  );
}