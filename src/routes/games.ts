import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'

const router = express.Router()
const prisma = new PrismaClient()

router.get('', async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany()
    if (!games.length) { 
      res.status(404).send('No games found!')
      return
    }
    res.status(200).send(games)
    return
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

export { router as gamesRouter }

