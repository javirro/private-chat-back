import app from './app'
import * as dotenv from 'dotenv'
import { createServer, Server } from 'http'
import { createWebsocketServer } from './websockets/websockets'
dotenv.config()

const server: Server = createServer(app)
createWebsocketServer(server)

const PORT = process.env.PORT || 5000
server.listen(PORT)
console.log(`Server running on port ${PORT}`)
