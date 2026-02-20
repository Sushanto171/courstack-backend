
import { Role } from "../../generated/prisma/enums";

export const PERMISSIONS = {
  // Admin Management
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',
  ADMIN_VIEW: 'admin:view',

  // System
  SYSTEM_CONFIGURE: 'system:configure',
  SYSTEM_VIEW_STATS: 'system:view_stats',

  // Instructor
  INSTRUCTOR_CREATE: 'instructor:create',
  INSTRUCTOR_SUSPEND: 'instructor:suspend',
  INSTRUCTOR_REMOVE: 'instructor:remove',
  INSTRUCTOR_VIEW: 'instructor:view',

  // Student
  STUDENT_SUSPEND: 'student:suspend',
  STUDENT_REMOVE: 'student:remove',
  STUDENT_VIEW: 'student:view',

  // Category
  CATEGORY_CREATE: 'category:create',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',
  CATEGORY_VIEW: 'category:view',

  // Course
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE_OWN: 'course:update_own',
  COURSE_DELETE_OWN: 'course:delete_own',
  COURSE_VIEW_OWN: 'course:view_own',
  COURSE_VIEW_ENROLLED: 'course:view_enrolled',
  COURSE_STATUS_UPDATE: 'course:status_update',
  // Course
  LESSON_CREATE: 'lesson:create',
  LESSON_UPDATE: 'lesson:update_own',
  LESSON_DELETE: 'lesson:delete_own',
  LESSON_VIEW: 'lesson:view_own',
  LESSON_STATUS_UPDATE: 'lesson:status_update',

  // Enrollment
  ENROLLMENT_JOIN: 'enrollment:join',
  ENROLLMENT_VIEW_OWN_PROGRESS: 'enrollment:view_own_progress',
  ENROLLMENT_VIEW_STUDENTS: 'enrollment:view_students',

  // common 
  USER_STATUS_UPDATE: 'userStatus:update',
  USER_UPDATE: 'user:update'
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    PERMISSIONS.ADMIN_CREATE,
    PERMISSIONS.ADMIN_UPDATE,
    PERMISSIONS.ADMIN_DELETE,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.INSTRUCTOR_VIEW,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.SYSTEM_CONFIGURE,
    PERMISSIONS.SYSTEM_VIEW_STATS,
    PERMISSIONS.USER_STATUS_UPDATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.COURSE_STATUS_UPDATE,
  ],

  ADMIN: [
    PERMISSIONS.INSTRUCTOR_CREATE,
    PERMISSIONS.INSTRUCTOR_SUSPEND,
    PERMISSIONS.INSTRUCTOR_REMOVE,
    PERMISSIONS.INSTRUCTOR_VIEW,
    PERMISSIONS.STUDENT_SUSPEND,
    PERMISSIONS.STUDENT_REMOVE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.CATEGORY_VIEW,
    PERMISSIONS.USER_STATUS_UPDATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.COURSE_STATUS_UPDATE,

  ],

  INSTRUCTOR: [
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE_OWN,
    PERMISSIONS.COURSE_DELETE_OWN,
    PERMISSIONS.COURSE_VIEW_OWN,
    PERMISSIONS.COURSE_STATUS_UPDATE,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.CATEGORY_VIEW,
    PERMISSIONS.ENROLLMENT_VIEW_STUDENTS,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.LESSON_CREATE,
  ],

  STUDENT: [
    PERMISSIONS.CATEGORY_VIEW,
    PERMISSIONS.COURSE_VIEW_ENROLLED,
    PERMISSIONS.ENROLLMENT_JOIN,
    PERMISSIONS.ENROLLMENT_VIEW_OWN_PROGRESS,
    PERMISSIONS.USER_UPDATE,
  ],
};

// Helper — get permissions for a role
const getPermissionsForRole = (role: Role) => {
  return ROLE_PERMISSIONS[role] || [];
};

export enum ip { "sss", "ere" }

export const permissions = { getPermissionsForRole, PERMISSIONS, ROLE_PERMISSIONS }
