// ============================================
// CoverImagePreview.tsx
import React from "react"
import { View } from "react-native"
import { Image } from 'expo-image';
import { Text as UIText } from '@/components/ui/text'

interface CoverImagePreviewProps {
    coverImageUrl: string
}

export function CoverImagePreview({ coverImageUrl }: CoverImagePreviewProps) {
    return (
        <View className="items-center mb-6">
            {coverImageUrl ? (
                <Image
                    source={coverImageUrl}
                    className="w-48 h-72 rounded-lg bg-muted"
                />
            ) : (
                <View className="w-48 h-72 rounded-lg bg-muted items-center justify-center">
                    <UIText className="text-muted-foreground">No image</UIText>
                </View>
            )}
        </View>
    )
}
