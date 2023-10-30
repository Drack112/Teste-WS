
# Teste WebSocket (teste-ws)

Este projeto é uma implementação simples de um servidor WebSocket usando `socket.io` e `express`. Ele também inclui um cliente HTML para interagir com o servidor.

## Pré-requisitos

- Node.js
- npm

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Drack112/Teste-WS.git teste-ws
```

2. Navegue até a pasta do projeto:

```bash
cd teste-ws
```

3. Instale as dependências:

```bash
npm install
```

## Execução

Para iniciar o servidor e o cliente, execute:

```bash
npm start
```

Após iniciar o servidor, o cliente HTML será automaticamente aberto em seu navegador padrão. Você pode interagir com o servidor através deste cliente.

## Funcionalidades

- **Enviar Serviço**: No cliente, você pode enviar um novo serviço digitando o nome do serviço e clicando no botão "Enviar Serviço".
- **Aceitar Serviço**: Os serviços enviados serão listados com um botão "Aceitar" ao lado deles. Clicar neste botão notificará o servidor de que o serviço foi aceito.
