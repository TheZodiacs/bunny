// FormTypes.ts
export type StatusType = "current" | "planned" | "completed" | "dropped" | "hold"
export type ReleaseStatus = "ongoing" | "completed" | "hiatus" | "cancelled"
export type Tier = "S" | "A" | "B" | "C" | "D" | "E"
export type ProgressUnit = "Episodes" | "Chapters" | "Pages"
export type PartType = "Season" | "Volume" | "Arc" | "Part"
export type MediaType = "anime" | "manga" | "light novel" | "visual novel"

export interface FormData {
    title: string
    category: string
    status: StatusType
    rating: number
    tier: Tier
    notes: string
    completedDate?: string
    coverImageUrl: string
    description: string
    genres: string
    releaseYear: string
    releaseStatus: ReleaseStatus
    partType: PartType
    totalParts: number
    currentPart: number
    partTitle?: string
    totalUnits: number
    progressUnit: ProgressUnit
    currentProgress: number
}