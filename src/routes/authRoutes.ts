import { Router } from "express";
import { LoginSchema, SignupSchema } from "../../schema";
import { tryCatch } from "../../lib/tryCatch";
import { prisma } from "../../lib/db";
import bcrypt from "bcrypt"
import { env } from "../../env";
import jwt from "jsonwebtoken"

const authRouter = Router()
console.log("here1")

authRouter.post('/signup', async (req, res) => {
  console.log("here")
  const result = SignupSchema.safeParse(req.body)
  if (!result.success) {
    console.error("1")
    return res.status(400).json({
      error: "Invalid json"
    })
  }

  const { data: existingUser, error: existingUserReadError } = await tryCatch(prisma.user.findUnique({
    where: {
      id: result.data.email
    }
  }))

  if (existingUserReadError) {
    console.error("2")
    return res.status(500).json({
      error: "error while finding user"
    })
  }

  if (existingUser) {
    console.error("3")
    return res.status(409).json({
      error: "user alreadly exists"
    })
  }

  const { data: hash, error: hashingError } = await tryCatch(bcrypt.hash(result.data.password, env.BCRYPT_SALT_ROUNDS))
  if (hashingError) {
    console.error("4")
    return res.status(500).json({
      error: "error while hashing password"
    })
  }

  const { data: newUser, error: newUserCreateError } = await tryCatch(prisma.user.create({
    data: {
      email: result.data.email,
      name: result.data.name,
      password: hash,
      role: result.data.role
    }
  }))
  if (newUserCreateError) {
    console.error("5")
    return res.status(500).json({
      error: "error while creating user"
    })
  }

  return res.status(200).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    createdAt: newUser.createdAt
  })
})

authRouter.post('/login', async (req, res) => {
  console.error("login")
  const result = LoginSchema.safeParse(req.body)
  if (!result.success) {
    console.error("6")
    return res.status(400).json({
      error: "Invalid json"
    })
  }

  const { data: user, error: userReadError } = await tryCatch(prisma.user.findUnique({
    where: {
      email: result.data.email
    }
  }))
  if (userReadError) {
    console.error("7")
    return res.status(500).json({
      error: "error while finding user"
    })
  }

  if (!user) {
    console.error("8")
    return res.status(404).json({
      error: "user doesn't exist"
    })
  }

  const { data: areCredentialsCorrect, error: passwordComparingError } = await tryCatch(bcrypt.compare(result.data.password, user.password))
  if (passwordComparingError) {
    console.error("9")
    return res.status(500).json({
      error: "error while comparing password"
    })
  }

  if (!areCredentialsCorrect) {
    console.error("10")
    return res.status(400).json({
      error: "Invalid credentials"
    })
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET)

  console.log(token)
  return res.status(200).json({ token })
})

export { authRouter }
