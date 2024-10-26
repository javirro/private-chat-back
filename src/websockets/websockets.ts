import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import { generateSocketId, sendToAllClients, sendToClient, welcomeMessage } from './websocketHelper'

export type WebSocketMessageType = 'welcome' | 'group' | 'individual' | 'close'
export interface WebSocketsMessage {
  type: WebSocketMessageType
  sender: string
  receiver: string | 'group'
  content: string
}
export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean
}

export const websocketMap = new Map<string, ExtendedWebSocket>()
export const reverseWebsocketMap = new Map<ExtendedWebSocket, string>()

export const createWebsocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws: WebSocket) => {
    const extendedWs = ws as ExtendedWebSocket
    const socketId = generateSocketId()
    websocketMap.set(socketId, extendedWs)
    reverseWebsocketMap.set(extendedWs, socketId)
    console.log(`Client connected with id: ${socketId}. Number of clients: `, websocketMap.size)

    // Send welcome message to client
    ws.send(welcomeMessage(socketId))

    // Set interval to check is socket is alive
    const aliveInterval = setInterval(() => {
      if (extendedWs.isAlive === false) {
        const specificId = reverseWebsocketMap.get(extendedWs)
        extendedWs.terminate()
        websocketMap.delete(specificId as string)
        reverseWebsocketMap.delete(extendedWs)
        console.log('Client is not alive. End connection', specificId, '- All  remaining socket ids:', Array.from(websocketMap.keys()))
        clearInterval(aliveInterval) // Clear interval when client disconnects
        return
      }
      extendedWs.isAlive = false
      extendedWs.ping() // Send a ping to prompt a message
    }, 60000) // 60 seconds

    // Listen for messages in this client
    ws.on('message', (message) => {
      const parsedMessage: WebSocketsMessage = JSON.parse(message.toString())
      const { sender, receiver, type } = parsedMessage
      const ws = websocketMap.get(sender)
      if (!ws) return
      ws.isAlive = true

      if (type === 'individual' && receiver !== 'group') {
        sendToClient(websocketMap, receiver, parsedMessage)
      } else if (type === 'group') {
        sendToAllClients(websocketMap, parsedMessage)
      }
      console.log('Message:', parsedMessage)
    })

    // Listen for client disconnection (ws is a number 1001)
    ws.on('close', (ws: WebSocket) => {
      clearInterval(aliveInterval)
    })
  })
}
