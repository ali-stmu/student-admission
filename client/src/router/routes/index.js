import { lazy } from "react";
// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/home";

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
