import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const receiveServiceHandler = (socket: Socket, data: any) => {
    console.log('Serviço recebido:', data)
    const serviceData = {
        patient: data.patient,
        description: data.description,
        requestTimestamp: new Date(),
        createAt: new Date()
    }
    dbQueries.insertService(db, serviceData, (err) => {
        if (err) {
            throw err
        }
        socket.broadcast.emit('new_service', data)
    })
}
