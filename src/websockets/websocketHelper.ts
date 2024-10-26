import { WebSocket } from "ws"
import { WebSocketsMessage } from "./websockets"

export const generateSocketId = () => {
  return Math.random().toString(36).substring(2, 15)
}
export const welcomeMessage = (socketId: string): string => {
  const message = { type: 'welcome', sender: 'server', content: 'Welcome to the server', receiver: socketId }
  const stringMessage = JSON.stringify(message)
  return stringMessage
}

export const sendToClient = (websocketMap: Map<string, WebSocket>, socketId: string, message: WebSocketsMessage ) => {
  const ws = websocketMap.get(socketId)
  if (!ws) return
  ws.send(JSON.stringify(message))
}

export const sendToAllClients = (websocketMap: Map<string, WebSocket>, message: WebSocketsMessage) => {
  websocketMap.forEach((ws) => ws.send(JSON.stringify(message)))
}

