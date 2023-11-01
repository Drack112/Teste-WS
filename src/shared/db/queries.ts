import sqlite3 from 'sqlite3'
import { SCService } from '../../types/service'
import { v4 as uuid } from 'uuid'

export const getAllServices = (
    db: sqlite3.Database,
    callback: (err: Error | null, rows?: any) => void
) => {
    db.all('SELECT * FROM ISCServiceView', [], callback)
}

export const insertService = (
    db: sqlite3.Database,
    data: Partial<SCService>,
    callback: (err: Error | null) => void
) => {
    const {
        allocatedAgent,
        description,
        requestTimestamp,
        acceptTimestamp,
        rating,
        createAt,
        patient,
        agentFeedback
    } = data

    const id = uuid()

    db.run(
        `INSERT INTO ISCServiceView (id, allocatedAgent, description, requestTimestamp, acceptTimestamp, allocatedAgent, patient, rating, createAt, agentFeedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            allocatedAgent,
            description,
            requestTimestamp,
            acceptTimestamp,
            patient,
            rating,
            createAt,
            agentFeedback
        ],
        callback
    )
}

export const acceptService = (
    db: sqlite3.Database,
    id: string,
    socketId: string,
    callback: (err: Error | null, row?: any) => void
) => {
    const acceptTimestamp = new Date().toISOString()
    db.run(
        'UPDATE ISCServiceView SET acceptTimestamp = ?, allocatedAgent = ? WHERE id = ?',
        [acceptTimestamp, socketId, id],
        callback
    )
}

export const allocateServiceToAgent = (
    db: sqlite3.Database,
    serviceId: string,
    agentId: string,
    callback: (err: Error | null) => void
) => {
    db.run(
        'UPDATE ISCServiceView SET alocatedAgent = ? WHERE id = ?',
        [agentId, serviceId],
        callback
    )
}

export const getServiceById = (
    db: sqlite3.Database,
    serviceId: string,
    callback: (err: Error | null, row?: any) => void
) => {
    db.get('SELECT * FROM ISCServiceView WHERE id = ?', [serviceId], callback)
}
