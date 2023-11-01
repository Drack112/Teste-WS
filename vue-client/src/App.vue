<template>
  <div id="app">
    <h2>WebSocket Client</h2>
    <ul id="services">
      <li
        v-for="service in services"
        :key="service.id"
        :id="service.patient"
        :class="{ 'accepted-service': service.accepted }"
      >
        Paciente: {{ service.patient }}, Categoria: {{ service.category }},
        Criado em: {{ service.createdAt }}
      </li>
    </ul>
    <input type="text" v-model="patient" placeholder="Nome do paciente" />
    <input type="text" v-model="category" placeholder="Categoria do serviço" />
    <button @click="sendMessage">Enviar Serviço</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null,
      services: [],
      patient: "",
      category: "",
    };
  },
  mounted() {
    this.socket = io("http://localhost:5000/HAC");

    this.socket.on("connect", () => {
      console.log("Conectado ao servidor!");
    });

    this.socket.on("lista de serviços", (dataList) => {
      this.services = dataList;
    });

    this.socket.on("novo serviço", (data) => {
      this.services.push({ ...data, accepted: false });
    });

    this.socket.on("serviço aceito", (data) => {
      const service = this.services.find((s) => s.patient === data.patient);
      if (service) {
        service.accepted = true;
      }
    });
  },
  methods: {
    sendMessage() {
      const data = {
        id: Math.floor(Math.random() * 100) + 1,
        patient: this.patient,
        category: this.category,
        createdAt: new Date().toISOString(),
      };
      this.socket.emit("receber serviço", data);
      this.patient = "";
      this.category = "";
    },
  },
};
</script>

<style scoped>
/* === CORE STYLES === */
body {
  font-family: Arial, sans-serif;
  background-color: #ffebd9;
  margin: 0;
  padding: 0;
}

/* === LAYOUT STYLES === */
.App {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.App-header,
.dashboard {
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
}

.service-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* === COMPONENT STYLES === */
/* Form */
.form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 15px;
}

/* Service Card */
.service-card {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 250px;
}

/* === ELEMENT STYLES === */
input[type="text"] {
  padding: 10px;
  border: 1px solid #ff6b00;
  border-radius: 5px;
  width: 100%;
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
.department {
  background-color: #ffe4e1;
  padding: 20px;
  border-radius: 10px;
}

.accepted-service {
  color: #ff6b00; /* Laranja */
  text-decoration: underline; /* Sublinhado */
  text-decoration-color: #ff6b00; /* Cor do sublinhado laranja */
}
</style>
