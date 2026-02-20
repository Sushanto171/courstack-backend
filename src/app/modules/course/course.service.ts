import { CourseStatus } from "../../../generated/prisma/enums";
import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import { courseRepository } from "./course.repository";
import { ICreateCourse, IUpdateCourse } from "./course.validation";

const getAll = async () => {
  return courseRepository.getAll()
}

const getBySlug = async (slug: string) => {
  return courseRepository.getBySlug(slug)
}

const create = async (authUser: IAuthUser, payload: ICreateCourse) => {

  const baseSlug = payload.title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");

  let slug = baseSlug;
  let count = 1;

  while (await courseRepository.getBySlug(slug)) {
    slug = `${baseSlug}_${count++}`
  }

  const status =
    payload.status && CourseStatus[payload.status as keyof typeof CourseStatus]
      ? CourseStatus[payload.status as keyof typeof CourseStatus]
      : CourseStatus.DRAFT;

  const { categoryId, ...rest } = payload

  return courseRepository.create({
    ...rest,
    status,
    slug,
    instructor: { connect: { id: authUser.id } },
    category: {
      connect: { id: categoryId }
    }
  })

}

const update = async (authUser: IAuthUser, id: string, payload: IUpdateCourse) => {

  const existingCourse = await courseRepository.getByID(id)

  if (!existingCourse) throw new ApiError(httpStatus.NOT_FOUND, "Course dose not found!");

  const isOwner = existingCourse.instructorId === authUser.id;

  if (!isOwner) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");

  const status =
    payload.status && CourseStatus[payload.status as keyof typeof CourseStatus]
      ? CourseStatus[payload.status as keyof typeof CourseStatus]
      : CourseStatus.DRAFT;

  const { categoryId, ...rest } = payload

  return courseRepository.updateById(id, {
    ...rest,
    status,
    category: {
      connect: { id: categoryId }
    }
  })

}




export const courseService = { create, getAll, getBySlug, update }