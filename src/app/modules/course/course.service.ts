import { CourseStatus, Role } from "../../../generated/prisma/enums";
import { ApiError } from "../../helper/ApiError";
import { formatCourseStatus } from "../../helper/format";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import { courseRepository } from "./course.repository";
import { ICreateCourse, IUpdateCourse } from "./course.validation";

const verifyCourseExist = async (courseId: string) => {
  const existingCourse = await courseRepository.getByID(courseId)

  if (!existingCourse) throw new ApiError(httpStatus.NOT_FOUND, "Course dose not found!");

  return existingCourse;
}


const getAll = async () => {
  return courseRepository.getAll({})
}

const getBySlug = async (slug: string) => {
  return courseRepository.getBySlug(slug)
}

const getMyCourses = async (authUser: IAuthUser) => {
  return courseRepository.getAll({ instructorId: authUser.id, takeInstructorInfo: false, takeDraftCourse: true })
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

  const existingCourse = await verifyCourseExist(id)

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

const updateStatus = async (authUser: IAuthUser, id: string, payload: { status: CourseStatus }) => {

  const existingCourse = await verifyCourseExist(id)

  const canOverrideCourseStatus = authUser.role === Role.SUPER_ADMIN || authUser.role === Role.ADMIN;

  // verify course owner
  const isOwner = existingCourse.instructorId === authUser.id;

  // bypass admin or super admin
  if (!canOverrideCourseStatus && !isOwner) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");

  // instructor can't directly set course status as PUBLISHED or ARCHIVED
  if (isOwner && !canOverrideCourseStatus && (
    payload.status === CourseStatus.PUBLISHED ||
    payload.status === CourseStatus.ARCHIVED
  )
  ) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      `${formatCourseStatus(payload.status)} status cannot be set directly by instructors`
    );
  }

  // instructor can't update published or archived course status
  if (isOwner && !canOverrideCourseStatus && (
    existingCourse.status === CourseStatus.ARCHIVED ||
    existingCourse.status === CourseStatus.PUBLISHED
  )
  ) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      `${formatCourseStatus(existingCourse.status)} courses cannot be modified by instructors`
    );
  }

  const status = payload.status;

  return courseRepository.updateById(id, { status })

}

const softDelete = async (authUser: IAuthUser, id: string) => {

  const existingCourse = await verifyCourseExist(id)

  const isOwner = existingCourse.instructorId === authUser.id;

  if (!isOwner) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");


  return courseRepository.softDeleteByID(id)

}



export const courseService = { verifyCourseExist, create, getAll, getBySlug, update, getMyCourses, updateStatus, softDelete }