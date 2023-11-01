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

app.use(express.static("public"));

let servicos: {
  id: number;
  patient: string;
  category: string;
  createdAt: Date;
  accepted: boolean;
}[] = [];

function createNamespace(namespaceName: string) {
  const nsp = io.of(`/${namespaceName}`);

  nsp.on("connection", (socket) => {
    console.log(`Cliente conectado ao namespace ${namespaceName}:`, socket.id);

    socket.emit("lista de serviços", servicos);

    socket.on("receber serviço", (data) => {
      if (data.id && data.patient && data.category && data.createdAt) {
        console.log("Serviço recebido:", data);
        servicos.push(data);
        nsp.emit("novo serviço", data);
      } else {
        console.log("Estrutura de dados do serviço inválida:", data);
      }
    });
    socket.on("aceitar serviço", (serviceId) => {
      const index = servicos.findIndex((s) => s.id === serviceId);
      if (index !== -1) {
        const [servicoAceito] = servicos.splice(index, 1);
        console.log("Serviço aceito", servicoAceito);
        nsp.emit("serviço aceito", servicoAceito);
      }
    });
  });
}

createNamespace("HAC");
createNamespace("GOHEALTH");

httpServer.listen(5000, () => {
  console.log("Servidor rodando na porta 5000.");
});
