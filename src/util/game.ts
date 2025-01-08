import { Game, PrismaClient } from "@prisma/client"
import { RawgGame } from "src/models/rawg.model"
import { LOCALURL } from "./globalVariables"

const prisma = new PrismaClient()

export async function verifyIfGameIsInDatabaseOrRawgGame(id: number | string) {
  let game: RawgGame | Game = (await prisma.game.findFirst({
    where: { id: id.toString() },
  })) as Game
  if (!game) {
    return await fetchRawgGameAndAddToDatabase(Number(id))
  }
  const rawgGame = await getRawgGame(game.rawgId)
  return { libaryGame: game, ...rawgGame }
}

async function fetchRawgGameAndAddToDatabase(id: number) {
  const databaseWithRawgId = await prisma.game.findFirst({
    where: { rawgId: id },
  })
  const rawgGame: RawgGame = await getRawgGame(id)
  if (databaseWithRawgId) {
    return { libaryGame: databaseWithRawgId, ...rawgGame }
  }
  if (!rawgGame) {
    throw new Error("Game not found!")
  }
  const game = await prisma.game.create({
    data: {
      name: rawgGame.name,
      rawgId: rawgGame.id,
      background_image: rawgGame.background_image,
    },
  })
  return { libaryGame: game, ...rawgGame }
}

async function getRawgGame(id: number) {
  return await fetch(LOCALURL + "api/rawgGames/" + id).then((response) =>
    response.json()
  )
}
