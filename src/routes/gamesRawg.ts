import { Game, PrismaClient } from "@prisma/client"
import express, { Request, Response } from "express"
import { RawgGame, RawgGamesList } from "../models/rawg.model"
import { RAWGKEY, RAWGURL } from "../util/globalVariables"

const router = express.Router()
const prisma = new PrismaClient()
const DEFAULTLIBARYVALUES = {
  inLibrary: false,
  wishlist: false,
  playing: false,
  acquired: false,
  favorite: false,
} as Partial<Game>

router.get("", async (req: Request, res: Response) => {
  const page = req.query.page || 1
  const url = RAWGURL + "games" + RAWGKEY + `&page=${page}`
  await fetch(url)
    .then((response) => response.json())
    .then(async (data: RawgGamesList) => {
      if (!data.results.length) {
        return res.status(404).send(data)
      }
      const results = data.results.map(async (game) => {
        const libraryGame = await prisma.game.findFirst({
          where: { rawgId: game.id },
        })
        return { libraryGame: libraryGame || DEFAULTLIBARYVALUES, ...game }
      })
      data.results = await Promise.all(results)
      const dataToReturn = { ...data, next: data.next?.split("&")[1] }
      return res.send(dataToReturn)
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log(err)
    })
})

router.get("/:idSlug", async (req: Request, res: Response) => {
  try {
    const dirtyGame = await fetchRawgGame(req.params.idSlug)
    if (!dirtyGame) {
      res.status(404).send({ message: "Game not found!" })
    }

    if (dirtyGame?.detail) {
      res.status(404).send({ message: "Game not found!" })
      return
    }

    const cleanGame = await verifyIfRedirect(dirtyGame)

    res.status(200).send(cleanGame)
    return
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

async function fetchRawgGame(idOrSlug: string): Promise<RawgGame> {
  const url = RAWGURL + "games/" + idOrSlug + RAWGKEY
  return await fetch(url).then((response) => response.json())
}

async function verifyIfRedirect(
  game: RawgGame | { redirect: boolean; slug: string }
) {
  if (game?.redirect) {
    return await fetchRawgGame(game.slug)
  }
  return game
}

export { router as gamesRawgRouter }
