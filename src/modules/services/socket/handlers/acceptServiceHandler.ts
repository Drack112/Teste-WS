import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const acceptServiceHandler = (socket: Socket, id: string) => {
    dbQueries.acceptService(db, id, socket.id, (err, row) => {
        if (err) {
            throw err
        }
        if (row) {
            socket.broadcast.emit('service_accepted', row)
        }
    })
}
