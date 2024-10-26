import express, { Request, Response } from 'express'
import cors from 'cors'
import { UI_URL } from './constants'

const app = express()

app.use(
  cors({
    origin: UI_URL
  })
)

app.use(express.json({ limit: '50mb' }))

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found'
  })
})

export default app
