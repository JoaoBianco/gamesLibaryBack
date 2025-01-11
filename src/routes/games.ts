import { PrismaClient } from "@prisma/client"
import express, { Request, Response } from "express"

const router = express.Router()
const prisma = new PrismaClient()

router.get("", async (req: Request, res: Response) => {
  const onlyLibrary = req.query.onlyLibrary
  try {
    const games = await prisma.game.findMany(
      onlyLibrary ? { where: { inLibrary: true } } : undefined
    )
    if (!games.length) {
      res.status(404).send({ message: "No games found!" })
      return
    }
    res.status(200).send(games)
    return
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

export { router as gamesRouter }
