import { Game, PrismaClient, Status } from "@prisma/client"
import express, { Request, Response } from "express"
import { RawgAndLibraryGame } from "src/models/rawg.model"
import { verifyIfGameIsInDatabaseOrRawgGame } from "../util/game"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as Game
    if (!game) {
      res.status(404).send({ message: "Game not found!" })
      return
    }
    res.status(200).send(game)
    return
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

router.post("/toggletolibrary/:id", async (req: Request, res: Response) => {
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as RawgAndLibraryGame
    if (game) {
      const updatedGame = await prisma.game.update({
        where: { id: game.libaryGame.id },
        data: { inLibrary: !game.libaryGame.inLibrary },
      })
      res.status(200).send(updatedGame)
      return
    }
    res.status(404).send({ message: "Game not found" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

router.post("/toggletowishlist/:id", async (req: Request, res: Response) => {
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as RawgAndLibraryGame
    if (game) {
      const updatedGame = await prisma.game.update({
        where: { id: game.libaryGame.id },
        data: { wishlist: !game.libaryGame.wishlist },
      })
      res.status(200).send(updatedGame)
      return
    }
    res.status(404).send({ message: "Game not found" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

router.post("/toggletofavorite/:id", async (req: Request, res: Response) => {
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as RawgAndLibraryGame
    if (game) {
      const updatedGame = await prisma.game.update({
        where: { id: game.libaryGame.id },
        data: { favorite: !game.libaryGame.favorite },
      })
      res.status(200).send(updatedGame)
      return
    }
    res.status(404).send({ message: "Game not found" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

router.post("/toggletoacquired/:id", async (req: Request, res: Response) => {
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as RawgAndLibraryGame
    if (game) {
      const updatedGame = await prisma.game.update({
        where: { id: game.libaryGame.id },
        data: { acquired: !game.libaryGame.acquired },
      })
      res.status(200).send(updatedGame)
      return
    }
    res.status(404).send({ message: "Game not found" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

router.patch("/changestatus/:id", async (req: Request, res: Response) => {
  const status = req.body.status
  if (!status) {
    res.status(400).send({ message: "Status is required" })
    return
  }
  if (!Object.values(Status).includes(status)) {
    res.status(400).send({ message: "Invalid status" })
    return
  }
  try {
    const game = (await verifyIfGameIsInDatabaseOrRawgGame(
      req.params.id
    )) as RawgAndLibraryGame
    if (game) {
      const updatedGame = await prisma.game.update({
        where: { id: game.libaryGame.id },
        data: { status: req.body.status },
      })
      res.status(200).send(updatedGame)
      return
    }
    res.status(404).send({ message: "Game not found" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" })
    return
  }
})

export { router as gameRouter }
