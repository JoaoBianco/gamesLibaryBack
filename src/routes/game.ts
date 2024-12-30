import { Game, PrismaClient, Status } from '@prisma/client'
import express, { Request, Response } from 'express'
import { verifyIfGameIsInDatabaseOrRawgGame } from '../util/game'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/:id', async(req: Request, res: Response) => {
  try {
    const game = await prisma.game.findUnique({
      where: {
        id: req.params.id
      }
    })
    if (!game) {
      res.status(404).send({ message: 'Game not found!' })
      return
    }
    res.status(200).send(game)
    return
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

router.post('/toggleToLibrary/:id', async(req: Request, res: Response) => {
  try {
    const game = await verifyIfGameIsInDatabaseOrRawgGame(req.params.id) as Game
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: game.id}, data: { inLibrary: !game.inLibrary }})
      res.status(200).send({ updatedGame })
      return
    }
    res.status(404).send({ message: 'Game not found' })
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

router.post('/toggleToWishlist/:id', async(req: Request, res: Response) => {
  try {
    const game = await verifyIfGameIsInDatabaseOrRawgGame(req.params.id) as Game
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: game.id}, data: { wishlist: !game.wishlist }})
      res.status(200).send({ updatedGame })
      return
    }
    res.status(404).send({ message: 'Game not found' })
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

router.post('/toggleToFavorite/:id', async(req: Request, res: Response) => {
  try {
    const game = await verifyIfGameIsInDatabaseOrRawgGame(req.params.id) as Game
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: game.id}, data: { favorite: !game.favorite }})
      res.status(200).send({ updatedGame })
      return
    }
    res.status(404).send({ message: 'Game not found' })
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

router.post('/toggleToAcquired/:id', async(req: Request, res: Response) => {
  try {
    const game = await verifyIfGameIsInDatabaseOrRawgGame(req.params.id) as Game
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: game.id}, data: { acquired: !game.acquired }})
      res.status(200).send({ updatedGame })
      return
    }
    res.status(404).send({ message: 'Game not found' })
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

router.patch('/changeStatus/:id', async(req: Request, res: Response) => {
  const status = req.body.status
  if (!status) {
    res.status(400).send({ message: 'Status is required' })
    return
  }
  if (!Object.values(Status).includes(status)) {
    res.status(400).send({ message: 'Invalid status' })
    return
  }
  try {
    const game = await verifyIfGameIsInDatabaseOrRawgGame(req.params.id) as Game
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: game.id}, data: { status: req.body.status }})
      res.status(200).send({ updatedGame })
      return
    }
    res.status(404).send({ message: 'Game not found' })
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
})

export { router as gameRouter }

