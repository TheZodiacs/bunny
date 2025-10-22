// ProgressSection.tsx
import React from "react"
import { View } from "react-native"
import { Controller, Control } from "react-hook-form"
import { Text as UIText } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, type Option } from "@/components/ui/select"
import { ProgressSlider } from './ProgressSlider'
import { FormData, PartType, ProgressUnit, StatusType } from '../types/FormTypes'

interface ProgressSectionProps {
    control: Control<FormData>
    status: StatusType
    totalUnits: number
    currentProgress: number
    progressUnit: ProgressUnit
    currentPart: number
    totalParts: number
    partType: PartType
}

const PART_TYPE_OPTIONS: PartType[] = ["Season", "Volume", "Arc", "Part"]
const PROGRESS_UNIT_OPTIONS: ProgressUnit[] = ["Episodes", "Chapters", "Pages"]

export function ProgressSection({
    control,
    status,
    totalUnits,
    currentProgress,
    progressUnit,
    currentPart,
    totalParts,
    partType
}: ProgressSectionProps) {
    const showProgress = status !== "completed" && status !== "planned"

    return (
        <View className="mb-4 p-4 border border-border rounded-lg bg-muted/30">
            <UIText className="text-foreground mb-3">Progress Tracking</UIText>

            {/* Part Information */}
            <View className="mb-4">
                <View className="flex-row gap-3 mb-3">
                    <Controller
                        control={control}
                        name="totalParts"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <UIText className="text-xs text-muted-foreground mb-1">
                                    Total Parts
                                </UIText>
                                <Input
                                    value={String(value ?? 1)}
                                    onChangeText={(text) => onChange(Number(text) || 1)}
                                    keyboardType="numeric"
                                    placeholder="1"
                                />
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="partType"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <UIText className="text-xs text-muted-foreground mb-1">
                                    Part Type
                                </UIText>
                                <View className="border border-border rounded-md overflow-hidden bg-background">
                                    <Select
                                        onValueChange={(option) => {
                                            if (option) onChange(option.value as PartType);
                                        }}
                                        value={value ? { value: String(value), label: String(value) } : undefined}
                                        className="w-full"
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="w-[calc(41%)]">
                                            {PART_TYPE_OPTIONS.map((type) => (
                                                <SelectItem label={type} key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </View>
                            </View>
                        )}
                    />
                </View>
                {showProgress && (
                    <Controller
                        control={control}
                        name="currentPart"
                        render={({ field: { onChange, value } }) => (
                            <ProgressSlider
                                currentProgress={currentPart}
                                totalUnits={totalParts}
                                progressUnit={partType}
                                label="Current Part"
                                onChange={onChange}
                            />
                        )}
                    />
                )}
            </View>

            {/* Progress Information */}
            <View>
                <View className="flex-row gap-3 mb-3">
                    <Controller
                        control={control}
                        name="totalUnits"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <UIText className="text-xs text-muted-foreground mb-1">
                                    Total {progressUnit}
                                </UIText>
                                <Input
                                    value={String(value ?? 0)}
                                    onChangeText={(text) => onChange(Number(text) || 0)}
                                    keyboardType="numeric"
                                    placeholder="12"
                                />
                            </View>
                        )}
                    />


                    <Controller
                        control={control}
                        name="progressUnit"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <UIText className="text-xs text-muted-foreground mb-1">
                                    Progress Unit
                                </UIText>
                                <View className="border border-border rounded-md overflow-hidden bg-background">
                                    <Select
                                        onValueChange={(option) => {
                                            if (option) onChange(option.value as ProgressUnit);
                                        }}
                                        value={value ? { value: String(value), label: String(value) } : undefined}
                                        className="w-full"
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent className="w-[calc(41%)]">
                                            {PROGRESS_UNIT_OPTIONS.map((unit) => (
                                                <SelectItem label={unit} key={unit} value={unit} />
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Progress Slider - Only shown for current/hold/dropped status */}
                {showProgress && (
                    <Controller
                        control={control}
                        name="currentProgress"
                        render={({ field: { onChange, value } }) => (
                            <ProgressSlider
                                currentProgress={currentProgress}
                                totalUnits={totalUnits}
                                progressUnit={progressUnit}
                                onChange={onChange}
                            />
                        )}
                    />
                )}
            </View>
        </View>
    )
}