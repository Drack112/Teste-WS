import { Socket } from 'socket.io'
import db from '../../../..'
import * as dbQueries from '../../../../shared/db/queries'

export const allocateServiceHandler = (socket: Socket) => {
    socket.on('allocate_service', (serviceId, socketId: string) => {
        dbQueries.allocateServiceToAgent(db, serviceId, socketId, (err) => {
            if (err) {
                console.error('Erro ao alocar serviço:', err)
                return
            }

            dbQueries.getServiceById(db, serviceId, (err, service) => {
                if (err) {
                    console.error('Erro ao obter serviço:', err)
                    return
                }

                socket.broadcast.emit('service_allocated', service)
            })
        })
    })
}
