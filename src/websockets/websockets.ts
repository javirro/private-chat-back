import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'
import { generateSocketId, sendMessageToChat, sendToAllClients, sendToClient, welcomeMessage } from './websocketHelper'
import url from 'url'

export type WebSocketMessageType = 'join' | 'message' | 'leave'

export type ChatType = 'pets' | 'football' | 'movies'
export interface WebSocketsMessage {
  type: WebSocketMessageType
  content: string
  chat: ChatType
  socketId: string
}
export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean
}

export const websocketMap = new Map<string, ExtendedWebSocket>()
export const reverseWebsocketMap = new Map<ExtendedWebSocket, string>()
export const socketIdChatMap = new Map<ChatType, string[]>()

export const createWebsocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws: WebSocket, req: Request) => {
    const query = url.parse(req.url as string, true).query
    const chat = query.chat as ChatType
    const extendedWs = ws as ExtendedWebSocket
    const socketId = generateSocketId()
    websocketMap.set(socketId, extendedWs)
    reverseWebsocketMap.set(extendedWs, socketId)
    if (!socketIdChatMap.has(chat)) {
      socketIdChatMap.set(chat, [socketId])
    } else {
      const chatArray = socketIdChatMap.get(chat) as string[]
      chatArray?.push(socketId)
      socketIdChatMap.set(chat, chatArray)
    }
    console.log(`Client connected with id: ${socketId}. Number of clients: `, websocketMap.size)

    // Send welcome message to client
    ws.send(welcomeMessage(socketId, chat))

    // Set interval to check is socket is alive
    const aliveInterval = setInterval(() => {
      if (extendedWs.isAlive === false) {
        const specificId = reverseWebsocketMap.get(extendedWs)
        ws.terminate()
        websocketMap.delete(specificId as string)
        reverseWebsocketMap.delete(extendedWs)
        console.log('Client is not alive. End connection', specificId, '- All  remaining socket ids:', Array.from(websocketMap.keys()))
        clearInterval(aliveInterval) // Clear interval when client disconnects
        return
      }
      extendedWs.isAlive = false
    }, 60000) // 60 seconds

    // Listen for messages in this client
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString()) as WebSocketsMessage
      if (parsedMessage.type === 'message') {
        sendMessageToChat(websocketMap, socketIdChatMap, message.toString())
      }
      const socketIdFromMessage = parsedMessage.socketId
      const websocket = websocketMap.get(socketIdFromMessage)
      if (!websocket) return
      websocket.isAlive = true

      console.log('Message:', parsedMessage)
    })

    // Listen for client disconnection (ws is a number 1001)
    ws.on('close', () => {
      clearInterval(aliveInterval)
    })
  })
}
