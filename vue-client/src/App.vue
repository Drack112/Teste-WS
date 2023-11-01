<template>
    <div id="app">
        <h2>WebSocket Client</h2>
        <table>
            <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Descrição</th>
                    <th>Criado em</th>
                    <th>Aceito em</th>
                    <th>Agente Alocado</th>
                    <th colspan="2">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="service in services"
                    :key="service.id"
                    :class="{ 'accepted-service': service.accepted }"
                >
                    <td>{{ service.patient }}</td>
                    <td>{{ service.description }}</td>
                    <td>{{ service.requestTimestamp }}</td>
                    <td>{{ service.acceptTimestamp }}</td>
                    <td>{{ service.allocatedAgent }}</td>
                    <td>
                        <button @click="acceptService(service.id)">
                            Aceitar Serviço
                        </button>
                    </td>
                    <td>
                        <button @click="allocateService(service.id)">
                            Alocar-se ao Serviço
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <input type="text" v-model="patient" placeholder="Nome do paciente" />
        <input
            type="text"
            v-model="category"
            placeholder="Categoria do serviço"
        />
        <button @click="sendMessage">Enviar Serviço</button>
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    data() {
        return {
            socket: null,
            services: [],
            patient: '',
            category: '',
            accepted: null
        }
    },
    mounted() {
        this.socket = io('http://localhost:3010/HAC')

        this.socket.on('connect', () => {
            console.log('Conectado ao servidor!')
        })

        this.socket.on('services_list', (dataList) => {
            this.services = dataList
        })

        this.socket.on('service_updated', (updatedService) => {
            const index = this.services.findIndex(
                (service) => service.id === updatedService.id
            )
            if (index !== -1) {
                this.services[index] = updatedService
            } else {
                this.services.push(updatedService)
            }
        })

        this.socket.on('new_service', (data) => {
            this.services.push({ ...data, accepted: false })
        })

        this.socket.on('accepted_service', (acceptedService) => {
            const service = this.services.find(
                (s) => s.id === acceptedService.id
            )
            if (service) {
                service.accepted = true
            }
        })
    },
    methods: {
        sendMessage() {
            const data = {
                allocatedAgent: null,
                description: this.patient + ' - ' + this.category,
                requestTimestamp: new Date().toISOString(),
                acceptTimestamp: null,
                patient: this.patient,
                rating: null,
                createAt: new Date().toISOString(),
                agentFeedback: null
            }
            this.socket.emit('receive_service', data)
            this.patient = ''
            this.category = ''
        },
        acceptService(serviceId) {
            this.socket.emit('accept_service', serviceId)
        },
        allocateService(serviceId) {
            const data = {
                serviceId: serviceId,
                allocatedAgent: this.socket.id
            }
            this.socket.emit('allocate_service', data)
        }
    }
}
</script>

<style scoped>
/* === CORE STYLES === */

html {
    font-family: 'Roboto', sans-serif;
}

body {
    background-color: #ffebd9;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* === LAYOUT STYLES === */
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    max-width: 500px;
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* === ELEMENT STYLES === */
input[type='text'] {
    padding: 10px;
    border: 1px solid #ff6b00;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
}

button {
    background-color: #ff6b00;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #e55a00;
}

/* === UTILITY STYLES === */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.accepted-service {
    background-color: #ffebd9; /* Laranja claro */
}
</style>
