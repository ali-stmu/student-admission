import { lazy } from "react";
// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/login";

// ** Merge Routes
const Routes = [
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

export { DefaultRoute, TemplateTitle, Routes };
