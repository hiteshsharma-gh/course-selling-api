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

export { meRouter }
