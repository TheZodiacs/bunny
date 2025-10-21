// AdditionalInfoSection.tsx
import React from "react"
import { View } from "react-native"
import { Controller, Control } from "react-hook-form"
import { Text as UIText } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FormData, ReleaseStatus } from './FormTypes'

interface AdditionalInfoSectionProps {
    control: Control<FormData>
}

const RELEASE_STATUS_OPTIONS: ReleaseStatus[] = ["ongoing", "completed", "hiatus", "cancelled"]

export function AdditionalInfoSection({ control }: AdditionalInfoSectionProps) {
    return (
        <View className="mb-6">
            <UIText className="text-lg font-semibold mb-4">Additional Info</UIText>

            <Controller
                control={control}
                name="coverImageUrl"
                render={({ field: { onChange, value } }) => (
                    <View className="mb-4">
                        <UIText className="text-sm font-medium mb-2">Cover Image</UIText>
                        <Input
                            value={value}
                            onChangeText={onChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </View>
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <View className="mb-4">
                        <UIText className="text-sm font-medium mb-2">Description</UIText>
                        <Textarea
                            value={value}
                            onChangeText={onChange}
                            placeholder="Enter description..."
                            numberOfLines={4}
                        />
                    </View>
                )}
            />

            <Controller
                control={control}
                name="genres"
                render={({ field: { onChange, value } }) => (
                    <View className="mb-4">
                        <UIText className="text-sm font-medium mb-2">Genres</UIText>
                        <Input
                            value={value}
                            onChangeText={onChange}
                            placeholder="Action, Drama, Comedy (comma-separated)"
                        />
                    </View>
                )}
            />

            <Controller
                control={control}
                name="releaseYear"
                render={({ field: { onChange, value } }) => (
                    <View className="mb-4">
                        <UIText className="text-sm font-medium mb-2">Release Year</UIText>
                        <Input
                            value={String(value ?? "")}
                            onChangeText={onChange}
                            placeholder="2024"
                            keyboardType="numeric"
                        />
                    </View>
                )}
            />

            <Controller
                control={control}
                name="releaseStatus"
                render={({ field: { onChange } }) => (
                    <View className="mb-4">
                        <UIText className="text-sm font-medium mb-2">Release Status</UIText>
                        <View className="border border-border rounded-md overflow-hidden bg-background">
                            <Select onValueChange={onChange} className="w-full">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="w-[calc(92%)]">
                                    {RELEASE_STATUS_OPTIONS.map((status) => (
                                        <SelectItem label={status} key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}
