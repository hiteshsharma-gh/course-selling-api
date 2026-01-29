import express from "express"
import { env } from "../env"
import { authRouter } from "./routes/authRoutes"
import { meRouter } from "./routes/meRoute"

const app = express()

app.use(express.json())

app.use("/", meRouter)
app.use('/auth', authRouter)

app.listen(env.PORT, () => console.log("server is listening on port ", env.PORT))
