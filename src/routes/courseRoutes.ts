import { Router } from "express";
import { tryCatch } from "../../lib/tryCatch";
import { prisma } from "../../lib/db";
import { authMiddleware } from "../middleware";
import { CreateCourseSchema, UpdateCourseSchema } from "../../schema";

const courseRouter = Router()

courseRouter.route('/')
  .get(async (req, res) => {
    const { data: courses, error } = await tryCatch(prisma.course.findMany())
    if (error) {
      return res.status(500).json({
        error: "error while fetching courses"
      })
    }

    return res.status(200).json(courses)
  })
  .post(authMiddleware, async (req, res) => {
    const { userId, role } = req
    if (role !== "INSTRUCTOR") {
      return res.status(403).json({
        error: "only instructors can add courses"
      })
    }

    const result = CreateCourseSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid json"
      })
    }

    if (userId) {
      const { data: newCourse, error } = await tryCatch(prisma.course.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          instructorId: userId
        }
      }))
      if (error) {
        return res.status(500).json({
          error: "error while getting courses"
        })
      }

      return res.status(200).json(newCourse)
    }
  })

courseRouter.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params
    const { data: course, error } = await tryCatch(prisma.course.findUnique({
      where: {
        id
      },
      include: {
        lessons: true
      }
    }))
    if (error) {
      return res.status(500).json({
        error: "error while getting courses"
      })
    }

    if (!course) {
      res.status(404).json({
        error: "no course found"
      })
    }

    return res.status(200).json(course)
  })
  .patch(authMiddleware, async (req, res) => {
    if (req.role !== "INSTRUCTOR") {
      return res.status(403).json({
        error: "only instructors can update a course"
      })
    }

    const { id } = req.params

    const result = UpdateCourseSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid json"
      })
    }

    const { data: updatedCourse, error } = await tryCatch(prisma.course.update({
      where: {
        id
      },
      data: req.body
    }))
    if (error) {
      return res.status(500).json({
        error: "error while updating course"
      })
    }

    return res.status(200).json(updatedCourse)
  })
  .delete(authMiddleware, async (req, res) => {
    if (req.role !== "INSTRUCTOR") {
      return res.status(403).json({
        error: "only instructors can delete a course"
      })
    }

    const { id } = req.params

    const { data, error } = await tryCatch(prisma.course.delete({
      where: {
        id
      }
    }))
    if (error) {
      return res.status(500).json({
        error: "error while deleting course"
      })
    }

    return res.status(200).json({
      message: "Course deleted"
    })
  })

courseRouter.get('/:courseId/lessons', async (req, res) => {
  const { courseId } = req.params

  const { data, error } = await tryCatch(prisma.lesson.findMany({
    where: {
      courseId
    }
  }))
  if (error) {
    return res.status(500).json({
      error: "error while finding lessons course"
    })
  }

  return res.status(200).json(data)
})

export { courseRouter }
