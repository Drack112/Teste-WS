import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const receiveServiceHandler = (socket: Socket, data: any) => {
    console.log('Serviço recebido:', data)
    const serviceData = {
        patient: data.patient,
        description: data.description,
        category: data.category,
        requestTimestamp: new Date().toISOString(),
        createAt: new Date().toISOString()
    }

    dbQueries.insertService(db, serviceData, (err) => {
        if (err) {
            console.error('Error inserting new service:', err)
            socket.emit('error_inserting_service', { error: err.message })
            return
        }
        socket.broadcast.emit('new_service', data)
    })
}
