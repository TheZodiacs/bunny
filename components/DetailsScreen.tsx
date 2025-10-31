import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { eq } from "drizzle-orm";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";

import { entries, entryParts, categories } from "@/db/schema";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ArrowLeftIcon,
  StarIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react-native";
import { ProgressSlider } from "@/app/(tabs)/create/components/ProgressSlider";

type Status = "current" | "planned" | "completed" | "dropped" | "hold";
type Tier = "S" | "A" | "B" | "C" | "D" | "E";
type ReleaseStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

interface EntryDetails {
  entryId: string;
  categoryId: string;
  title: string;
  coverImageUrl?: string | null;
  description?: string | null;
  genres?: string[] | null;
  releaseYear?: number | null;
  releaseStatus?: ReleaseStatus | null;
  status: Status;
  tier?: Tier | null;
  isFavorite?: boolean | number | null;
  notes?: string | null;
  completedDate?: string | null;
  categoryName?: string | null;
  createdAt: number;
  updatedAt: number;
}

interface EntryPart {
  partId: string;
  entryId: string;
  currentPart: number;
  totalParts: number;
  partType: "season" | "volume" | "arc" | "part";
  currentProgress: number;
  totalProgress?: number | null;
  progressUnit?: "episodes" | "chapters" | "pages" | null;
  status: Status;
  completedDate?: string | null;
  createdAt: number;
  updatedAt: number;
}

interface EntryDetailsScreenProps {
  entryId: string;
  onBack: () => void;
}

const STATUS_CONFIG = {
  current: {
    label: "Watching",
    color: "text-green-400",
    bg: "bg-green-400/20",
    icon: PlayIcon,
  },
  planned: {
    label: "Plan to Watch",
    color: "text-purple-400",
    bg: "bg-purple-400/20",
    icon: ClockIcon,
  },
  completed: {
    label: "Completed",
    color: "text-blue-400",
    bg: "bg-blue-400/20",
    icon: CheckCircleIcon,
  },
  dropped: {
    label: "Dropped",
    color: "text-red-400",
    bg: "bg-red-400/20",
    icon: XCircleIcon,
  },
  hold: {
    label: "On Hold",
    color: "text-orange-400",
    bg: "bg-orange-400/20",
    icon: PauseIcon,
  },
};

const TIER_COLORS = {
  S: "bg-purple-500",
  A: "bg-blue-500",
  B: "bg-green-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  E: "bg-red-500",
};

