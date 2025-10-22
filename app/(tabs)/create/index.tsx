
import React from "react"
import { View, ScrollView } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text as UIText } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CoverImagePreview } from './components/CoverImage'
import { StatusSelector } from './components/StatusSelector'
import { ProgressSection } from './components/ProgressSection'
import { FormData, MediaType, ReleaseStatus } from './types/FormTypes'
import { useSQLiteContext } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as schema from '@/db/schema'
import { nanoid } from 'nanoid/non-secure'
import { eq } from 'drizzle-orm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from "@/components/ui/textarea"

const MEDIA_TYPE_OPTIONS: MediaType[] = ["anime", "manga", "light novel", "visual novel"]
const RELEASE_STATUS_OPTIONS: ReleaseStatus[] = ["ongoing", "completed", "hiatus", "cancelled"]


export default function EntryForm() {

    const [dialog, setDialog] = React.useState<{ open: boolean; title: string; description: string }>({ open: false, title: '', description: '' })
    const sqliteDb = useSQLiteContext()
    const db = React.useMemo(() => drizzle(sqliteDb, { schema }), [sqliteDb])
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
            partType: "Season",
            totalParts: 1,
            currentPart: 1,
            partTitle: "",
            totalUnits: 12,
            progressUnit: "Episodes",
            currentProgress: 0,
        },
    })

    const status = watch("status")
    const totalUnits = Number(watch("totalUnits") ?? 0)
    const currentProgress = Number(watch("currentProgress") ?? 0)
    const progressUnit = watch("progressUnit")
    const coverImageUrl = watch("coverImageUrl")
    const currentPart = Number(watch("currentPart") ?? 1)
    const totalParts = Number(watch("totalParts") ?? 1)
    const partType = watch("partType")

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Form Data:", data)
            // Generate IDs and timestamps
            const entryId = nanoid()
            const now = Date.now()
            const categoryName = data.category.value.trim()
            let categoryId: string | undefined

            // Try to get category by name
            const existingCategory = await db
                .select()
                .from(schema.categories)
                .where(eq(schema.categories.name, categoryName))
                .get()

            if (existingCategory) {
                categoryId = existingCategory.categoryId
            } else {
                // Insert new category
                categoryId = nanoid()
                await db.insert(schema.categories).values({
                    categoryId,
                    name: categoryName,
                    lastAccessed: now,
                    ord: 0,
                })
            }

            // Insert into entries table
            await db.insert(schema.entries).values({
                entryId,
                categoryId,
                title: data.title,
                coverImageUrl: data.coverImageUrl,
                description: data.description,
                genres: data.genres.split(',').map((g) => g.trim()).filter(Boolean),
                releaseYear: parseInt(data.releaseYear, 10) || undefined,
                releaseStatus: data.releaseStatus,
                status: data.status,
                tier: data.tier,
                notes: data.notes,
                completedDate: data.completedDate || undefined,
                createdAt: now,
                updatedAt: now,
            })

            // Insert into entryParts for progress tracking
            const partId = nanoid()
            await db.insert(schema.entryParts).values({
                partId,
                entryId,
                currentPart: data.currentPart,
                totalParts: data.totalParts,
                partType: data.partType.toLowerCase() as any,
                currentProgress: data.currentProgress,
                totalProgress: data.totalUnits,
                progressUnit: data.progressUnit.toLowerCase() as any,
                status: data.status,
                completedDate: data.completedDate || undefined,
                createdAt: now,
                updatedAt: now,
            })

            setDialog({ open: true, title: "Success", description: "Entry created and saved to database!" })
            reset()
        } catch (err) {
            console.error(err)
            setDialog({ open: true, title: "Error", description: "Failed to save entry." })
        }
    }

    return (
        <>
            <Dialog open={dialog.open} onOpenChange={open => setDialog(d => ({ ...d, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialog.title}</DialogTitle>
                        <DialogDescription>{dialog.description}</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
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
                        currentPart={currentPart}
                        totalParts={totalParts}
                        partType={partType}
                    />
                </View>

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
        </>
    )
}