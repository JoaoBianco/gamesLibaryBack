import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

var express = require('express')
var app = express()
const prisma = new PrismaClient()

app.listen(3000, async () => {
  console.log('iniciei na porta 3000')
})

app.get('/games', async (req: Request, res: Response) => {
  const games = await prisma.game.findMany()
  if (!games.length) { 
    return res.status(404).send('Nenhum jogo encontrado')
  }
  return res.send(games).status(200)
})

app.get('/users', async (req: Request, res: Response) => {
  const totalUsers = await prisma.user.count()
  const users = await prisma.user.findMany({select: {
      name: true,
      id: true,
    }
  })
  if (!totalUsers) {
    return res.status(404).send('Nenhum usuário encontrado')
  }
  return res.send({users, totalUsers}).status(200)
})