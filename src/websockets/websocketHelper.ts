import { WebSocket } from 'ws'
import { ChatType, WebSocketsMessage } from './websockets'

export const generateSocketId = () => {
  return Math.random().toString(36).substring(2, 15)
}
export const welcomeMessage = (socketId: string, chat: ChatType): string => {
  const message: WebSocketsMessage = {type: 'join', socketId, content: 'Welcome to the chat', chat}
  const stringMessage = JSON.stringify(message)
  return stringMessage
}

export const sendMessageToChat = (websocketMap: Map<string, WebSocket>, socketIdChatMap: Map<ChatType, string[]>, receivedMessage: string) => {
  const message = JSON.parse(receivedMessage) as WebSocketsMessage
  const ids: string[] = socketIdChatMap.get(message.chat) as string[]
  if (!ids) return
  ids.forEach((id) => {
    const ws = websocketMap.get(id)
    if (!ws) return
    if (ws.readyState !== ws.OPEN) return
    if (id === message.socketId) return
    ws.send(JSON.stringify(message))
  })
}

export const sendToClient = (websocketMap: Map<string, WebSocket>, socketId: string, message: WebSocketsMessage) => {
  const ws = websocketMap.get(socketId)
  if (!ws) return
  if (ws.readyState !== ws.OPEN) return
  ws.send(JSON.stringify(message))
}

export const sendToAllClients = (websocketMap: Map<string, WebSocket>, message: WebSocketsMessage) => {
  websocketMap.forEach((ws) => {
    if (ws.readyState !== ws.OPEN) return
    ws.send(JSON.stringify(message))
  })
}