export default function EntryDetailsScreen({ entryId, onBack }: EntryDetailsScreenProps) {
  const sqliteDb = useSQLiteContext();
  const db = drizzle(sqliteDb);
  const queryClient = useQueryClient();

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [localStatus, setLocalStatus] = useState<Status | null>(null);
  const [localTier, setLocalTier] = useState<Tier | null>(null);
  const [localFavorite, setLocalFavorite] = useState<boolean>(false);
  const [localPartsCount, setLocalPartsCount] = useState<number>(0);
  const [localProgressPercent, setLocalProgressPercent] = useState<number>(0);
  const [localProgress, setLocalProgress] = useState({ parts: 0, progress: 0 });
  const [imageError, setImageError] = useState(false);

  // Fetch entry details
  const { data: entry, isLoading, isError } = useQuery<any>({
    queryKey: ["entry-details", entryId],
    queryFn: async () => {
      const res = await db
        .select({
          entryId: entries.entryId,
          categoryId: entries.categoryId,
          title: entries.title,
          coverImageUrl: entries.coverImageUrl,
          description: entries.description,
          genres: entries.genres,
          releaseYear: entries.releaseYear,
          releaseStatus: entries.releaseStatus,
          status: entries.status,
          tier: entries.tier,
          isFavorite: entries.isFavorite,
          notes: entries.notes,
          completedDate: entries.completedDate,
          categoryName: categories.name,
          createdAt: entries.createdAt,
          updatedAt: entries.updatedAt,
        })
        .from(entries)
        .leftJoin(categories, eq(entries.categoryId, categories.categoryId))
        .where(eq(entries.entryId, entryId))
        .limit(1);
      return res[0];
    },
  });

  useEffect(() => {
    if (entry) {
      setNotesValue(entry.notes || "");
      setLocalStatus(entry.status);
      setLocalTier(entry.tier || null);
      setLocalFavorite(!!entry.isFavorite);
      setImageError(false); // reset if entry changed
    }
  }, [entry]);

  // Fetch entry parts
  const { data: parts = [] } = useQuery<any>({
    queryKey: ["entry-parts", entryId],
    queryFn: async () => {
      const res = await db
        .select()
        .from(entryParts)
        .where(eq(entryParts.entryId, entryId))
        .orderBy(entryParts.currentPart);
      return res;
    },
  });

  useEffect(() => {
    if (parts && Array.isArray(parts)) {
      const totalParts = parts.length;
      const totalProgress = parts.reduce((acc: number, part: any) => acc + (part.currentProgress || 0), 0);
      const maxProgress = parts.reduce((acc: number, part: any) => acc + (part.totalProgress || 0), 0);
      const percent = maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0;
      setLocalProgress({ parts: totalParts, progress: percent });
      setLocalPartsCount(totalParts);
      setLocalProgressPercent(percent);
    }
  }, [parts]);

  // Update mutation
  const updateMutation = useMutation<any, any, any>({
    mutationFn: async (updates: Record<string, any>) => {
      await db.update(entries).set({ ...updates, updatedAt: Date.now() }).where(eq(entries.entryId, entryId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry-details", entryId] });
      queryClient.invalidateQueries({ queryKey: ["entries-with-category"] });
    },
  });

  const toggleFavorite = () => {
    setLocalFavorite((v) => !v);
    // intentionally not persisted until Save Changes is pressed
  };

  const handleSaveNotes = () => {
    updateMutation.mutate({ notes: notesValue });
    setEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setNotesValue(entry?.notes || "");
    setEditingNotes(false);
  };

  const handleStatusChange = (status: Status) => {
    setLocalStatus(status);
  };

  const handleTierChange = (tier: Tier) => {
    setLocalTier(tier);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-muted-foreground">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !entry) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-lg font-semibold mb-2">Entry not found</Text>
          <Button onPress={onBack} className="mt-4">
            <Text>Go Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const totalProgress = parts.reduce((acc: number, part: any) => acc + (part.currentProgress || 0), 0);
  const maxProgress = parts.reduce((acc: number, part: any) => acc + (part.totalProgress || 0), 0);
  const overallProgress = maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0;

  const hasChanges =
    (localStatus && localStatus !== entry.status) ||
    (localTier !== null && localTier !== entry.tier) ||
    localFavorite !== !!entry.isFavorite ||
    notesValue !== (entry.notes || "") ||
    localPartsCount !== parts.length ||
    localProgressPercent !== overallProgress;

  const handleSaveAll = async () => {
    const updates: Record<string, any> = {};
    if (localStatus && localStatus !== entry.status) {
      updates.status = localStatus;
      if (localStatus === "completed" && !entry.completedDate) updates.completedDate = new Date().toISOString();
    }
    if (localTier !== null && localTier !== entry.tier) updates.tier = localTier;
    if (localFavorite !== !!entry.isFavorite) updates.isFavorite = localFavorite;
    if (notesValue !== (entry.notes || "")) updates.notes = notesValue;

    if (Object.keys(updates).length > 0) {
      await updateMutation.mutateAsync(updates);
    }
  };

  const handleCancelAll = () => {
    setLocalStatus(entry.status);
    setLocalTier(entry.tier || null);
    setLocalFavorite(!!entry.isFavorite);
    setNotesValue(entry.notes || "");
    setLocalPartsCount(parts.length);
    setLocalProgressPercent(overallProgress);
  };

  // Helper for Image source (expo-image expects either a number for static resources or an object {uri})
  const coverSource = entry.coverImageUrl && !imageError ? { uri: entry.coverImageUrl } : null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
 
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Central Content */}
          {/* Hero Banner Section with Blur Background */}
        <View className="relative h-80 overflow-hidden">
          {/* Background Blur Image */}
          {coverSource && (
            <View className="absolute inset-0">
              <Image
                source={coverSource}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <BlurView intensity={100} tint="dark" style={{ position: "absolute", inset: 0 }} />
              <View className="absolute inset-0 bg-black/40" />
            </View>
          )}

          {/* Header Controls */}
          <View className="flex-row items-center justify-between px-4 py-3 z-10">
            <TouchableOpacity onPress={onBack} className="p-2 -ml-2 active:opacity-70 bg-black/30 rounded-full">
              <Icon as={ArrowLeftIcon} size={24} className="text-white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} className="p-2 -mr-2 bg-black/30 rounded-full">
              <Icon
                as={StarIcon}
                size={24}
                className={localFavorite ? "text-yellow-400" : "text-white"}
                fill={localFavorite ? "#facc15" : "none"}
              />
            </TouchableOpacity>
          </View>

          {/* Cover Image */}
          <View className="flex-1 items-center justify-center pt-4">
            {coverSource ? (
              <Image
                source={coverSource}
                style={{ width: 140, height: 200, borderRadius: 16 }}
                contentFit="cover"
                onError={() => setImageError(true)}
                transition={250}
              />
            ) : (
              <View className="w-36 h-52 rounded-2xl bg-white/10 items-center justify-center">
                <Text className="text-white/60">No Image</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 pt-6 pb-32">
          {/* Title */}
          <Text className="text-2xl font-bold text-center text-foreground mb-2">
            {entry.title}
          </Text>

          {/* Category & Release Year */}
          <View className="flex-row items-center justify-center gap-2 mb-4">
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-primary">{entry.categoryName}</Text>
            </View>
             {localTier && (
            <View className="items-center mb-6">
              <View className={`${TIER_COLORS[localTier]} px-6 py-2 rounded-full shadow-lg`}>
                <Text className="text-xl font-black text-white">Tier {localTier}</Text>
              </View>
            </View>
            )}
          </View>


          {/* Progress Section */}
          <View className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
            <Text className="text-foreground mb-3">Progress Tracking</Text>

            {/* Status */}
            <View className="mb-4">
              <Text className="text-white/80 text-sm font-medium mb-2">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {(Object.keys(STATUS_CONFIG) as Status[]).map((status) => {
                  const config = STATUS_CONFIG[status];
                  const isSelected = localStatus === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      onPress={() => handleStatusChange(status)}
                      className={`px-3 py-2 rounded-lg ${isSelected ? config.bg : "bg-white/10"} active:opacity-70`}
                    >
                      <Text className={`${isSelected ? config.color : "text-white/60"} text-xs font-medium`}>{config.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Tier */}
            <View className="mb-4">
              <Text className="text-white/80 text-sm font-medium mb-2">Tier</Text>
              <View className="flex-row flex-wrap gap-2">
                {(["S", "A", "B", "C", "D", "E"] as Tier[]).map((tier) => {
                  const isSelected = localTier === tier;
                  return (
                    <TouchableOpacity
                      key={tier}
                      onPress={() => handleTierChange(tier)}
                      className={`px-3 py-2 rounded-lg ${isSelected ? TIER_COLORS[tier] : "bg-white/10"} active:opacity-70`}
                    >
                      <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-white/60"}`}>{tier}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Progress Sliders */}
            <View>
              <Text className="text-white/80 text-sm font-medium mb-2">Progress</Text>
              <View className="flex-row items-center gap-3 mb-3">
                <ProgressSlider
                  currentProgress={localProgress.parts}
                  totalUnits={Math.max(1, localPartsCount)}
                  progressUnit="Part"
                  label="Current Part"
                  onChange={(value: number) => setLocalProgress((prev) => ({ ...prev, parts: value }))}
                />
                <ProgressSlider
                  currentProgress={localProgress.progress}
                  totalUnits={100}
                  progressUnit="%"
                  label="Overall Progress"
                  onChange={(value: number) => {
                    setLocalProgress((prev) => ({ ...prev, progress: value }));
                    setLocalProgressPercent(value);
                  }}
                />
              </View>
            </View>
          </View>

          {/* Personal Notes */}
          <View className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
            <Text className="text-foreground mb-3">Personal Notes</Text>
            {editingNotes ? (
              <TextInput
                className="bg-white/10 rounded-xl p-4 text-white text-sm leading-5"
                value={notesValue}
                onChangeText={setNotesValue}
                placeholder="Add your personal notes..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={4}
                style={{ minHeight: 80, textAlignVertical: "top" }}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingNotes(true)} className="bg-white/10 rounded-xl p-4 min-h-[80px]">
                <Text className="text-white text-sm leading-5">{entry.notes || "Add your personal notes..."}</Text>
              </TouchableOpacity>
            )}

            {/* Quick save/cancel when editing notes */}
            {editingNotes && (
              <View className="flex-row justify-end gap-2 mt-3">
                <Button variant="outline" onPress={handleCancelNotes} className="border-white/20">
                  <Text className="text-white">Cancel</Text>
                </Button>
                <Button onPress={handleSaveNotes}>
                  <Text className="text-black font-semibold">Save</Text>
                </Button>
              </View>
            )}
          </View>

          {/* Content Details */}
          <View className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
            <Text className="text-foreground mb-3">Content Details</Text>
            <Text className="text-white/80 text-sm font-medium mb-2">Category</Text>
            <Text className="text-white/60 mb-3">{entry.categoryName}</Text>
            <Text className="text-white/80 text-sm font-medium mb-2">Description</Text>
            <Text className="text-white/60 mb-3">{entry.description || "No description available."}</Text>
            <Text className="text-white/80 text-sm font-medium mb-2">Genres</Text>
            <Text className="text-white/60 mb-3">{entry.genres?.join(", ") || "No genres available."}</Text>
            <Text className="text-white/80 text-sm font-medium mb-2">Release Year</Text>
            <Text className="text-white/60 mb-3">{entry.releaseYear || "N/A"}</Text>
            <Text className="text-white/80 text-sm font-medium mb-2">Release Status</Text>
            <Text className="text-white/60 mb-3">{entry.releaseStatus || "N/A"}</Text>
          </View>

          
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {hasChanges && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm border-t border-white/10 z-50">
          <View className="flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-transparent border-white/20" onPress={handleCancelAll}>
              <Text className="text-white">Cancel</Text>
            </Button>
            <Button className="flex-1 bg-white" onPress={handleSaveAll}>
              <Text className="text-black font-semibold">Save Changes</Text>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
