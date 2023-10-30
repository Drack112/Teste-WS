import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const servicos: any[] = [];
const nsp = io.of("/HAC/nutricao");
const nsp_t = io.of("/HAC/teste");

app.use(express.static("public"));

nsp_t.on("connection", (socket) => {
  console.log("Cliente conectado ao namespace HAC:", socket.id);
});

nsp.on("connection", (socket) => {
  console.log("Cliente conectado ao namespace HAC:", socket.id);

  socket.emit("lista de serviços", servicos);

  socket.on("receber serviço", (data) => {
    console.log("Serviço recebido:", data);
    servicos.push(data);
    nsp.emit("novo serviço", data);
  });

  socket.on("aceitar serviço", (nome) => {
    const index = servicos.findIndex((s) => s.nome === nome);
    if (index !== -1) {
      const [servicoAceito] = servicos.splice(index, 1);
      nsp.emit("serviço aceito", servicoAceito);
    }
  });
});

httpServer.listen(5000, () => {
  console.log("Servidor rodando na porta 5000.");
});
