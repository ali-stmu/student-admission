import { lazy } from "react";
// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/login";

const studentInfo = JSON.parse(localStorage.getItem("StudentInfo"));
const userRole = studentInfo ? studentInfo.role : null;

// Define routes based on the user's role
let accessibleRoutes = [];
if (userRole === "Student") {
  accessibleRoutes = [
    {
      path: "/home",
      component: lazy(() => import("../../views/Home")),
    },
    {
      path: "/second-page",
      component: lazy(() => import("../../views/SecondPage")),
    },
    {
      path: "/forms/wizard",
      component: lazy(() => import("../../views/forms/wizard")),
    },
    {
      path: "/myapplications",
      component: lazy(() => import("../../views/MyApplications")),
    },
  ];
} else if (userRole === "Admin") {
  accessibleRoutes = [
    {
      path: "/adminhome",
      component: lazy(() => import("../../views/Admin/Home")),
      layout: "HorizontalLayout",
      meta: {
        authRoute: true,
      },
    },
    {
      path: "/applfeereceived",
      component: lazy(() => import("../../views/Admin/ApplicationFeeReceived")),
      layout: "HorizontalLayout",
      meta: {
        authRoute: true,
      },
    },
    {
      path: "/studentInformation/:studentId/:programId",
      component: lazy(() => import("../../views/Admin/StudentInformation")),
      layout: "HorizontalLayout",
      meta: {
        authRoute: true,
      },
    },
    {
      path: "/appfeepending",
      component: lazy(() => import("../../views/Admin/ApplicationFeePending")),
      layout: "HorizontalLayout",
      meta: {
        authRoute: true,
      },
    },
    {
      path: "/appfeeverified",
      component: lazy(() => import("../../views/Admin/ApplicationFeeVerified")),
      layout: "",
      meta: {
        authRoute: true,
      },
    },
    {
      path: "/appfeerejected",
      component: lazy(() => import("../../views/Admin/ApplicationFeeRejected")),
      layout: "HorizontalLayout",
      meta: {
        authRoute: true,
      },
    },
  ];
}

// Define common routes
const commonRoutes = [
  {
    path: "/admission-admin",
    component: lazy(() => import("../../views/pages/authentication/LoginV1")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../../views/Register")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout",
  },
];

// Combine accessible routes with common routes
const Routes = [...accessibleRoutes, ...commonRoutes];

export { DefaultRoute, TemplateTitle, Routes };
