import { LessonSelect, LessonUpdateInput, LessonWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../config/prisma";
import { ICreateLesson } from "./lesson.validation";

const getLessonsByCourseId = (where: LessonWhereInput, select: LessonSelect) => {
  return prisma.lesson.findFirst({ where, select, orderBy: { order: "asc" } })
}

const create = async (courseId: string, payload: ICreateLesson) => {
  const { title, isPreview, order, text, videos } = payload;

  return prisma.$transaction(async (tnx) => {
    // check order 
    const orderConflict = await tnx.lesson.findFirst({
      where: { courseId, order }
    })

    if (orderConflict) {
      await tnx.lesson.updateMany({
        where: { courseId, order: { gte: order } },
        data: { order: { increment: +1 } }
      })
    }
    // create lesson
    const lesson = await tnx.lesson.create({
      data: {
        title,
        text: text || null,
        order,
        courseId,
        isPreview
      }
    });

    // create lesson video
    if (videos && videos.length) {
      await tnx.lessonVideo.createMany({
        data: videos.map((video) => ({
          title: video.title ?? null,
          url: video.url,
          order: video.order,
          duration: video.duration ?? null,
          lessonId: lesson.id,

        }))
      })
    }

    return tnx.lesson.findFirst({
      where: { id: lesson.id },
      select: {
        id: true,
        title: true,
        order: true,
        isPreview: true,
        text: true,
        status: true,
        publishedAt: true,
        scheduledAt: true,
        createdAt: true,
        updatedAt: true,
        courseId: true,
        lessonVideos: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            url: true,
            order: true,
            duration: true,
          }
        }
      }
    })
  })

}

const updateById = (lessonId: string, courseId: string, data: LessonUpdateInput) => {
  return prisma.lesson.update({ where: { courseId, id: lessonId, }, data })
}

const deleteOne = (lessonId: string, courseId: string,) => {
  return prisma.lesson.delete({ where: { courseId, id: lessonId, } })
}

export const lessonRepository = { create, getLessonsByCourseId, updateById, deleteOne }