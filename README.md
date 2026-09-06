# Bot de Resposta Automática no WhatsApp

Bot simples desenvolvido para envio de respostas automáticas no WhatsApp rodando direto pelo celular.

## 🛠️ Como foi feito

O projeto foi construído focado em leveza e baixo consumo de memória:

* **Node.js:** Ambiente de execução em JavaScript.
* **@whiskeysockets/baileys:** Biblioteca usada para conectar diretamente via WebSockets com a API do WhatsApp Web, sem precisar abrir um navegador (como o Puppeteer).
* **Termux:** Terminal Linux para Android que permite executar o ecossistema do Node.js diretamente no celular.

## 📋 Pré-requisitos (Termux)

No seu aplicativo Termux, prepare o ambiente executando:
```bash
pkg update && pkg install nodejs git
