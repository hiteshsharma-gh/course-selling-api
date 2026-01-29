import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PurchaseCourseSchema } from "../../schema";
import { tryCatch } from "../../lib/tryCatch";
import { prisma } from "../../lib/db";

const purchaseRouter = Router()

purchaseRouter.post('/', authMiddleware, async (req, res) => {
  if (req.role !== "STUDENT") {
    return res.status(403).json({
      error: "only students can purchase a course"
    })
  }

  const result = PurchaseCourseSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid json"
    })
  }

  if (req.userId) {
    const { data, error } = await tryCatch(prisma.purchase.create({
      data: {
        courseId: result.data.courseId,
        userId: req.userId
      }
    }))
    if (error) {
      return res.status(500).json({
        error: "error while purchasing course"
      })
    }

    return res.status(200).json(data)
  }
})

export { purchaseRouter }
