import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const getAllServicesHandler = (socket: Socket) => {
    dbQueries.getAllServices(db, (err, rows) => {
        if (err) {
            throw err
        }
        socket.emit('services_list', rows)
    })
}
