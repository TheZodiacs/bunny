// ProgressSlider.tsx
import React from "react"
import { View, TouchableOpacity } from "react-native"
import Slider from "@react-native-community/slider"
import { Text as UIText } from '@/components/ui/text'

interface ProgressSliderProps {
    currentProgress: number
    totalUnits: number
    progressUnit: string
    onChange: (value: number) => void
    label?: string
}

export function ProgressSlider({ 
    currentProgress, 
    totalUnits, 
    progressUnit, 
    onChange,
    label = "Current Progress"
}: ProgressSliderProps) {
    const percent = totalUnits > 0 ? Math.round((currentProgress / totalUnits) * 100) : 0

    const handleDecrement = () => {
        const newValue = Math.max(0, currentProgress - 1)
        onChange(newValue)
    }

    const handleIncrement = () => {
        const newValue = Math.min(totalUnits, currentProgress + 1)
        onChange(newValue)
    }

    return (
        <View className="mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <UIText className="text-sm">{label}</UIText>
                <UIText className="text-sm font-medium">
                    {currentProgress}/{totalUnits} {progressUnit}
                </UIText>
            </View>

            <View className="flex-row items-center gap-3">
                <TouchableOpacity
                    onPress={handleDecrement}
                    className="w-10 h-10 bg-muted rounded-full items-center justify-center"
                >
                    <UIText className="text-lg font-bold">-</UIText>
                </TouchableOpacity>

                <View className="flex-1">
                    <Slider
                        value={currentProgress}
                        onValueChange={(v) => onChange(Math.round(v))}
                        minimumValue={0}
                        maximumValue={Math.max(1, totalUnits)}
                        step={1}
                        thumbTintColor="#3b82f6"
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#e5e7eb"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleIncrement}
                    className="w-10 h-10 bg-muted rounded-full items-center justify-center"
                >
                    <UIText className="text-lg font-bold">+</UIText>
                </TouchableOpacity>
            </View>

            <UIText className="text-xs text-muted-foreground text-center mt-1">
                {percent}% complete
            </UIText>
        </View>
    )
}
