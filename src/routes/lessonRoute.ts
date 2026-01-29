import { Router } from "express";
import { CreateLessonSchema } from "../../schema";
import { authMiddleware } from "../middleware";
import { tryCatch } from "../../lib/tryCatch";
import { prisma } from "../../lib/db";

const lessonRouter = Router()

lessonRouter.post('/', authMiddleware, async (req, res) => {
  if (req.role !== "INSTRUCTOR") {
    return res.status(403).json({
      error: "only instructors can add lessons"
    })
  }

  const result = CreateLessonSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: "invalid json"
    })
  }

  const { data, error } = await tryCatch(prisma.lesson.create({
    data: result.data
  }))
  if (error) {
    return res.status(500).json({
      error: "error while adding lesson"
    })
  }

  return res.status(200).json(data)

})

export { lessonRouter }
