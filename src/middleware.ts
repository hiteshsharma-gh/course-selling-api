import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { TokenDataSchema } from "../schema";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized"
    })
  }

  jwt.verify(token, env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        error: "Invalid token"
      })
    }

    const result = TokenDataSchema.safeParse(decoded)
    if (!result.success) {
      return res.status(422).json({
        error: "Invalid token"
      })
    }

    req.userId = result.data.userId
    req.role = result.data.role
  })

  next()
}
