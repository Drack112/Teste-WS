export type SCService = {
    id?: string
    description?: string | null
    requestTimestamp?: Date
    acceptTimestamp?: Date | null
    allocatedAgent?: string | null
    patient?: string
    rating?: number | null
    createAt?: Date
    agentFeedback?: string | null
}
