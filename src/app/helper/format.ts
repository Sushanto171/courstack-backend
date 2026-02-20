import { CourseStatus } from "../../generated/prisma/enums";

export function formatCourseStatus(status: CourseStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}