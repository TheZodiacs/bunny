// StatusSelector.tsx
import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text as UIText } from '@/components/ui/text'
import { StatusType } from './FormTypes'

interface StatusSelectorProps {
    value: StatusType
    onChange: (value: StatusType) => void
}

const STATUS_OPTIONS: StatusType[] = ["current", "planned", "completed", "dropped", "hold"]

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
    return (
        <View className="mb-4">
            <UIText className="text-sm font-medium mb-2">Status</UIText>
            <View className="flex-row flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                    <TouchableOpacity
                        key={status}
                        onPress={() => onChange(status)}
                        className={`px-3 py-2 rounded-md ${
                            value === status ? "bg-primary" : "bg-muted"
                        }`}
                    >
                        <UIText className={`text-sm ${
                            value === status ? "text-primary-foreground" : "text-foreground"
                        }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </UIText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}
