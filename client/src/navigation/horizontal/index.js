import { Mail, Home, Package } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
  {
    id: "wizard",
    title: "Admission Form",
    icon: <Package size={20} />,

    navLink: "/forms/wizard",
  },
];
