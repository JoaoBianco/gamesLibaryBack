import { Game, PrismaClient } from "@prisma/client"
import express, { Request, Response } from "express"
import { RawgGame } from "src/models/rawg.model"

const router = express.Router()
const prisma = new PrismaClient()

router.get("", async (req: Request, res: Response) => {
  const onlyLibrary = req.query.onlyLibrary
  try {
    let games: Game[] | RawgGame[] = await prisma.game.findMany(
      onlyLibrary ? { where: { inLibrary: true } } : undefined
    )
    games = games.map((game: Game) => {
      return { libraryGame: { ...game } }
    }) as unknown as RawgGame[]
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
