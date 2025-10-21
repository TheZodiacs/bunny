
import React from "react"
import { View, ScrollView, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text as UIText } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CoverImagePreview } from './create/CoverImagePreview'
import { StatusSelector } from './create/StatusSelector'
import { ProgressSection } from './create/ProgressSection'
import { AdditionalInfoSection } from './create/AdditionalInfoSection'
import { FormData, MediaType } from './create/FormTypes'

const MEDIA_TYPE_OPTIONS: MediaType[] = ["anime", "manga", "light novel", "visual novel"]

export default function EntryForm() {
    const { control, handleSubmit, watch, reset } = useForm<FormData>({
        defaultValues: {
            title: "",
            category: "",
            status: "planned",
            rating: 0,
            tier: "B",
            notes: "",
            completedDate: "",
            coverImageUrl: "",
            description: "",
            genres: "",
            releaseYear: new Date().getFullYear().toString(),
            releaseStatus: "ongoing",
            partType: "season",
            partNumber: 1,
            partTitle: "",
            totalUnits: 12,
            progressUnit: "episodes",
            currentProgress: 0,
        },
    })

    const status = watch("status")
    const totalUnits = Number(watch("totalUnits") ?? 0)
    const currentProgress = Number(watch("currentProgress") ?? 0)
    const progressUnit = watch("progressUnit")
    const coverImageUrl = watch("coverImageUrl")

    const onSubmit = (data: FormData) => {
        console.log("Form submitted:", data)
        Alert.alert("Success", "Entry created successfully!")
        reset()
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 48 }}>
                <UIText className="text-2xl font-bold mb-1">Add New Entry</UIText>
                <UIText className="text-sm text-muted-foreground mb-4">
                    Track your favorite anime, novels, and media
                </UIText>

                <CoverImagePreview coverImageUrl={coverImageUrl} />

                {/* MANDATORY SECTION */}
                <View className="mb-6">
                    <Controller
                        control={control}
                        name="title"
                        rules={{ required: "Title is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View className="mb-4">
                                <UIText className="text-sm font-medium mb-2">
                                    Title <UIText className="text-destructive">*</UIText>
                                </UIText>
                                <Input
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="Enter title"
                                />
                                {error && (
                                    <UIText className="text-destructive text-sm mt-1">
                                        {error.message}
                                    </UIText>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="category"
                        rules={{ required: "Category is required" }}
                        render={({ field: { onChange }, fieldState: { error } }) => (
                            <View className="mb-4">
                                <UIText className="text-sm font-medium mb-2">
                                    Category <UIText className="text-destructive">*</UIText>
                                </UIText>
                                <View className="border border-border rounded-md overflow-hidden bg-background">
                                    <Select onValueChange={onChange} className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="w-[calc(92%)]">
                                            {MEDIA_TYPE_OPTIONS.map((type) => (
                                                <SelectItem label={type} key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </View>
                                {error && (
                                    <UIText className="text-destructive text-sm mt-1">
                                        {error.message}
                                    </UIText>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { onChange, value } }) => (
                            <StatusSelector value={value} onChange={onChange} />
                        )}
                    />

                    <ProgressSection
                        control={control}
                        status={status}
                        totalUnits={totalUnits}
                        currentProgress={currentProgress}
                        progressUnit={progressUnit}
                    />
                </View>

                <AdditionalInfoSection control={control} />

                {/* Submit / Clear */}
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <Button onPress={handleSubmit(onSubmit)} className="w-full">
                            <UIText>Create Entry</UIText>
                        </Button>
                    </View>
                    <View className="flex-1">
                        <Button onPress={() => reset()} variant="outline" className="w-full">
                            <UIText>Clear</UIText>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}