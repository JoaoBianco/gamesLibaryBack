import { Game, PrismaClient } from "@prisma/client";
import { RawgGame } from "src/models/rawg.model";
import { LOCALURL } from "./globalVariables";

const prisma = new PrismaClient()

export async function verifyIfGameIsInDatabaseOrRawgGame(id: number | string) {
  let game: RawgGame | Game = await prisma.game.findUnique({where: {id: id.toString()}}) as unknown as Game
  if (!game) {
    game = await fetchRawgGameAndAddToDatabase(Number(id))
  }
  return game
}

async function fetchRawgGameAndAddToDatabase(id: number) {
  const databaseWithRawgId = await prisma.game.findFirst({where: {rawgId: id}})
  if (databaseWithRawgId) {
    return databaseWithRawgId
  }
  const rawgGame: RawgGame = await fetch(LOCALURL + 'api/rawgGames/' + id).then(response => response.json())
    if (!rawgGame) {
      throw new Error('Game not found!')
    }
    const game = await prisma.game.create({
      data: {
        name: rawgGame.name,
        rawgId: rawgGame.id
      }
    })
    return game
}