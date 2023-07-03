import React, { type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AdminDashboardLayout } from "../..";
import CourseOverview from "@/pages/creator/dashboard/course/[id]";

const AdminCourseLayoutR = dynamic(
  () => import("@/components/layouts/adminCourseDashboard"),
  {
    ssr: false,
  }
);

const nestLayout = (
  parent: (page: ReactNode) => JSX.Element,
  child: (page: ReactNode) => JSX.Element
) => {
  return (page: ReactNode) => parent(child(page));
};

export const CourseNestedLayout = nestLayout(
  AdminDashboardLayout,
  CourseLayout
);

CourseOverview.getLayout = CourseNestedLayout;

export default CourseOverview;

function CourseLayout(page: ReactNode) {
  return <AdminCourseLayoutR>{page}</AdminCourseLayoutR>;
}

export { CourseLayout };
