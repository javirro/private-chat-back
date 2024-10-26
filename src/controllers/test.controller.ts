import { Request, Response } from 'express'
export const testController = (req: Request, res: Response) => {
  try {
    console.log('Test controller called')
    res.status(200).json({ message: 'Test controller called' })
  } catch (error) {
    console.error('Test controller error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
