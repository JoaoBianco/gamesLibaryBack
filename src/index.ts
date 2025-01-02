import { gameRouter } from "./routes/game"
import { gamesRouter } from "./routes/games"
import { gamesRawgRouter } from "./routes/gamesRawg"

var express = require("express")
const cors = require("cors")
var app = express()
app.use(cors())

app.use(express.urlencoded())
app.use(express.json())
app.use("/api/rawgGames", gamesRawgRouter)
app.use("/api/games", gamesRouter)
app.use("/api/game", gameRouter)

app.listen(3000, async () => {
  console.log("iniciei na porta 3000")
})
