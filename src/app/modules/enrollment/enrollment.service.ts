/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CourseStatus, EnrollmentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { IAuthUser } from "../../types";
import { mappingPercentage } from "../../utils/mappingPercentage";
import { courseService } from "../course/course.service";
import { paymentService } from "../payment/payment.service";
import { enrollRepository } from "./enrollment.repository";
import { IEnroll } from "./enrollment.validation";

const verifyEnrolled = async (courseId: string, studentId: string) => {
  const existingEnroll = await enrollRepository.getOne({ studentId_courseId: { courseId, studentId }, status: EnrollmentStatus.ACTIVE });

  if (!existingEnroll) throw new ApiError(httpStatus.PAYMENT_REQUIRED, `Access denied: Student ${studentId} is not enrolled in course ${courseId}.`
  );
  return existingEnroll
}

const create = async (authUser: IAuthUser, payload: IEnroll) => {

  const course = await courseService.verifyCourseExist(payload.courseId);

  if (course.status !== CourseStatus.PUBLISHED) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Course is not available for enrollment');
  }

  const existingEnrollment = await enrollRepository.getOne({
    studentId_courseId: {
      studentId: authUser.id,
      courseId: course.id,
    },
  },
    { id: true, status: true }
  );

  if (existingEnrollment) {

    if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are already enrolled in this course');
    }

    if (existingEnrollment.status === EnrollmentStatus.DROPPED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You have dropped this course. Contact support to re-enroll')
    }

    if (existingEnrollment.status === EnrollmentStatus.UNPAID) {
      throw new ApiError(httpStatus.BAD_REQUEST,
        'You have a pending payment for this course. Complete payment to continue'
      );
    }
  }

  const price = Number(course.price)

  return prisma.$transaction(async (tnx) => {

    const enrollment = await tnx.enrollment.create({
      data: {
        courseId: course.id,
        studentId: authUser.id,
        status: price > 0 ? EnrollmentStatus.UNPAID : EnrollmentStatus.ACTIVE
      },
      select: {
        id: true,
        status: true,
        enrolledAt: true,
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let payment = null
    // make payment
    if (price > 0) {
      payment = await paymentService.create(tnx, price, enrollment.id);

      const student = await tnx.user.findUnique({ where: { email: authUser.email }, select: { name: true, phone: true } })
      // initiate payment
      const res = await paymentService.initiatePayment({
        courseTitle: course.title,
        total_amount: price,
        tran_id: payment.transactionId as string,
        student: {
          name: student!.name,
          email: authUser.email,
          phone: student!.phone as string
        }
      })
      payment = { ...payment, paymentUrl: res.GatewayPageURL }

      await tnx.payment.update({ where: { id: payment.id }, data: { paymentGateway: res } },)
    }
    return {
      enrollment,
      payment,
      isFee: price === 0
    }
  })



}

const getEnrollmentsByCourseId = async (authUser: IAuthUser, courseId: string) => {

  await courseService.verifyCourseExist(courseId)

  const data = await prisma.course.findFirst({
    where: { id: courseId, instructorId: authUser.id },
    select: {
      id: true,
      title: true,
      overview: true,
      price: true,
      slug: true,

      category: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true
        }
      },
      enrollments: {
        select: {
          id: true,
          lastAccessAt: true,
          lastAccessLessonOrder: true,
          status: true,
          _count: {
            select: {
              lessonProgress: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              photoURL: true
            }
          }
        }
      },
    }
  })
  if (!data) return null;

  const { _count, category, enrollments, ...rest } = data
  return {
    ...rest,
    category: category.name,
    totalEnrollments: _count.enrollments,
    totalLessons: _count.lessons,
    enrolledStudents: enrollments.map(({ _count: e, lastAccessLessonOrder, student, ...rest }) => {
      return {
        enrollInfo: {
          ...rest,
          lastAccessLessonOrder,
          lessonProgressPercentage: mappingPercentage(_count.lessons, lastAccessLessonOrder || e.lessonProgress)
        },
        studentInfo: {
          ...student
        }
      }
    })

  }
}

const getEnrolledByStudentId = async (authUser: IAuthUser) => {
  const enrolls = await enrollRepository.getMany(authUser.id);

  const totalEnrollments = enrolls.length;


  const data = enrolls.map(({ _count, course, lastAccessLessonOrder, ...enroll }) => {
    const { _count: lessonCounts, category, ...rest } = course;

    const totalLessons = lessonCounts.lessons;
    const progress = lastAccessLessonOrder || _count.lessonProgress;

    const lessonProgressPercentage = mappingPercentage(totalLessons, progress)

    return {
      ...enroll,
      lastAccessLessonOrder,
      lessonProgressCount: progress,
      lessonProgressPercentage,
      courseDetails: {
        totalLessons,
        category: category.name,
        ...rest
      }
    };
  });

  return { data, meta: { totalEnrollments } }
}

export const enrollService = { create, verifyEnrolled, getEnrolledByStudentId, getEnrollmentsByCourseId }