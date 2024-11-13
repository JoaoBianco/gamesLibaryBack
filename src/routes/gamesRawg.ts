import express, { Request, Response } from 'express'
import { RawgGamesList } from '../../models/rawg.model'
import { RAWGKEY, RAWGURL } from '../../util/globalVariables'

const router = express.Router()

router.get('', async (req: Request, res: Response) => {
  const url = RAWGURL + 'games' + RAWGKEY
  await fetch(url)
    .then(response => response.json())
    .then((data: RawgGamesList) => {
      if (!data.results.length) {
        return res.status(404).send(data)
      }
      return res.send(data)
    })
    .catch(err => {res.status(500).send(err); console.log(err)})
})

router.get('/:idSlug', async (req: Request, res: Response) => {
  const url = RAWGURL + 'games/' + req.params.idSlug + RAWGKEY
  await fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data) {
        return res.status(404).send(data)
      }
      return res.send(data)
    })
    .catch(err => {res.status(500).send(err); console.log(err)})
})

export { router as gamesRawgRouter }

