import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { RawgGame } from 'src/models/rawg.model'
import { LOCALURL } from '../util/globalVariables'

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
      res.status(404).send({ message: 'Jogo não encontrado' })
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

router.post('/toggleToLibrary', async(req: Request, res: Response) => {
  try {
    // Verify if game is already in library
    const game = await prisma.game.findUnique({where: {id: req.body.id}})
    if (game) {
      const updatedGame = await prisma.game.update({where: {id: req.body.id}, data: { inLibrary: !game.inLibrary }})
      res.status(200).send({ updatedGame })
      return
    }
    // If game is not in library, add it
    const rawgGame: RawgGame = await fetch(LOCALURL + 'api/rawgGames/' + req.body.id).then(response => response.json())
    if (!rawgGame) {
      res.status(404).send({ message: 'Game not found!' })
      return
    }
    const isGameInLibaryWithRawgId = await prisma.game.findFirst({where: { rawgId: rawgGame.id }})
    if (isGameInLibaryWithRawgId) {
      const updatedGame = await prisma.game.update({where: {id: isGameInLibaryWithRawgId.id}, data: { inLibrary: !isGameInLibaryWithRawgId.inLibrary }})
      res.status(200).send({ updatedGame })
      return
    }
    const addedGame = await prisma.game.create({
      data: {
        name: rawgGame.name,
        rawgId: rawgGame.id,
        inLibrary: true
      }
    })
    res.status(201).send({ addedGame })
    return
  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
    return
  }
 
})

export { router as gameRouter }
