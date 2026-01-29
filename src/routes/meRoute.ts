import { Router } from "express";
import { authMiddleware } from "../middleware";
import { tryCatch } from "../../lib/tryCatch";
import { prisma } from "../../lib/db";

const meRouter = Router()

meRouter.get('/me', authMiddleware, async (req, res) => {
  const { data: user, error } = await tryCatch(prisma.user.findUnique({
    where: {
      id: req.userId
    }
  }))
  if (error) {
    return res.status(500).json({
      error: "error while finding user"
    })
  }

  if (user) {
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      role: user.role
    })
  }
})

meRouter.get('/users/:id/purchases', authMiddleware, async (req, res) => {
  if (req.role !== "STUDENT") {
    return res.status(403).json({
      error: "only students can see their purchased courses"
    })
  }

  const { id } = req.params
  if (id !== req.userId) {
    return res.status(403).json({
      error: "students can only access their own courses"
    })
  }

  if (id) {
    const { data: purchases, error } = await tryCatch(prisma.purchase.findMany({
      where: {
        userId: id.toString()
      },
      select: {
        course: true
      }
    }))
    if (error) {
      return res.status(500).json({
        error: "error while getting purchases"
      })
    }

    if (!purchases) {
      return res.status(400).json({
        message: "no purchases"
      })
    }

    return res.status(200).json(purchases)
  }
})

export { meRouter }
