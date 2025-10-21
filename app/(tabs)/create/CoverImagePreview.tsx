// ============================================
// CoverImagePreview.tsx
import React from "react"
import { View, Image } from "react-native"
import { Text as UIText } from '@/components/ui/text'

interface CoverImagePreviewProps {
    coverImageUrl: string
}

export function CoverImagePreview({ coverImageUrl }: CoverImagePreviewProps) {
    return (
        <View className="items-center mb-6">
            {coverImageUrl ? (
                <Image
                    src={coverImageUrl}
                    className="w-48 h-72 rounded-lg bg-muted"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-48 h-72 rounded-lg bg-muted items-center justify-center">
                    <UIText className="text-muted-foreground">No image</UIText>
                </View>
            )}
        </View>
    )
}
