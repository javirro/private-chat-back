import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'

export const websocketMap = new Map<string, WebSocket>()
export const reverseWebsocketMap = new Map<WebSocket, string>()

const generateSocketId = () => {
  return Math.random().toString(36).substring(2, 15)
}

export const createWebsocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected', ws)
    const socketId = generateSocketId()
    websocketMap.set(socketId, ws)
    reverseWebsocketMap.set(ws, socketId)

    // Listen for messages in this client
    ws.on('message', (message) => {
      console.log('Message:', message)
    })

    // Send welcome message to client
    ws.send(JSON.stringify({ message: 'Hello from the server', id: socketId }))
  })

  // Listen for client disconnection
  wss.on('close', (ws: WebSocket) => {
    console.log('Client disconnected', ws)
    const socketId = reverseWebsocketMap.get(ws)
    if (!socketId) return
    websocketMap.delete(socketId)
    reverseWebsocketMap.delete(ws)
  })
}
