import { CourseNestedLayout } from ".";

import CourseEnrollment from "@/pages/creator/dashboard/course/[id]/enrollments";

CourseEnrollment.getLayout = CourseNestedLayout;

export default CourseEnrollment;
