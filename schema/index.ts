import { z } from 'zod'

const Role = z.enum(["STUDENT", "INSTRUCTOR"])

export const SignupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
  role: Role
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const CreateCourseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number()
})

export const UpdateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional()
})

export const CreateLessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  courseId: z.string()
})

export const PurchaseCourseSchema = z.object({
  courseId: z.string()
})

export const TokenDataSchema = z.object({
  userId: z.string(),
  role: Role
})
