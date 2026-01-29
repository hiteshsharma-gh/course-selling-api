import express from "express"
import { env } from "../env"
import { authRouter } from "./routes/authRoutes"
import { meRouter } from "./routes/meRoute"
import { courseRouter } from "./routes/courseRoutes"
import { lessonRouter } from "./routes/lessonRoute"
import { purchaseRouter } from "./routes/purchaseRoute"

const app = express()

app.use(express.json())

app.use('/', meRouter)
app.use('/auth', authRouter)
app.use('/courses', courseRouter)
app.use('/lessons', lessonRouter)
app.use('/purchases', purchaseRouter)

app.listen(env.PORT, () => console.log("server is listening on port ", env.PORT))
